output "alias_domain_name" {
  value = var.domain_name
}

output "domain_name" {
  value = aws_cloudfront_distribution.this.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.this.id
}

output "cloudfront_origin_access_identity_iam_arn" {
  value = aws_cloudfront_origin_access_identity.this.iam_arn
}

output "hosted_zone_id" {
  value = aws_cloudfront_distribution.this.hosted_zone_id
}

output "s3_bucket_arn" {
  value = module.s3.this_s3_bucket_arn
}

output "s3_bucket_id" {
  value = module.s3.this_s3_bucket_id
}
