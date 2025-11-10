#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
INFRA_DIR="${APP_ROOT}/infra/terraform"

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-wordtetris}"
IMAGE_URI="${IMAGE_URI:-}"
MIN_INSTANCES="${MIN_INSTANCES:-0}"
MAX_INSTANCES="${MAX_INSTANCES:-5}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "ERROR: PROJECT_ID environment variable must be set." >&2
  exit 1
fi

if [[ -z "${IMAGE_URI}" ]]; then
  echo "ERROR: IMAGE_URI environment variable must be set (e.g. output from build-image.sh)." >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "ERROR: terraform is not installed or not on PATH." >&2
  exit 1
fi

set -x
terraform -chdir="${INFRA_DIR}" init
terraform -chdir="${INFRA_DIR}" apply -auto-approve \
  -var "project_id=${PROJECT_ID}" \
  -var "region=${REGION}" \
  -var "service_name=${SERVICE_NAME}" \
  -var "image=${IMAGE_URI}" \
  -var "min_instance_count=${MIN_INSTANCES}" \
  -var "max_instance_count=${MAX_INSTANCES}"
set +x

terraform -chdir="${INFRA_DIR}" output service_url
