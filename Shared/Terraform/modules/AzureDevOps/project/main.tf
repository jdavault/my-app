resource "azuredevops_project" "this" {
  project_name = var.project_name
  visibility = "private"
  version_control = "Git"
  work_item_template = "Agile"
}
