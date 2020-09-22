output "this_lb_id" {
  description = "The ID of the load balancer we created."
  value = data.aws_elb.this.id
}

output "this_lb_arn" {
  description = "The ARN of the load balancer we created."
  value = data.aws_elb.this.arn
}

output "this_lb_dns_name" {
  description = "The DNS name of the load balancer."
  value = data.aws_elb.this.dns_name
}

output "this_lb_zone_id" {
  description = "The zone_id of the load balancer to assist with creating DNS records."
  value = data.aws_elb.this.zone_id
}
