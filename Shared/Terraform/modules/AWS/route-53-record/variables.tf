variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type        = map(string)
  default     = {}
}

variable "domain_name" {
  description = "The domain name"
  type = string
  default = null
}

variable "zone_id" {
  description = "The Hosted Zone's id"
  type = string
  default = null
}

variable "target_domain_name" {
  description = "The ALB's domain name"
  type = string
  default = null
}

variable "target_zone_id" {
  description = "The ALB's zone id"
  type = string
  default = null
}
