variable "developer_team_id" {
  description = "Map of developer team"
  type        = string
}
variable "developer_team_members" {
  description = "Map of users in the developer group"
  type        = map(string)
}
variable "external_developer_team_id" {
  description = "id of external developer team"
  type        = string
}
variable "external_developer_team_members" {
  description = "Map of users in the external developer group"
  type        = map(string)
}
variable "qa_team_id" {
  description = "id of qa team"
  type        = string
}
variable "qa_team_members" {
  description = "Map of users in the qa group"
  type        = map(string)
}
variable "service_account_team_id" {
  description = "id of service account team"
  type        = string
}
variable "service_account_team_members" {
  description = "Map of users in the service accounts group"
  type        = map(string)
}