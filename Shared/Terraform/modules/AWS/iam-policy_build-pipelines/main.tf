locals {
  account_id = data.aws_caller_identity.current.account_id
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy" "read_only" {
  arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

data "aws_iam_policy_document" "dynamo_db" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeTable",
      "dynamodb:DeleteItem"
    ]
    resources = [
      "arn:aws:dynamodb:us-west-2:${local.account_id}:table/terraform-locks-${local.account_id}"
    ]
  }
  version = "2012-10-17"
}

resource "aws_iam_policy" "dynamo_db" {
  name = "TerraformDynamoDB"
  description = ""
  path = "/"
  policy = data.aws_iam_policy_document.dynamo_db.json
}

data "aws_iam_policy_document" "s3" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation",
      "s3:ListAllMyBuckets"
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:HeadBucket"
    ]
    resources = var.s3_bucket_arns
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject"
    ]
    resources = [for s3_bucket_arn in var.s3_bucket_arns: "${s3_bucket_arn}/*"]
  }
  version = "2012-10-17"
}

resource "aws_iam_policy" "s3" {
  name = "PipelineS3ArtifactBucket"
  description = "Allow a pipeline to read and write artifacts"
  path = "/"
  policy = data.aws_iam_policy_document.s3.json
}