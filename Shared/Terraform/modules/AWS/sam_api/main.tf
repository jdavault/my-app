locals {
  remote_directory = "swagger/docs/${var.service}"
}

module "sam" {
  source = "../sam"
  vpc_security_group_ids = var.vpc_security_group_ids
  template_body = var.template_body
  private_subnets = var.private_subnets
  service = var.service
  tags = var.tags
  parameters = var.parameters
}

module "s3_bucket_sync" {
  source = "../s3-bucket-sync"
  local_file = "swagger.json"
  remote_directory = local.remote_directory
  s3_bucket_id = var.s3_bucket_id
  cloudfront_distribution_id = var.cloudfront_distribution_id
}