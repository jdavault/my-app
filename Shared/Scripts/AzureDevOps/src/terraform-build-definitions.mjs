import {azurePipelinesFileName, webApi} from "./lib/azure-devops-util.mjs";
import {
  buildDefinitionResource,
  importBuildDefinitionStatement,
  buildDefinitionOutput,
  terraformWithOverride
} from "./lib/terraform.mjs";
import {
  definitionToTerraform,
  filterYamlFilePath,
  hasAzurePipelineFile,
  normalize,
  sortByTerraformName,
  yamlFilePathToTerraform
} from "./lib/build-definition.mjs";
import {and, silenceTerragrunt} from "./lib/shell-util.mjs";
import {infrastructurePaths, normalizeWorkspaceRootPath, workspaceRootPath} from "./lib/workspace.mjs";
import {promises} from "fs";
import {join} from "path";
import workspace from '../../../../workspace.json';
import {globExcludeNodeModules, mkdirp} from "./lib/file-util.mjs";

const {writeFile} = promises;

const {
  gitHub: {repository: {name: gitHubRepositoryName, shortUrl: gitHubRepositoryShortUrl}},
  azureDevOps: {project: {name: projectName}},
  terraform: {overrides},
} = workspace;
const mapTerraformWithOverride = terraformWithOverride(overrides);

(async () => {
  const buildDefinitionPath = join(infrastructurePaths.azureDevOps, projectName.toLowerCase(), 'build-definition');
  const importFilePath = join(buildDefinitionPath, 'import.md');
  const mainFilePath = join(buildDefinitionPath, 'local.main.tf');
  const outputFilePath = join(buildDefinitionPath, 'local.outputs.tf');

  const pipelineAbsolutePaths = await globExcludeNodeModules(`${workspaceRootPath}/**/${azurePipelinesFileName}`);
  if (!pipelineAbsolutePaths.length) {
    console.log('No Azure Pipelines found.');
    return;
  }
  const pipelinePaths = pipelineAbsolutePaths
    .filter(p => !p.includes('Shared/AzurePipelines/Templates'))
    .map(p => '/' + p.replace(normalizeWorkspaceRootPath, ''));

  const buildApi = await webApi.getBuildApi();
  const definitionsIds = await buildApi.getDefinitions(projectName);
  const definitions = await Promise.all(definitionsIds.map(b => buildApi.getDefinition(projectName, b.id)));

  const existing = definitions
    .filter(hasAzurePipelineFile)
    .map(normalize)
    .filter(filterYamlFilePath(pipelinePaths));
  if (existing.length) {
    console.log(`Found ${existing.length} of ${pipelinePaths.length} existing pipelines on Azure DevOps`);
  }

  const imports = existing
    .map(normalize)
    .map(d => {
      const {terraformName} = definitionToTerraform(d, gitHubRepositoryName);
      return {terraformName, id: d.id, projectId: d.project.id};
    })
    .sort(sortByTerraformName)
    .map(importBuildDefinitionStatement);

  const buildDefinitionResources = pipelinePaths
    .map(b => yamlFilePathToTerraform(b, gitHubRepositoryName))
    .map(mapTerraformWithOverride)
    .sort(sortByTerraformName)
    .map(buildDefinitionResource(gitHubRepositoryShortUrl));

  const buildDefinitionOutputs = pipelinePaths
    .map(b => yamlFilePathToTerraform(b, gitHubRepositoryName))
    .map(mapTerraformWithOverride)
    .sort(sortByTerraformName)
    .map(buildDefinitionOutput);

  await mkdirp(buildDefinitionPath);

  console.log(`Writing ${imports.length} imports to ${importFilePath}`);
  await writeFile(importFilePath, imports.join(silenceTerragrunt + and) + '\n');

  console.log(`Writing ${buildDefinitionResources.length} azuredevops_build_definitions to: ${mainFilePath}`);
  await writeFile(mainFilePath, buildDefinitionResources.join('\n') + '\n');

  console.log(`Writing ${buildDefinitionOutputs.length} azuredevops_build_definitions to ${outputFilePath}`);
  await writeFile(outputFilePath, buildDefinitionOutputs.join(`\n`) + '\n');
})();
