variable "zone_name" {
  description = "Name of the r53 zone"
  type        = string
  default     = null
}

variable "private_zone" {
  description = "Name of the r53 zone"
  type        = bool
  default     = false
}

variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type        = map(string)
  default     = {}
}
