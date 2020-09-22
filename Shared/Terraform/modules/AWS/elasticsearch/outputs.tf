output "endpoint" {
  value = aws_elasticsearch_domain.this.endpoint
}

output "domain_name" {
  value = aws_elasticsearch_domain.this.domain_name
}

output "kibana_endpoint" {
  value = aws_elasticsearch_domain.this.kibana_endpoint
}
