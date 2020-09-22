import azureDevOps from "azure-devops-node-api";
import _ from "lodash";

export const azurePipelinesFileName = 'azure-pipelines.yml';
export const {AZDO_PERSONAL_ACCESS_TOKEN: token, AZDO_ORG_SERVICE_URL: url} = process.env;
export const authHandler = azureDevOps.getPersonalAccessTokenHandler(token);
export const webApi = new azureDevOps.WebApi(url, authHandler);
export const stageRegEx = /(NON_PROD|DEV|QA|STAGING|ALPHA|BETA|PROD|SHARED)/;
export const envRegEx = /(NON_PROD|DEV|QA|STAGING|ALPHA|BETA|PROD|SHARED)_\d/;
export const regionRegEx = /(us[-_](east|west)[-_][12]|global)/i;
export const itemRegEx = new RegExp(`^(?!NON)(.*?)_${stageRegEx.source}`);
export const globalToUsEast1 = (region) => region === 'global' ? 'us-east-1' : region;
export const stageSortBy = ['non-prod', 'dev', 'qa', 'staging', 'alpha', 'beta', 'prod'];
export const stageSort = (a, b) => stageSortBy.indexOf(_.kebabCase(a)) - stageSortBy.indexOf(_.kebabCase(b));
export const envSort = (a, b) => stageSort(a.toUpperCase().match(stageRegEx)[1], b.toUpperCase().match(stageRegEx)[1]);

export const azurePipelineDependencyMap = {
  'csharp-aws-sam-jobs.yml': [
    'Shared/AzurePipelines/CI/csharp-aws-sam-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/dotnet-steps.yml',
    'Shared/AzurePipelines/CI/csharp-aws-sam-steps.yml'
  ],
  'csharp-nuget-jobs.yml': [
    'Shared/AzurePipelines/CI/csharp-nuget-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/dotnet-steps.yml',
    'Shared/AzurePipelines/CI/csharp-nuget-steps.yml'
  ],
  'functionbeat-build-jobs.yml': [
    'Shared/AzurePipelines/CI/functionbeat-build-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/node-steps.yml',
    'Shared/AzurePipelines/CI/functionbeat-build-steps.yml'
  ],
  'serverless-jobs.yml': [
    'Shared/AzurePipelines/CI/serverless-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/CI/serverless-steps.yml'
  ],
  'terragrunt-aws-sam-jobs.yml': [
    'Shared/AzurePipelines/CI/terragrunt-aws-sam-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/node-steps.yml',
    'Shared/AzurePipelines/CI/artifact-aws-sam-steps.yml',
    'Shared/AzurePipelines/CI/terragrunt-steps.yml'
  ],
  'terragrunt-jobs.yml': [
    'Shared/AzurePipelines/CI/terragrunt-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/node-steps.yml',
    'Shared/AzurePipelines/CI/terragrunt-steps.yml'
  ],
  'terragrunt-serverless-jobs.yml': [
    'Shared/AzurePipelines/CI/terragrunt-serverless-jobs.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/node-steps.yml',
    'Shared/AzurePipelines/CI/artifact-serverless-steps.yml',
    'Shared/AzurePipelines/CI/terragrunt-steps.yml'
  ],
  'mocha-jobs.yml': [
    'Shared/AzurePipelines/CI/mocha-steps.yml',
    'AzurePipelines/CI/non-prod-vars.yml',
    'AzurePipelines/CI/prod-vars.yml',
    'Shared/AzurePipelines/Tools/node-steps.yml'
  ],
}
