variable "policy_arns" {
  description = "The arn of the iam policy"
  type        = list(string)
  default     = null
}

variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type        = map(string)
  default     = {}
}
