variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}

variable "type" {
  description = "The type of resource group"
  type = string
  default = null
}

variable "productCode" {
  description = "The product code"
  type = string
  default = null
}
