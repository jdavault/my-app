locals {
  environment = lookup(var.tags, "Environment", null)
  stage = lookup(var.tags, "Stage", null)
  product = lookup(var.tags, "Product", null)
}

resource "aws_resourcegroups_group" "this" {
  count = var.type == null ? 0 : 1
  name = "${var.productCode}-${lower(var.type == "environment" ? local.environment : local.stage)}"

  dynamic resource_query {
    for_each = var.type == "environment" ? [""] : []
    content {
      query = jsonencode({
        "ResourceTypeFilters": ["AWS::AllSupported"],
        "TagFilters": [
          {
            Key: "Environment"
            Values: [local.environment]
          },
          {
            Key: "Stage"
            Values: [local.stage]
          },
          {
            Key: "Product"
            Values: [local.product]
          }
        ]
      })
    }
  }

  dynamic resource_query {
    for_each = var.type == "stage" ? [""] : []
    content {
      query = jsonencode({
        "ResourceTypeFilters": ["AWS::AllSupported"],
        "TagFilters": [
          {
            Key: "Stage"
            Values: [local.stage]
          },
          {
            Key: "Product"
            Values: [local.product]
          }
        ]
      })
    }
  }
}
