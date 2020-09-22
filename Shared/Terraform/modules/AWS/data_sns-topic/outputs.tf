output "sns_id" {
  value = data.aws_sns_topic.this.id
}

output "sns_name" {
  value = data.aws_sns_topic.this.name
}

output "sns_arn" {
  value = data.aws_sns_topic.this.arn
}
