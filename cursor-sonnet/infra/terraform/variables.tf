variable "project_id" {
  description = "Google Cloud project identifier"
  type        = string
}

variable "region" {
  description = "Google Cloud region for resources"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
  default     = "wordtetris"
}

variable "image" {
  description = "Container image URI for deployment"
  type        = string
}

variable "min_instance_count" {
  description = "Minimum number of Cloud Run instances"
  type        = number
  default     = 0
}

variable "max_instance_count" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 5
}
