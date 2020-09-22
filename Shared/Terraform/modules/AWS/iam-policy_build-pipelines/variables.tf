variable "s3_bucket_arns" {
  description = "The arn of the s3 bucket"
  type        = list(string)
  default     = null
}

variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type        = map(string)
  default     = {}
}
