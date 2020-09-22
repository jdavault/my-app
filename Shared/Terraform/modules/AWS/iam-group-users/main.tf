resource "aws_iam_user" "this" {
  count = length(var.account_names)
  name =  var.account_names[count.index]
  path = "/"
  tags = var.tags
}

resource "aws_iam_access_key" "this" {
  count = var.create_keys ? length(var.account_names) : 0
  user = aws_iam_user.this[count.index].name
}

resource "aws_iam_user_group_membership" "this" {
  count = length(var.account_names)
  user = var.account_names[count.index]
  groups = var.group_names
}