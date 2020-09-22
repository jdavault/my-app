resource "aws_iam_group" "this" {
  name = "ReleasePipelines"
}

resource "aws_iam_group_policy_attachment" "this" {
  count = length(var.policy_arns)
  group      = aws_iam_group.this.name
  policy_arn = var.policy_arns[count.index]
}