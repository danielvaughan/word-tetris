#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-central1}"
REPOSITORY="${REPOSITORY:-wordtetris}"
SERVICE_NAME="${SERVICE_NAME:-wordtetris}"
TAG="${1:-$(git -C "${APP_ROOT}" rev-parse --short HEAD)}"
DOCKER_PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "ERROR: PROJECT_ID environment variable must be set." >&2
  exit 1
fi

IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE_NAME}:${TAG}"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed or not on PATH." >&2
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "ERROR: gcloud CLI is not installed or not on PATH." >&2
  exit 1
fi

set -x
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

if docker buildx version >/dev/null 2>&1; then
  docker buildx build --platform "${DOCKER_PLATFORM}" -t "${IMAGE_URI}" "${APP_ROOT}" --push
else
  export DOCKER_DEFAULT_PLATFORM="${DOCKER_PLATFORM}"
  docker build -t "${IMAGE_URI}" "${APP_ROOT}"
  docker push "${IMAGE_URI}"
fi
set +x

printf '\nImage pushed: %s\n' "${IMAGE_URI}"
