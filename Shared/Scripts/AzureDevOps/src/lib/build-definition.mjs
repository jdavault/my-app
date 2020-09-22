import _ from "lodash";
import {nameToTerraformName, startingForwardSlash, yamlFilePathToPath} from "./terraform.mjs";
import {globalToUsEast1} from "./azure-devops-util.mjs";

export const infrastructurePathRegEx = /(environments|stages)\/(.*?)\/(.*?)\/(.*)\//;
export const infrastructurePipelinePathRegEx = /Infrastructure\/.*?\/pipelines/;
export const dockerPipelinePathRegEx = /Docker\//;
export const scriptPathRegEx = /Scripts\//;

export const pipelineType = {
  Workspace: 'Workspace',
  Infrastructure: 'Infrastructure',
  Docker: 'Docker',
  Service: 'Service',
  Script: 'Script'
};

export const hasAzurePipelineFile = ({process: {type}}) => type === 2;

export const filterYamlFilePath = (yamlFilePaths) => ({process: {yamlFilename: yamlFilePath}}) => yamlFilePaths.includes(yamlFilePath);

export const definitionToTerraform = ({process: {yamlFilename: yamlFilePath}}, gitHubRepositoryName) => yamlFilePathToTerraform(yamlFilePath, gitHubRepositoryName);

export const yamlFilePathToTerraform = (yamlFilePath, gitHubRepositoryName) => {
  const branchName = 'develop';
  const path = yamlFilePathToPath(yamlFilePath);
  let terraformName, name, type;

  const awsMatches = yamlFilePath.match(infrastructurePathRegEx);
  const isInfrastructurePipeline = infrastructurePipelinePathRegEx.test(yamlFilePath);
  const isDockerPipeline = dockerPipelinePathRegEx.test(yamlFilePath);
  const isScriptPipeline = scriptPathRegEx.test(yamlFilePath);
  const serviceMatches = path.match(/([^\\]+)$/);

  if (yamlFilePath === '/azure-pipelines.yml') {
    name = gitHubRepositoryName;
    terraformName = 'workspace';
    type = pipelineType.Workspace;
  } else if (awsMatches) {
    const [, , envOrStage, region, fileName] = awsMatches;
    name = fileName.replace(/[()]/gi, '');
    terraformName = `${envOrStage}_${nameToTerraformName(name)}_${region.replace(/-/g, '_')}`;
    type = envOrStage;
  } else if (serviceMatches) {
    [, name] = serviceMatches;
    if (isInfrastructurePipeline) {
      type = pipelineType.Infrastructure;
    } else if (isDockerPipeline) {
      type = pipelineType.Docker;
    } else if (isScriptPipeline) {
      type = pipelineType.Script;
    } else {
      type = pipelineType.Service;
    }
    terraformName = type.toLowerCase() + '_' + _.snakeCase(nameToTerraformName(name));
  }

  return {branchName, yamlFilePath, path, terraformName, name, type}
};

export const normalize = d => {
  return {
    ...d,
    process: {
      ...d.process,
      yamlFilename: startingForwardSlash(d.process.yamlFilename)
    },
  };
};

export const sortByTerraformName = (a, b) => {
  if (a.terraformName < b.terraformName) {
    return -1;
  }
  if (a.terraformName > b.terraformName) {
    return 1;
  }
  return 0;
};

export const includeShared = [
  'Shared/AzurePipelines/CI/terragrunt-jobs.yml',
  'Shared/AzurePipelines/CI/terragrunt-steps.yml',
  'Shared/AzurePipelines/Tools/node-steps.yml'
];

export const terragruntJob = (template, stageOrEnv, region, terragruntRoot) => {
  const displayName = `${stageOrEnv.toUpperCase()} (${region})`;
  const name = displayName.replace(/[()]/gi, '').replace(/[\s-]/gi, '_').toUpperCase();
  const isProd = name.startsWith('PROD') || name.startsWith('BETA') || name.startsWith('ALPHA') || name.startsWith('ACCOUNT');
  const parameters = {
    displayName: displayName,
    name,
    regionName: globalToUsEast1(region),
    terragruntRoot
  };
  return {
    template,
    parameters: isProd ? {...parameters, variablesFileName: 'prod-vars.yml'} : parameters
  };
};
