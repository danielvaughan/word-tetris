output "service_url" {
  description = "Deployed Cloud Run service URL"
  value       = google_cloud_run_v2_service.wordtetris.uri
}

output "service_account_email" {
  description = "Service account used by Cloud Run"
  value       = google_service_account.cloud_run.email
}
