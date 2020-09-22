locals {
  environment = lookup(var.tags, "Environment", null)
  product = lookup(var.tags, "Product", null)
  template_body = var.template_body != null && var.template_body != "" ? var.template_body : "{}"
}

resource "aws_cloudformation_stack" "this" {
  name = var.service
  template_body = local.template_body
  capabilities = ["CAPABILITY_IAM", "CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"]

  parameters = merge({
    Service = var.service
  }, var.parameters)

  tags = merge(var.tags, {
    Service = var.service
  })
}
