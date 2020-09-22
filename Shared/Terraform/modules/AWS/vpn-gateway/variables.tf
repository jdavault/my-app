variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}

variable "name" {
  description = "The name of the vpn tunnel"
  type = string
  default = null
}


variable "vpc_id" {
  description = "The id of the vpc"
  type = string
  default = null
}
