variable "domain_name" {
  description = "The domain name."
  type = string
  default = null
}

variable "default_root_object" {
  description = "(Optional) The name of the default root object."
  type = string
  default = "index.html"
}

variable "enabled" {
  description = "(Optional) Is enabled."
  type = bool
  default = true
}

variable "price_class" {
  description = "(Optional) The price class."
  type = string
  default = "PriceClass_100"
}

variable "lambda_function_associations" {
  description = "(Optional) Lambda@Edge to associate."
  type = list(map(string))
  default = []
}

variable "tags" {
  description = "(Optional) A mapping of tags to assign to the bucket."
  type = map(string)
  default = {}
}

variable "origin_id" {
  description = "The origin id of the s3 bucket."
  type = string
  default = null
}

variable "geo_restriction_whitelist_locations" {
  description = "(Optional) If specified, the allowed geo regions."
  type = list(string)
  default = ["CA", "MX", "PR", "US"]
}

variable "acm_certificate_arn" {
  description = "The arn of the ssl cert."
  type = string
  default = null
}

variable "bucket_regional_domain_name" {
  description = "(Optional) If specified, use an existing bucket rather than create one."
  type = string
  default = ""
}

variable "has_cors" {
  description = "Enable Cross-Origin Resource Sharing."
  type = bool
  default = false
}