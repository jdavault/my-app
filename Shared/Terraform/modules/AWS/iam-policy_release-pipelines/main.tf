data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"
    actions = ["*"]
    resources = ["*"]
  }
  version = "2012-10-17"
}

resource "aws_iam_policy" "this" {
  name = "ReleasePipelines"
  description = "Permissions for a release pipeline to create and update resources"
  path = "/"
  policy = data.aws_iam_policy_document.this.json
}