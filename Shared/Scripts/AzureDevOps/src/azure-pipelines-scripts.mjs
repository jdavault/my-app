import {promises} from "fs";
import {basename, dirname} from "path";
import {normalizeWorkspaceRootPath, workspaceRootPath} from "./lib/workspace.mjs";
import _ from 'lodash';
import {jsonFromYamlPath, overwriteFile, globExcludeNodeModules} from "./lib/file-util.mjs";
import {azurePipelineDependencyMap} from "./lib/azure-devops-util.mjs";

const {lstat} = promises;

(async () => {

  const shared = await globExcludeNodeModules(`${workspaceRootPath}/Shared/Scripts/*/azure-pipelines.yml`);
  const local = await globExcludeNodeModules(`${workspaceRootPath}/Scripts/*/azure-pipelines.yml`);
  const scriptsAzurePipelines = [...local, ...shared];
  console.log(scriptsAzurePipelines);

  console.log(`There are ${scriptsAzurePipelines.length} script pipelines.`);

  const azurePipelines = scriptsAzurePipelines
    .map(async azurePipelineFilePath => {
      const dir = dirname(azurePipelineFilePath);

      const [azurePipelineYaml] = await jsonFromYamlPath(azurePipelineFilePath);
      const {stages, trigger: {paths: triggerPaths}, pr: {paths: prPaths}} = azurePipelineYaml;

      const templates = stages
        .flatMap(({jobs}) => jobs.map(j => j.template))
        .filter(t => t.includes('../../AzurePipelines/CI') || t.includes('Shared/AzurePipelines/CI'))
        .map(t => basename(t));

      const azureJobsDeps = _.uniq(templates).flatMap(k => azurePipelineDependencyMap[k].map(p => `${normalizeWorkspaceRootPath}${p}`));

      const paths = await Promise.all([
        dir,
        ...azureJobsDeps
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
