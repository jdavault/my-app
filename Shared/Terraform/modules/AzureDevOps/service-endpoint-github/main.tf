resource "azuredevops_serviceendpoint_github" "this" {
  project_id             = var.project_id
  service_endpoint_name  = "OpenTechAlliance"
  description = ""
}
