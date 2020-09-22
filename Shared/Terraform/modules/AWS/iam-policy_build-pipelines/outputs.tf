output "policy_arns" {
  value = [
    aws_iam_policy.dynamo_db.arn,
    aws_iam_policy.s3.arn,
    data.aws_iam_policy.read_only.arn
  ]
}