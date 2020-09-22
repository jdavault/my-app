variable "tags" {
  description = "A mapping of tags to assign to all resources"
  type = map(string)
  default = {}
}

variable "name" {
  description = "The name of the alarm"
  type = string
  default = null
}

variable "threshold" {
  description = "Threshold the metric needs to overcome"
  type = number
  default = 1
}

variable "comparison_operator" {
  description = "(GreaterThanOrEqualToThreshold, GreaterThanThreshold, LessThanThreshold, LessThanOrEqualToThreshold)"
  type = string
  default = null
}

variable "treat_missing_data" {
  description = "(missing, ignore, breaching and notBreaching. Defaults to missing)"
  type = string
  default = "missing"
}

variable "metric_name" {
  description = "The name of the mertic for the alarm"
  type = string
  default = null
}

variable "namespace" {
  description = "The namespace of the resources related to the metric"
  type = string
  default = null
}

variable "period" {
  description = "period of time to sample for threshold"
  type = number
  default = 300
}

variable "stat" {
  description = "method for determining value of metric (Average, Maximum, Minimum)"
  type = string
  default = "Maximum"
}

variable "description" {
  description = "Description of the alarm"
  type = string
  default = null
}

variable "resources" {
  description = "The name of the lambdas to monitor"
  type = list(string)
  default = null
}

variable "sns_arn" {
  description = "The arn for the sns topic to alert to"
  type = string
  default = null
}
