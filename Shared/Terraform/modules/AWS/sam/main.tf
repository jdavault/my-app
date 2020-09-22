locals {
  environment = lookup(var.tags, "Environment", null)
  product = lookup(var.tags, "Product", null)
  hasJsonTemplate = var.template_body != null && var.template_body != "" && substr(var.template_body, 0, 1) == "{"
  hasYamlTemplate = var.template_body != null && var.template_body != "" && substr(var.template_body, 0, 1) != "{"
  template_body = local.hasJsonTemplate ? var.template_body : local.hasYamlTemplate ? tostring(jsonencode(yamldecode(var.template_body))) : "{}"
}

resource "aws_cloudformation_stack" "this" {
  name = "${var.service}-${local.environment}"
  template_body = local.template_body
  capabilities = ["CAPABILITY_IAM", "CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"]

  parameters = merge({
    SecurityGroupIds = join(",", var.vpc_security_group_ids)
    SubnetIds = join(",", var.private_subnets)
    Service = var.service
    Environment = local.environment
    Product = local.product
  }, var.parameters)

  tags = merge(var.tags, {
    Service = var.service
  })
}
