variable "domain" {
  description = "Domain of the cert you wish to get the arn of"
  type        = string
  default     = null
}
variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type        = map(string)
  default     = {}
}
