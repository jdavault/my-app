locals {
  origin_id = "S3-${var.domain_name}"
  s3_domain_name = "${var.domain_name}.s3.amazonaws.com"
  comment = "access-identity-${local.s3_domain_name}"
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
    domain_name = local.s3_domain_name
    origin_id = local.origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods = var.has_cors ? ["GET", "HEAD", "OPTIONS"] : ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = local.origin_id
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      headers = var.has_cors ? [
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
