variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}

variable "vpc_security_group_ids" {
  description = "A mapping of tags to assign to all resources"
  type = list(string)
  default = []
}

variable "private_subnets" {
  description = "A mapping of tags to assign to all resources"
  type = list(string)
  default = []
}
