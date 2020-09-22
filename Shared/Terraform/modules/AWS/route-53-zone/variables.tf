variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}

variable "zone_name" {
  description = "The zone name"
  type = string
  default = null
}
