locals {
  origin_id = "S3-${var.domain_name}"
  s3_domain_name = "${var.domain_name}.s3.amazonaws.com"
  comment = "access-identity-${local.s3_domain_name}"
}

module "s3" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=v1.12.0"

  cors_rule = var.cors_rules
  bucket = var.domain_name
  acl = "private"
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
}

resource "aws_cloudfront_origin_access_identity" "this" {
  comment = local.comment
}

resource "aws_cloudfront_distribution" "this" {
  aliases = [var.domain_name]
  default_root_object = var.default_root_object
  enabled = var.enabled
  is_ipv6_enabled = true
  price_class = var.price_class

  origin {
    domain_name = module.s3.this_s3_bucket_bucket_regional_domain_name
    origin_id = local.origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods = length(var.cors_rules) != 0 ? ["GET", "HEAD", "OPTIONS"] : ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = local.origin_id
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      headers = length(var.cors_rules) != 0 ? [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin"
      ] : []
      query_string = false
      cookies {
        forward = "none"
      }
    }

    dynamic "lambda_function_association" {
      for_each = var.lambda_function_associations

      content {
        event_type = lookup(lambda_function_association.value, "event_type", null)
        include_body = lookup(lambda_function_association.value, "include_body", null)
        lambda_arn = lookup(lambda_function_association.value, "lambda_arn", null)
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations = var.geo_restriction_whitelist_locations
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    cloudfront_default_certificate = false
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method = "sni-only"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code = 403
    response_code = 200
    response_page_path = "/${var.default_root_object}"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code = 404
    response_code = 200
    response_page_path = "/${var.default_root_object}"
  }

  tags = var.tags
}

data "aws_iam_policy_document" "this" {
  policy_id = "PolicyForCloudFrontPrivateContent"
  statement {
    actions = ["s3:GetObject"]
    effect = "Allow"
    principals {
      identifiers = [aws_cloudfront_origin_access_identity.this.iam_arn]
      type = "AWS"
    }
    resources = ["arn:aws:s3:::${var.domain_name}/*"]
    sid = 1
  }
  version = "2008-10-17"
}

resource "aws_s3_bucket_policy" "this" {
  bucket = module.s3.this_s3_bucket_id
  policy = data.aws_iam_policy_document.this.json
}

resource "aws_route53_record" "this" {
  count = 1

  zone_id = var.route_53_zone_id
  name = var.domain_name
  type = "A"

  allow_overwrite = true

  alias {
    name = aws_cloudfront_distribution.this.domain_name
    zone_id = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = false
  }
}
