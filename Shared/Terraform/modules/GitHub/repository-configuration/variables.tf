variable "developer_team_id" {
  description = "id of the developer team"
  type        = string
}
variable "external_developer_team_id" {
  description = "id of the external developer team"
  type        = string
}
variable "qa_team_id" {
  description = "id of the qa team"
  type        = string
}
variable "service_account_team_id" {
  description = "id of the service account team"
  type        = string
}
variable "developer_team_slug" {
  description = "id of the developer team"
  type        = string
}
variable "external_developer_team_slug" {
  description = "id of the external developer team"
  type        = string
}
variable "qa_team_slug" {
  description = "id of the qa team"
  type        = string
}
variable "service_account_team_slug" {
  description = "id of the service account team"
  type        = string
}
variable "monorepos" {
  description = "Yaml of users in the service accounts team"
  type        = list(string)
}
variable "polyrepos" {
  description = "Yaml of users in the service accounts team"
  type        = list(string)
}
variable "unmanaged_polyrepos" {
  description = "Yaml of users in the service accounts team"
  type        = list(string)
}
variable "archived_repos" {
  description = "Yaml of users in the service accounts team"
  type        = list(string)
}
variable "required_approving_review_count" {
  description = "Number of required approvers for Pull Requests"
  type        = number
}