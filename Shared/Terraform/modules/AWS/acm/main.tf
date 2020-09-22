locals {
  wildcard_subdomain = "*.${var.domain_name}"
  stage = lookup(var.tags, "Stage", null)
}

module "acm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=v2.10.0"

  domain_name = var.domain_name
  subject_alternative_names = [local.wildcard_subdomain]
  zone_id = var.zone_id
  validation_method = "DNS"
  validate_certificate = true
  validation_allow_overwrite_records = true
  tags = merge(var.tags, {
    Name = "${var.product_code}-${local.stage}"
  })
}
