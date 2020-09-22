output "zone_id" {
  value = data.aws_route53_zone.this.id
}

output "zone_name" {
  value = data.aws_route53_zone.this.name
}

output "domain_name" {
  value = trimsuffix(data.aws_route53_zone.this.name, ".")
}
