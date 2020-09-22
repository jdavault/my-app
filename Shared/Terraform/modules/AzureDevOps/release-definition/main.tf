locals {
  artifactRootPrefix = "$(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/"

  envStageMap = {
    "dev" = "dev"
    "qa" = "qa"
    "staging" = "staging"
    "alpha" = "prod"
    "beta" = "prod"
    "prod" = "prod"
  }

  stageTypeMap = {
    "non_prod" = "unmapped"
    "dev" = "development"
    "qa" = "testing"
    "staging" = "staging"
    "prod" = "production"
    "shared" = "production"
  }

  stageArtifactFilterMap = {
    "non_prod" = ["refs/pull/*", "feature/*", "release/*", "bugfix/*", "hotfix/*"]
    "dev" = ["refs/pull/*", "feature/*", "release/*", "bugfix/*", "hotfix/*"]
    "qa" = ["refs/pull/*"]
    "staging" = ["refs/pull/*"]
    "prod" = ["master"]
    "shared" = ["master"]
  }

  stagePrevStageMap = {
    "qa" = "DEV"
    "staging" = "QA"
    "prod" = "STAGING"
  }

  envStagePrevEnvStageMap = {
    "qa" = "DEV"
    "staging" = "QA"
    "alpha" = "STAGING"
    "beta" = "STAGING"
    "prod" = "BETA"
  }

  stageAwsEnvMap = {
    "non_prod" = "non_prod"
    "dev" = "non_prod"
    "qa" = "non_prod"
    "staging" = "non_prod"
    "prod" = "prod"
    "shared" = "prod"
  }

  stages_0 = [for s in var.stages: {
    code = replace(lower(s), "-", "_")
    name = replace(upper(s), "-", "_")
  }]

  stages_1 = [for s in local.stages_0: merge(s, {
    stage_name = s.name,
    environment_type = lookup(local.stageTypeMap, s.code, null)
    aws_env = lookup(local.stageAwsEnvMap, s.code, "non_prod")
    owner_id = lookup(var.owners, s.code, null),
    approver_id = lookup(var.approvers, s.code, null)
    artifact_filters = lookup(local.stageArtifactFilterMap, s.code, [])
    after_stage_name = s.code == "prod" && contains(var.stages, "non-prod") ? "NON_PROD" : contains(var.stages,
    lower(lookup(local.stagePrevStageMap, s.code, ""))) ? lookup(local.stagePrevStageMap, s.code, null) : null
  })]

  stages_2 = [for s in local.stages_1: merge(s, {
    plan_steps = s.aws_env == "prod" ? var.prod_steps.plan : []
    apply_steps = s.aws_env == "prod" ? var.prod_steps.apply : var.non_prod_steps.apply
  })]

  stage_3 = [for i in range(max(length(var.items), 1) * length(var.stages)): merge(
  local.stages_2[floor(i / max(length(var.items), 1))],
  {
    item_name = length(var.items) > 0 ? upper(replace(var.items[i % length(var.items)], " ", "_")) : null
  }
  )]

  stages = [for i in range(max(length(var.items), 1) * length(var.stages) * length(var.regions)): merge(
  local.stage_3[i % length(local.stage_3)],
  {
    region_name = upper(replace(var.regions[floor(i / length(local.stage_3))], "-", "_"))
  }
  )]

  environments_0 = [for e in var.environments: {
    code = lower(split("-", e)[0]),
    name = upper(replace(e, "-", "_"))
    number = split("-", e)[1]
  }]

  environments_1 = [for e in local.environments_0: merge(e, {
    stage_code = lookup(local.envStageMap, e.code, null)
    prev_env_code = lower(lookup(local.envStagePrevEnvStageMap, e.code, ""))
  })]

  environments_2 = [for e in local.environments_1: merge(e, {
    environment_name = e.name
    environment_number = e.number
    environment_type = lookup(local.stageTypeMap, e.stage_code, null)
    aws_env = lookup(local.stageAwsEnvMap, e.stage_code, "non_prod")
    owner_id = lookup(var.owners, e.stage_code, null),
    approver_id = lookup(var.approvers, e.stage_code, null),
    artifact_filters = lookup(local.stageArtifactFilterMap, e.stage_code, [])
    after_stage_name = lookup(local.envStagePrevEnvStageMap, e.code == "prod" && !contains(var.environments, join("-", [
      e.prev_env_code,
      e.number])) ? "beta" : e.code, null)
    after_env_number = contains(var.environments, join("-", [
      e.prev_env_code,
      e.number])) ? e.number : 1
  })]

  environments_3 = [for e in local.environments_2: merge(e, {
    plan_steps = e.aws_env == "prod" ? var.prod_steps.plan : []
    apply_steps = e.aws_env == "prod" ? var.prod_steps.apply : var.non_prod_steps.apply
  })]

  environments_4 = [for i in range(max(length(var.items), 1) * length(var.environments)): merge(
  local.environments_3[floor(i / max(length(var.items), 1))],
  {
    item_name = length(var.items) > 0 ? upper(replace(var.items[i % length(var.items)], " ", "_")) : null
  }
  )]

  environments = [for i in range(max(length(var.items), 1) * length(var.environments) * length(var.regions)): merge(
  local.environments_4[i % length(local.environments_4)],
  {
    region_name = upper(replace(var.regions[floor(i / length(local.environments_4))], "-", "_"))
  }
  )]

  stages_and_environments = concat(
  [for s in local.stages: merge(s, {
    name = s.item_name == null  ? "${s.stage_name}_${s.region_name}" : "${s.item_name}_${s.stage_name}_${s.region_name}"
    after_release = s.after_stage_name == null ? [
      true] : []
    after_stage = s.after_stage_name != null ? [
      s.item_name == null ? "${s.after_stage_name}_${s.region_name}" : "${s.item_name}_${s.after_stage_name}_${s.region_name}"
    ] : [],
  })],
  [for e in local.environments: merge(e, {
    name = e.item_name == null ? "${e.environment_name}_${e.region_name}" : "${e.item_name}_${e.environment_name}_${e.region_name}"
    after_release = e.after_stage_name == null ? [
      true] : []
    after_stage = e.after_stage_name != null ? [
      e.item_name == null ? "${e.after_stage_name}_${e.after_env_number}_${e.region_name}" : "${e.item_name}_${e.after_stage_name}_${e.after_env_number}_${e.region_name}"] : [],
  })]
  )
}

resource "azuredevops_release_definition" "this" {
  project_id = var.project_id
  name = var.name
  path = var.path
  description = "Managed by Terraform"
  tags = []
  variable_groups = []

  build_artifact {
    alias = var.artifact_alias
    project_id = var.build_pipeline_project_id != null ? var.build_pipeline_project_id : var.project_id
    build_pipeline_id = var.build_pipeline_id
    is_primary = true
    is_retained = false
    specify {}
    // should this be latest? // latest {}
  }

  dynamic "stage" {
    for_each = local.stages_and_environments
    content {
      name = stage.value.name
      owner_id = stage.value.owner_id
      variable_groups = []

      properties {
        boards_environment_type = stage.value.environment_type
        jira_environment_type = stage.value.environment_type
        link_boards_work_items = true
        link_jira_work_items = true
      }

      environment_options {
        auto_link_work_items = true
        badge_enabled = true
      }

      dynamic "after_release" {
        for_each = stage.value.after_release
        content {}
      }

      dynamic "after_stage" {
        for_each = stage.value.after_stage
        content {
          stage_name = after_stage.value
        }
      }

      artifact_filter {
        artifact_alias = var.artifact_alias
        dynamic "include" {
          for_each = stage.value.artifact_filters
          content {
            branch_name = include.value
          }
        }
      }

      dynamic "job" {
        for_each = length(stage.value.plan_steps) > 0 ? [true] : []

        content {
          agent {
            name = "TERRAFORM_PLAN"
            timeout_in_minutes = 0
            max_execution_time_in_minutes = 1
            allow_scripts_to_access_oauth_token = false
            skip_artifacts_download = false

            agent_pool_hosted_azure_pipelines {
              // TODO : move to worksapce. TODO : get values from terraform
              agent_pool_id = var.agent_pool_id
              agent_specification = "ubuntu-18.04"
            }

            build_artifact_download {
              artifact_alias = var.artifact_alias
              include = [
                "${stage.value.name}/**"]
            }

            dynamic "task" {
              for_each = stage.value.plan_steps
              content {
                task = task.value["task"]
                always_run = task.value["alwaysRun"]
                condition = task.value["condition"]
                continue_on_error = task.value["continueOnError"]
                enabled = task.value["enabled"]
                display_name = task.value["displayName"]
                override_inputs = task.value["overrideInputs"]
                timeout_in_minutes = task.value["timeoutInMinutes"]
                inputs = task.value["inputs"]
                environment = task.value["environment"]
              }
            }
          }
        }
      }

      dynamic "job" {
        for_each = length(stage.value.plan_steps) > 0 ? [true] : []
        content {
          agentless {
            name = "TERRAFORM_REVIEW"
            task {
              task = "ManualIntervention@8"
              display_name = "Review Terraform Plan"
              inputs = {
                instructions = "Please review the terraform plan."
              }
            }
          }
        }
      }

      job {
        agent {
          name = "TERRAFORM_APPLY"
          timeout_in_minutes = 0
          max_execution_time_in_minutes = 1
          allow_scripts_to_access_oauth_token = false
          skip_artifacts_download = false

          agent_pool_hosted_azure_pipelines {
            // TODO : move to worksapce. TODO : get values from terraform
            agent_pool_id = var.agent_pool_id
            agent_specification = "ubuntu-18.04"
          }

          build_artifact_download {
            artifact_alias = var.artifact_alias
            include = [
              "${stage.value.name}/**"]
          }

          dynamic "task" {
            for_each = stage.value.apply_steps
            content {
              task = task.value["task"]
              always_run = task.value["alwaysRun"]
              condition = task.value["condition"]
              continue_on_error = task.value["continueOnError"]
              enabled = task.value["enabled"]
              display_name = task.value["displayName"]
              override_inputs = task.value["overrideInputs"]
              timeout_in_minutes = task.value["timeoutInMinutes"]
              inputs = task.value["inputs"]
              environment = task.value["environment"]
            }
          }
        }
      }

      deploy_step {}

      pre_deploy_approval {
        approval {
          approver_id = stage.value.approver_id
        }
      }

      post_deploy_approval {
        approval {}
      }

      retention_policy {}

      pre_deploy_gate {}

      post_deploy_gate {}

      variable {
        name = "artifactRoot"
        value = "$(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/${stage.value.name}/"
        allow_override = false
        is_secret = false
      }
    }
  }

  properties {
    integrate_jira_work_items = true
    integrate_boards_work_items = true
    jira_service_endpoint_id = var.jira_service_endpoint_id
  }
}