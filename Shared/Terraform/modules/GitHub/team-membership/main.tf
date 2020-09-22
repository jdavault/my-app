resource "github_team_membership" "developer" {
  for_each = var.developer_team_members
  team_id    = var.developer_team_id
  username = each.value
  role     = "member"
}
resource "github_team_membership" "external_developer" {
  for_each = var.external_developer_team_members
  team_id    = var.external_developer_team_id
  username = each.value
  role     = "member"
}
resource "github_team_membership" "qa" {
  for_each = var.qa_team_members
  team_id    = var.qa_team_id
  username = each.value
  role     = "member"
}
resource "github_team_membership" "service_account" {
  for_each = var.service_account_team_members
  team_id    = var.service_account_team_id
  username = each.value
  role     = "maintainer"
}