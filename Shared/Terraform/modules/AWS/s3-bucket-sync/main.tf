locals {
  s3_directory = var.remote_directory != null ? "/${var.remote_directory}" : ""
  file = var.local_file != null ? "/${var.local_file}" : ""
  directory = var.local_directory != null ? "/${var.local_directory}" : ""
  command = var.local_file != null ? "cp" : "sync"
  delete = local.command == "sync" && var.remove_existing_files == true ? "--delete" : ""
}

resource "null_resource" "sync_or_copy" {
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
    command = "aws s3 ${local.command} .${local.directory}${local.file} s3://${var.s3_bucket_id}${local.s3_directory}${local.file} --exclude '.terra*' --exclude '**/.terra*' ${local.delete}"
  }
}

resource "null_resource" "invalidate_cloudfront_cache" {
  depends_on = [null_resource.sync_or_copy]
  triggers = {
    build_number = timestamp()
  }
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${var.cloudfront_distribution_id} --paths ${local.s3_directory}/\\*"
  }
}