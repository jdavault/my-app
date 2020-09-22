import {promises} from "fs";
import {join, basename} from "path";
import {normalizeWorkspaceRootPath, templatePaths, workspaceRootPath} from "./lib/workspace.mjs";
import _ from 'lodash';
import {includeShared, infrastructurePathRegEx, terragruntJob} from './lib/build-definition.mjs';
import {globExcludeNodeModules, jsonFromYamlPath, overwriteFile} from "./lib/file-util.mjs";

const {mkdir} = promises;
const template = '../../../../Shared/AzurePipelines/CI/terragrunt-jobs.yml';

(async () => {
  const infrastructureTemplatePath = join(templatePaths.azurePipelines, 'infrastructure/azure-pipelines.yml');
  const yaml = await jsonFromYamlPath(infrastructureTemplatePath);

  const stageDirs = await globExcludeNodeModules(`${workspaceRootPath}/**/Infrastructure/AWS/*/stages/*/*/*/`);
  const stageInfra = _.uniq(stageDirs.map(d => basename(d))).filter(d => !d.startsWith('service_'));

  console.log(`There are ${stageInfra.length} infrastructure items detected inside of stages.`);

  const envDirs = await globExcludeNodeModules(`${workspaceRootPath}/**/Infrastructure/AWS/*/environments/*/*/*/`);
  const envInfra = _.uniq(envDirs.map(d => basename(d))).filter(d => !d.startsWith('service_'));

  console.log(`There are ${envInfra.length} infrastructure items detected inside of environments.`);

  const azurePipelines = [
    ...stageInfra,
    ...envInfra
  ].map(async d => {
    const dir = `Infrastructure/AWS/pipelines/${d}`;
    const azurePipelinesFilePath = join(`${workspaceRootPath}/${dir}/azure-pipelines.yml`);

    const [updatedYaml] = yaml.map(p => {
      const dirs = [...stageDirs, ...envDirs]
        .filter(s => s.endsWith(`/${d}/`))
        .map(s => s.replace(normalizeWorkspaceRootPath, ''));

      const include = [
        dir + '/*',
        ...dirs.map(d => d + '*'),
        ...includeShared,
      ];

      const jobs = dirs.map(d => {
        const [, , stageOrEnv, region] = d.match(infrastructurePathRegEx);
        return terragruntJob(template, stageOrEnv, region, d);
      });

      return {
        ...p,
        trigger: {
          ...p.trigger,
          paths: {include}
        },
        pr: {
          ...p.pr,
          paths: {include}
        },
        stages: [
          ...p.stages.map(s => {
            s.jobs = jobs;
            return s;
          })
        ]
      };
    });

    await
    await overwriteFile(azurePipelinesFilePath, updatedYaml);
  });

  await Promise.allSettled(azurePipelines);
})();
