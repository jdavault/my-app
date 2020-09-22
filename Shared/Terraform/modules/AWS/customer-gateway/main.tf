resource "aws_customer_gateway" "this" {
  bgp_asn = var.bgp_asn
  ip_address = "70.175.23.164"
  type = "ipsec.1"
  tags = merge(var.tags, {
    Name = var.name
  })
}
