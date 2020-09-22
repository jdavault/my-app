resource "github_team" "parent_team" {
  name = var.parent_team
  privacy = "closed"
}
resource "github_team" "developer_team" {
  name = "${var.parent_team}-Developer"
  privacy = "closed"
  parent_team_id = github_team.parent_team.id
}
resource "github_team" "external_developer_team" {
  name = "${var.parent_team}-ExternalDeveloper"
  privacy = "closed"
  parent_team_id = github_team.parent_team.id
}
resource "github_team" "qa_team" {
  name = "${var.parent_team}-QA"
  privacy = "closed"
  parent_team_id = github_team.parent_team.id
}
resource "github_team" "service_account_team" {
  name = "${var.parent_team}-ServiceAccount"
  privacy = "closed"
  parent_team_id = github_team.parent_team.id
}
