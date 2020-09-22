variable "account_names" {
  description = "The arn of the iam policy"
  type        = list(string)
  default     = null
}

variable "create_keys" {
  description = "Boolean, create aws keys for programatic access?"
  type        = bool
  default     = false
}

variable "group_names" {
  description = "Groups to add users to"
  type        = list(string)
  default     = null
}

variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type        = map(string)
  default     = {}
}
