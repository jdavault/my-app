variable "vpc_security_group_ids" {
  description = "List of security group ids"
  type = list(string)
  default = null
}

variable "template_body" {
  description = "Template body using file() function"
  type = string
  default = null
}

variable "private_subnets" {
  description = "List of subnets"
  type = list(string)
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