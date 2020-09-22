resource "aws_route53_record" "this" {
  name = var.domain_name
  type = "A"
  zone_id = var.zone_id

  allow_overwrite = true

  alias {
    name = var.target_domain_name
    zone_id = var.target_zone_id
    evaluate_target_health = false
  }
}
