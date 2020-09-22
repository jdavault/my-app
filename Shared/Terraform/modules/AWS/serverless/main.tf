locals {
  stage = lookup(var.tags, "Stage", null)
}

resource "aws_cloudformation_stack" "this" {
  name = "${var.service}-${local.stage}"
  template_body = var.template_body != "" ? var.template_body : "{}"
  capabilities = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"]

  parameters = merge({
  }, var.parameters)

  tags = merge(var.tags, {
    Service = var.service
  })
}
