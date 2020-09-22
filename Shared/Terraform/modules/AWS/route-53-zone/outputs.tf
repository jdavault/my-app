output "zone_id" {
  value = aws_route53_zone.this.id
}

output "zone_name" {
  value = aws_route53_zone.this.name
}

output "domain_name" {
  value = trimsuffix(aws_route53_zone.this.name, ".")
}
