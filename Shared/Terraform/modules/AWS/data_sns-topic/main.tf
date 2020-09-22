data "aws_sns_topic" "this" {
  name = var.sns_name
}