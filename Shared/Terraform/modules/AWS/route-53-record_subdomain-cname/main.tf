resource "aws_route53_record" "this" {
  for_each = var.subdomains
  name = "${each.key}.${var.root_domain}"
  type = "CNAME"
  zone_id = var.zone_id
  records = ["${each.value}"]
  ttl     = "300"
  allow_overwrite = true
}