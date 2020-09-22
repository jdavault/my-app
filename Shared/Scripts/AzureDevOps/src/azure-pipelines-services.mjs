import {basename, dirname, join} from "path";
import {normalizeWorkspaceRootPath, workspaceRootPath} from "./lib/workspace.mjs";
import _ from 'lodash';
import {jsonFromYamlPath, jsonFromHclPath, overwriteFile, globExcludeNodeModules} from "./lib/file-util.mjs";
import {toUnixPath} from "./lib/shell-util.mjs";
import {azurePipelineDependencyMap} from "./lib/azure-devops-util.mjs";


(async () => {

  const serviceAzurePipelines = await globExcludeNodeModules(`${workspaceRootPath}/*/azure-pipelines.yml`);
  console.log(serviceAzurePipelines);

  console.log(`There are ${serviceAzurePipelines.length} service pipelines.`);
  const [dirs] = await jsonFromYamlPath(`${workspaceRootPath}/Infrastructure/AWS/common/dirs.yml`);
  const azurePipelines = serviceAzurePipelines
    .map(async azurePipelineFilePath => {
      const dir = dirname(azurePipelineFilePath);
      const serviceName = _.kebabCase(basename(dir));
      const serviceDirs = await globExcludeNodeModules(`${workspaceRootPath}/**/service_${serviceName}*/`);
      const infraHclFilePaths = await globExcludeNodeModules(`${workspaceRootPath}/Infrastructure/**/service_${serviceName}*/*.hcl`);

      let hclDeps = [];
      // NOTE : this is only direct dependencies.
      // TODO : Make this recursive. IE Go down the tree.
      for (const hclFilePath of infraHclFilePaths) {
        try {
          const hcl = await jsonFromHclPath(hclFilePath);
          if (!hcl.hasOwnProperty('dependencies')) {
            if (hcl.hasOwnProperty('dependency')) {
              console.log(`HCL containing dependency is missing dependencies block: ${hclFilePath}`);
            }
            continue;
          }
          const {dependency, dependencies: {paths: dependenciesPaths}} = hcl;

          const dependencyPaths = Object.entries(dependency).map(([k, v]) => v.config_path);
          if (!_.isEqual(dependenciesPaths.sort(), dependencyPaths.sort())) {
            console.log(`[WARN] dependencies and dependency do not match in ${hclFilePath}`)
          }
          const tagsPath = join(dirname(hclFilePath), '../../', 'tags.yml');
          const [tags] = await jsonFromYamlPath(tagsPath);
          const local = {dirs, tags};
          const parsedPaths = dependencyPaths
            .map(p => eval('`' + p.replace(/\.(us-(east|west|)-\d|non-prod)/g, `["$1"]`) + '`'))
            .map(p => join(dirname(hclFilePath), p))
            .map(toUnixPath);
          hclDeps = _.uniq(hclDeps.concat(parsedPaths));
        } catch (e) {
          console.log(`Unable to read HCL file ${hclFilePath}`);
        }
      }

      const [azurePipelineYaml] = await jsonFromYamlPath(azurePipelineFilePath);
      const {stages, trigger: {paths: triggerPaths}, pr: {paths: prPaths}} = azurePipelineYaml;

      // Get the templates from the Infrastructure/*/pipelines/*.yml files.
      const infraYamlFilePaths = await globExcludeNodeModules(`${workspaceRootPath}/Infrastructure/**/service_${serviceName}/*.yml`);
      const infraYamls = await Promise.all(infraYamlFilePaths.flatMap(yamlFilePath => jsonFromYamlPath(yamlFilePath)));

      const templates = [...stages, ...infraYamls.map(([y]) => y)]
        .flatMap(({jobs}) => jobs.map(j => j.template))
        .filter(t => t.includes('Shared/AzurePipelines/CI'))
        .map(t => basename(t));

      const azureJobsDeps = _.uniq(templates).flatMap(k => azurePipelineDependencyMap[k].map(p => `${normalizeWorkspaceRootPath}${p}`));

      const paths = await Promise.all([
        dir,
        ...serviceDirs,
        ...azureJobsDeps,
        ...hclDeps
      ].map(async p => {
        const stat = await lstat(p);
        const path = stat.isFile() ? p : p.replace(/\/?$/, '/*');
        return path.replace(normalizeWorkspaceRootPath, '');
      }));

      const originalPaths = _.uniq([...triggerPaths.include, ...prPaths.include])
      const allPaths = _.uniq([...originalPaths, ...paths]);

      triggerPaths.include = allPaths;
      prPaths.include = allPaths;

      await overwriteFile(azurePipelineFilePath, azurePipelineYaml);
    });

  await Promise.allSettled(azurePipelines);
})();
