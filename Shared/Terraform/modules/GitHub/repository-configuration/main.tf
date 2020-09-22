resource "github_repository" "monorepo" {
  for_each = toset(var.monorepos)
  name = each.key
  description = "The Official ${each.key} Mono Repo."
  private = true

  allow_merge_commit = false
  allow_rebase_merge = false
  allow_squash_merge = true

  has_downloads      = true
  has_issues         = true
  has_projects       = false
  has_wiki           = false

  default_branch = "develop"
}

resource "github_repository" "polyrepo" {
  for_each = toset(concat(var.polyrepos, var.archived_repos, var.unmanaged_polyrepos))
  name = each.key
  private = true

  allow_merge_commit = false
  allow_rebase_merge = false
  allow_squash_merge = true

  has_downloads = true
  has_issues = true
  has_projects = true
  has_wiki = true

  archived = contains(var.archived_repos, each.key)
  lifecycle {
    ignore_changes = [
      "description"  // allows compatibility with archived repos whos descriptions cannot be changed.
    ]
  }
}

resource "github_team_repository" "developer" {
  for_each = toset(concat(var.monorepos, var.polyrepos, var.unmanaged_polyrepos))
  team_id    = var.developer_team_id
  repository = each.key
  permission = "push"
}
resource "github_team_repository" "external_developer" {
  for_each = toset(concat(var.monorepos, var.polyrepos, var.unmanaged_polyrepos))
  team_id    = var.external_developer_team_id
  repository = each.key
  permission = "push"
}
resource "github_team_repository" "qa" {
  for_each = toset(concat(var.monorepos, var.polyrepos, var.unmanaged_polyrepos))
  team_id    = var.qa_team_id
  repository = each.key
  permission = "push"
}
resource "github_team_repository" "service_account" {
  for_each = toset(concat(var.monorepos, var.polyrepos, var.unmanaged_polyrepos))
  team_id    = var.service_account_team_id
  repository = each.key
  permission = "maintain"
}
resource "github_branch_protection" "master" {
  for_each = toset(concat(var.monorepos, var.polyrepos))
  branch         = "master"
  repository     = each.key
  enforce_admins = true

  required_pull_request_reviews {
    dismiss_stale_reviews = contains(var.monorepos, each.key)
    dismissal_teams = []
    dismissal_users = []
    required_approving_review_count = var.required_approving_review_count
    require_code_owner_reviews = contains(var.monorepos, each.key)

  }

  restrictions {
    teams = ["${var.developer_team_slug}","${var.external_developer_team_slug}","${var.qa_team_slug}","${var.service_account_team_slug}"]
    users = []
  }
}

resource "github_branch_protection" "develop" {
  for_each = toset(concat(var.monorepos, var.polyrepos))
  branch         = "develop"
  repository     = each.key
  enforce_admins = true

  required_pull_request_reviews {
    dismiss_stale_reviews = contains(var.monorepos, each.key)
    dismissal_teams = []
    dismissal_users = []

    required_approving_review_count = var.required_approving_review_count
    require_code_owner_reviews = contains(var.monorepos, each.key)

  }

  restrictions {
    teams = ["${var.developer_team_slug}","${var.external_developer_team_slug}","${var.qa_team_slug}","${var.service_account_team_slug}"]
    users = []
  }

}
