variable "template_body" {
  description = "url to template"
  type = string
  default = null
}

variable "stage" {
  description = "The name of the stage"
  type = string
  default = null
}

variable "service" {
  description = "The name of the service"
  type = string
  default = null
}

variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}

variable "parameters" {
  description = "A mapping of cloudformation paramters"
  type = map(string)
  default = {}
}
