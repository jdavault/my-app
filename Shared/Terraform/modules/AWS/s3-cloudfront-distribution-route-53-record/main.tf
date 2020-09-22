resource "aws_route53_record" "alias" {
  count = 1

  zone_id = var.zone_id
  name = var.domain_name
  type = "A"

  allow_overwrite = true

  alias {
    name = var.cloudfront_domain_name
    zone_id = var.cloudfront_zone_id
    evaluate_target_health = false
  }
}
