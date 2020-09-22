variable "name" {
  type = string
  default = null
}

variable "path" {
  type = string
  default = null
}

variable "items" {
  type = list(string)
  default = null
}

variable "owners" {
  type = object({
    dev = string,
    qa = string,
    staging = string,
    prod = string,
    shared = string,
    non_prod = string
  })
  default = null
}

variable "approvers" {
  type = object({
    dev = string,
    qa = string,
    staging = string,
    prod = string,
    shared = string,
    non_prod = string
  })
  default = null
}

variable "environments" {
  type = list(string)
  default = null
}

variable "regions" {
  type = list(string)
  default = null
}

variable "stages" {
  type = list(string)
  default = null
}

variable "artifact_alias" {
  type = string
  default = null
}

variable "build_pipeline_id" {
  type = number
  default = null
}

variable "build_pipeline_project_id" {
  type = string
  default = null
}

variable "jira_service_endpoint_id" {
  type = string
  default = null
}

variable "agent_pool_id" {
  type = string
  default = null
}

variable "project_id" {
  type = string
  default = null
}

variable "non_prod_steps" {
  type = object({
    apply = list(object({
      task = string
      environment = map(string)
      displayName = string
      enabled = bool
      alwaysRun = bool
      continueOnError = bool
      timeoutInMinutes = number
      overrideInputs = map(string)
      condition = string
      inputs = map(string)
    }))
  })
  default = {
    apply = null
  }
}

variable "prod_steps" {
  type = object({
    plan = list(object({
      task = string
      environment = map(string)
      displayName = string
      enabled = bool
      alwaysRun = bool
      continueOnError = bool
      timeoutInMinutes = number
      overrideInputs = map(string)
      condition = string
      inputs = map(string)
    }))
    apply = list(object({
      task = string
      environment = map(string)
      displayName = string
      enabled = bool
      alwaysRun = bool
      continueOnError = bool
      timeoutInMinutes = number
      overrideInputs = map(string)
      condition = string
      inputs = map(string)
    }))
  })
  default = {
    plan = null
    apply = null
  }
}
