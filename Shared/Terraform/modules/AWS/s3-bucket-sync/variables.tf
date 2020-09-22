variable "local_file" {
  type = string
  default = null
}

variable "local_directory" {
  type = string
  default = null
}

variable "remote_directory" {
  type = string
  default = null
}

variable "remove_existing_files" {
  type = bool
  default = true
}

variable "s3_bucket_id" {
  type = string
  default = null
}

variable "cloudfront_distribution_id" {
  type = string
  default = null
}
