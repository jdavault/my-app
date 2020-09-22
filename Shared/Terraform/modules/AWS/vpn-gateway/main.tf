resource "aws_vpn_gateway" "this" {
  vpc_id = var.vpc_id

  tags = merge(var.tags, {
    Name = var.name
  })
}
