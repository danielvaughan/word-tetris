locals {
  required_services = [
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "iam.googleapis.com"
  ]
}

resource "google_project_service" "enabled" {
  for_each = toset(local.required_services)

  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "wordtetris" {
  location       = var.region
  repository_id  = "wordtetris"
  format         = "DOCKER"
  description    = "Container images for the Word Tetris application"
  project        = var.project_id

  depends_on = [google_project_service.enabled]
}

resource "google_service_account" "cloud_run" {
  account_id   = "${var.service_name}-svc"
  display_name = "Word Tetris Cloud Run service account"
  project      = var.project_id
}

resource "google_project_iam_member" "artifact_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_cloud_run_v2_service" "wordtetris" {
  name        = var.service_name
  location    = var.region
  description = "Word Tetris game service"
  ingress     = "INGRESS_TRAFFIC_ALL"
  labels = {
    app = "wordtetris"
  }

  template {
    service_account = google_service_account.cloud_run.email

    containers {
      image = var.image

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        cpu_idle = true
      }
    }

    scaling {
      min_instance_count = var.min_instance_count
      max_instance_count = var.max_instance_count
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  depends_on = [
    google_project_service.enabled,
    google_project_iam_member.artifact_reader
  ]
}

resource "google_cloud_run_service_iam_member" "public_invoker" {
  location = google_cloud_run_v2_service.wordtetris.location
  service  = google_cloud_run_v2_service.wordtetris.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
