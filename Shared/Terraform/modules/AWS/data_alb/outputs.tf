output "this_lb_id" {
  description = "The ID of the load balancer we created."
  value = data.aws_alb.this.id
}

output "this_lb_arn" {
  description = "The ARN of the load balancer we created."
  value = data.aws_alb.this.arn
}

output "this_lb_dns_name" {
  description = "The DNS name of the load balancer."
  value = data.aws_alb.this.dns_name
}

output "this_lb_arn_suffix" {
  description = "ARN suffix of our load balancer - can be used with CloudWatch."
  value = data.aws_alb.this.arn_suffix
}

output "this_lb_zone_id" {
  description = "The zone_id of the load balancer to assist with creating DNS records."
  value = data.aws_alb.this.zone_id
}
