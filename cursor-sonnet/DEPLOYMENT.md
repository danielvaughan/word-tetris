# Deployment Specification - Word Tetris

## Overview
- Package the application as a container image and deploy it to Google Cloud Run.
- Use Terraform to provision Google Cloud resources, including Artifact Registry for the image and the Cloud Run service itself.
- Support both local development deployments and CI/CD-driven releases.

## Prerequisites
- Google Cloud project with billing enabled.
- IAM permissions: `roles/run.admin`, `roles/storage.admin`, `roles/artifactregistry.admin`, `roles/iam.serviceAccountUser`.
- Tools installed locally or on CI runners: `gcloud` (≥ 451.0.0), `terraform` (≥ 1.8.0), `docker` (or `podman`), and `make` (optional but recommended).
- Enable Google Cloud APIs once per project:
  ```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com iam.googleapis.com
  ```

## Repository Layout
- Application source and deployment assets live under `cursor-sonnet/`.
- Container assets: `Dockerfile`, `.dockerignore`, and `server/` all sit inside `cursor-sonnet/`.
- Infrastructure code lives in `cursor-sonnet/infra/terraform/` with the following files:
  - `main.tf`
  - `variables.tf`
  - `outputs.tf`
  - `providers.tf`
  - `backend.tf` (optional; configure Terraform remote state in Google Cloud Storage).

## Container Packaging
- Ensure a production-ready `Dockerfile` exists at `cursor-sonnet/Dockerfile`.
- Recommended multi-stage build pattern:
  ```Dockerfile
  # syntax=docker/dockerfile:1
  FROM node:20-slim AS builder
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM gcr.io/distroless/nodejs20-debian12
  WORKDIR /app
  COPY --from=builder /app/dist ./dist
  COPY server/server.js ./dist/server.js
  ENV PORT=8080
  CMD ["dist/server.js"]
  ```
- Local test build (from inside `cursor-sonnet/`):
  ```bash
  docker build --platform linux/amd64 -t gcr.io/PROJECT_ID/wordtetris:dev .
  docker run --rm -p 8080:8080 gcr.io/PROJECT_ID/wordtetris:dev
  ```

## Artifact Registry
- Create a repository via Terraform (preferred) or manually:
  - Location: `us-central1` (adjust as needed).
  - Name: `wordtetris`.
- Terraform snippet (to place in `main.tf`):
  ```hcl
  resource "google_artifact_registry_repository" "wordtetris" {
    location       = var.region
    repository_id  = "wordtetris"
    format         = "DOCKER"
  }
  ```
- Authenticate Docker with Artifact Registry prior to pushing images:
  ```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
  ```

## Terraform Architecture
- Define variables in `variables.tf`:
  ```hcl
  variable "project_id" {
    type = string
  }

  variable "region" {
    type    = string
    default = "us-central1"
  }

  variable "service_name" {
    type    = string
    default = "wordtetris"
  }

  variable "image" {
    type = string
  }
  ```
- Reference providers in `providers.tf`:
  ```hcl
  terraform {
    required_version = ">= 1.8.0"
    required_providers {
      google = {
        source  = "hashicorp/google"
        version = ">= 5.30.0"
      }
    }
  }

  provider "google" {
    project = var.project_id
    region  = var.region
  }
  ```
- Cloud Run service definition (in `main.tf`):
  ```hcl
  resource "google_cloud_run_v2_service" "wordtetris" {
    name        = var.service_name
    location    = var.region
    description = "Word Tetris game service"

    template {
      containers {
        image = var.image

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }
      }

      scaling {
        min_instance_count = 0
        max_instance_count = 5
      }
    }

    ingress = "INGRESS_TRAFFIC_ALL"
    client  = "wordtetris-terraform"
  }

  resource "google_cloud_run_service_iam_member" "public_invoker" {
    location = google_cloud_run_v2_service.wordtetris.location
    service  = google_cloud_run_v2_service.wordtetris.name
    role     = "roles/run.invoker"
    member   = "allUsers"
  }
  ```
- Outputs (`outputs.tf`):
  ```hcl
  output "service_url" {
    value = google_cloud_run_v2_service.wordtetris.uri
  }
  ```

## Deployment Workflow
1. Authenticate and set project:
   ```bash
gcloud auth login
gcloud config set project PROJECT_ID
   ```
2. Build and push the container image:
   ```bash
   IMAGE="us-central1-docker.pkg.dev/PROJECT_ID/wordtetris/wordtetris:$(git rev-parse --short HEAD)"
   docker build -t "$IMAGE" .
   docker push "$IMAGE"
   ```
3. Update Terraform variable file (`cursor-sonnet/infra/terraform/terraform.tfvars`):
   ```hcl
   project_id   = "PROJECT_ID"
   region       = "us-central1"
   service_name = "wordtetris"
   image        = "us-central1-docker.pkg.dev/PROJECT_ID/wordtetris/wordtetris:COMMIT_SHA"
   ```
4. Deploy with Terraform:
   ```bash
   cd cursor-sonnet/infra/terraform
   terraform init
   terraform plan
   terraform apply
   ```
5. Verify deployment:
   ```bash
   terraform output service_url
   curl "$(terraform output -raw service_url)"
   ```

## CI/CD Integration
- Recommended pipeline (e.g., GitHub Actions, Google Cloud Build):
  - Trigger on pushes to `main` or tags.
  - Steps:
    1. Install dependencies (`npm ci` for tests, `terraform init -backend-config` for state).
    2. Run lint/tests.
    3. Build and push container image tagged with commit SHA.
    4. Run `terraform apply -auto-approve` with the new image reference.
- Store Terraform state in a remote backend (e.g., GCS bucket) to avoid conflicts between runs.
- Use a dedicated service account for CI with limited IAM permissions.

## Rollbacks
- To roll back, redeploy the Cloud Run service with a previous image:
  ```bash
  terraform apply -var="image=us-central1-docker.pkg.dev/PROJECT_ID/wordtetris/wordtetris:PREVIOUS_SHA"
  ```
- Alternatively, use Cloud Run revisions history:
  ```bash
gcloud run services update-traffic wordtetris --to-revisions REVISION_ID=100
  ```

## Security and Observability
- Enable HTTPS (automatic with Cloud Run when using custom domains).
- Configure Cloud Logging and Cloud Monitoring dashboards for key metrics.
- Store secrets in Google Secret Manager and expose them via Cloud Run environment variables referencing `secret` blocks in Terraform.
- Enable Binary Authorization or artifact signing if supply-chain security is required.

## Cost Controls
- Set `max_instance_count` conservatively and enforce `cpu=1` and `memory=512Mi` limits.
- Use Cloud Scheduler with Terraform to scale down or disable traffic outside peak hours if needed.

## Helper Scripts
- `scripts/build-image.sh` builds the Docker image and pushes it to Artifact Registry.
  ```bash
  cd cursor-sonnet
  export PROJECT_ID="your-project"
  export REGION="us-central1"   # optional override
  ./scripts/build-image.sh       # optional TAG argument
  ```
  Builds a `linux/amd64` image by default; override with `DOCKER_PLATFORM` if needed (e.g., `DOCKER_PLATFORM=linux/arm64`).
  The script prints the pushed image URI; copy it for deployment.

- `scripts/deploy-cloudrun.sh` applies the Terraform stack using the image URI.
  ```bash
  cd cursor-sonnet
  export PROJECT_ID="your-project"
  export IMAGE_URI="us-central1-docker.pkg.dev/your-project/wordtetris/wordtetris:commit"
  ./scripts/deploy-cloudrun.sh
  ```
  Optional environment variables: `REGION`, `SERVICE_NAME`, `MIN_INSTANCES`, `MAX_INSTANCES`.

> Ensure both scripts are executable: `chmod +x scripts/*.sh`.
