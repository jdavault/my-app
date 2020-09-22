resource "aws_route53_zone" "this" {
  name = var.zone_name
  tags = merge(var.tags, {
  })
}
