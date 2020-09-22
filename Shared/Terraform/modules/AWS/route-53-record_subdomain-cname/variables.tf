variable "zone_id" {
  description = "zone id from r53"
  type        = string
}

variable "root_domain" {
  description = "domain of zone"
  type        = string
}

variable "subdomains" {
  description = "Map of subdomains"
  type        = map(string)
}
