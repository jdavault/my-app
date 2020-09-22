locals {
  environment = lookup(var.tags, "Environment", null)
  stage = lookup(var.tags, "Stage", null)
  product = lookup(var.tags, "Product", null)
  domain_name = "${lower(local.product)}-${lower(local.environment)}"
}

resource "aws_elasticsearch_domain" "this" {
  domain_name = local.domain_name
  elasticsearch_version = "7.1"

  cluster_config {
    instance_type = "r5.large.elasticsearch"
    instance_count = 2
    zone_awareness_enabled = true
    dedicated_master_enabled = false
  }

  ebs_options {
    ebs_enabled = true
    iops = 0
    volume_size = 10
    volume_type = "gp2"
  }

  snapshot_options {
    automated_snapshot_start_hour = 0
  }

  vpc_options {
    security_group_ids = var.vpc_security_group_ids
    subnet_ids = var.private_subnets
  }


  tags = merge(var.tags, {

  })
}

data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"
    actions = ["es:*"]
    principals {
      identifiers = ["*"]
      type = "AWS"
    }
    resources = ["${aws_elasticsearch_domain.this.arn}/*"]
  }
  version = "2012-10-17"
}

resource "aws_elasticsearch_domain_policy" "this" {
  domain_name = aws_elasticsearch_domain.this.domain_name
  access_policies = data.aws_iam_policy_document.this.json
}
