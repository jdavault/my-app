data "aws_acm_certificate" "this" {
  domain = var.domain
  most_recent = true
  statuses = ["ISSUED"]
}
