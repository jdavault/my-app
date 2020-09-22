variable "product_code" {
  description = "The product code (namespace code)"
  type = string
}

variable "domain_name" {
  description = "A domain name for which the certificate should be issued"
  type = string
}

variable "zone_id" {
  description = "The ID of the hosted zone to contain this record"
  type = string
}

variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}
