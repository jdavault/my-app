import {azurePipelinesFileName} from "./azure-devops-util.mjs";

export const importBuildDefinitionStatement = ({terraformName, id, projectId}) => `terragrunt import "azuredevops_build_definition.${terraformName}" "${projectId}/${id}"`;

export const buildDefinitionResource = (repoShortUrl) => ({terraformName, path, yamlFilePath, type, name, branchName, repoName}) => `
resource "azuredevops_build_definition" "${terraformName}" {
  project_id = var.project_id
  agent_pool_name = "Hosted Ubuntu 1604"
  name = "${name} (${type.toUpperCase()})"
  path = "${path}"

  ci_trigger {
    use_yaml = true
  }

  pull_request_trigger {
    use_yaml = true

    forks {
      enabled = false
      share_secrets = false
    }
  }

  repository {
    yml_path = "${yamlFilePath.replace(/^\//, '')}"
    repo_type = "GitHub"
    repo_id = "${repoShortUrl}"
    branch_name = "${branchName}"
    service_connection_id = var.service_endpoint_github_id
  }
}`;

export const buildDefinitionOutput = ({terraformName}) => `
output "${terraformName}_id" {
  value = azuredevops_build_definition.${terraformName}.id
}`;

const stringifyArray = (str) => JSON.stringify(str).replace(/,/g, ', ')

export const releaseDefinitionHcl = ({name, type, path, items, stages, environments, regions, agentPoolId, buildTerraformName}) => `
terraform {
  source = "\${local.dirs.azure-devops_modules.shared}/release-definition"
}

include {
  path = "\${find_in_parent_folders()}"
}

dependencies {
  paths = [
    "../project",
    "../build-definition"
  ]
}

dependency "project" {
  config_path = "../project"
  mock_outputs = {
    id = "temporary-id"
  }
}

dependency "build-definition" {
  config_path = "../build-definition"
  mock_outputs = {
    ${buildTerraformName}_id = "temporary-${buildTerraformName}_id"
  }
}

locals {
  dirs = yamldecode(file("\${get_parent_terragrunt_dir()}/common/dirs.yml"))
  workspace = jsondecode(file("\${get_parent_terragrunt_dir()}/../../workspace.json"))
  non_prod = yamldecode(file("\${get_parent_terragrunt_dir()}/../../AzurePipelines/CI/non-prod-vars.yml"))
  prod = yamldecode(file("\${get_parent_terragrunt_dir()}/../../AzurePipelines/CI/prod-vars.yml"))
  service_connections = local.workspace.azureDevOps.project.serviceConnections
  teams = local.workspace.azureDevOps.project.teams
  plan_steps = "\${local.dirs.azure-pipelines_cd.shared}/terraform-plan-steps.yml"
  apply_steps = "\${local.dirs.azure-pipelines_cd.shared}/terraform-apply-steps.yml"
  step_default = jsondecode(file("\${get_parent_terragrunt_dir()}/common/step.json"))
  non_prod_steps = {
    apply = yamldecode(templatefile(local.apply_steps, {aws_credentials = local.service_connections.aws.releasePipeline.id}))
  }
  prod_steps = {
    plan = yamldecode(templatefile(local.plan_steps, {aws_credentials = local.service_connections.aws.otaReleasePipeline.id}))
    apply = yamldecode(templatefile(local.apply_steps, {aws_credentials = local.service_connections.aws.otaReleasePipeline.id}))
  }
}

inputs = {
  name = "${name} (${type.toUpperCase()})"
  path = "${path}"
  artifact_alias = "${name}"

  items = ${stringifyArray(items)}
  stages = ${stringifyArray(stages)}
  environments = ${stringifyArray(environments)}
  owners = {
    non_prod = local.teams.devOps.identityId
    dev = local.teams.developers.identityId
    qa = local.teams.qa.identityId
    staging = local.teams.qa.identityId
    prod = local.teams.devOps.identityId
    shared = local.teams.devOps.identityId
  }
  approvers = {
    non_prod = local.teams.devOps.identityId
    dev = null
    qa = local.teams.qa.identityId
    staging = local.teams.qa.identityId
    prod = local.teams.devOps.identityId
    shared = local.teams.devOps.identityId
  }

  regions = ${stringifyArray(regions)}

  agent_pool_id = ${agentPoolId}

  build_pipeline_id = dependency.build-definition.outputs.${buildTerraformName}_id
  jira_service_endpoint_id = local.service_connections.jira.app.id
  project_id = dependency.project.outputs.id
  non_prod_steps = {
    apply = [for s in local.non_prod_steps.apply: merge(local.step_default, s)]
  }
  prod_steps = {
    plan = [for s in local.prod_steps.plan: merge(local.step_default, s)]
    apply = [for s in local.prod_steps.apply: merge(local.step_default, s)]
  }
}`.trim();

export const startingForwardSlash = (s) => '/' + s.replace(/^\//, '');
export const yamlFilePathToPath = (y) => '\\\\' + y.replace(/^\//, '').replace(new RegExp('/?' + azurePipelinesFileName), '').replace(/pipelines\//, '').replace(/\//gi, '\\\\');
export const nameToTerraformName = (n) => n.replace(/[()]/gi, '').replace(/\./gi, '_').replace(/-/g, '_');
export const terraformWithOverride = (overrides) => (t) => overrides.hasOwnProperty(t.name) ? {...t, ...overrides[t.name]} : t;
