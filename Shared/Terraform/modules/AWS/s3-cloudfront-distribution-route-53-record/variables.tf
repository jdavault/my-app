variable "zone_id" {
  description = "The route 53 zone id."
  type = string
  default = null
}

variable "domain_name" {
  description = "The domain name."
  type = string
  default = null
}

variable "cloudfront_domain_name" {
  description = "The cloudfront domain name."
  type = string
  default = null
}

variable "cloudfront_zone_id" {
  description = "The cloudfront zone id."
  type = string
  default = null
}
