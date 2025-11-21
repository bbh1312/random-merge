#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <image-uri>" >&2
  exit 1
fi

IMAGE_URI="$1"
APP_NAME=${APP_NAME:-random-character}
CONTAINER_NAME="${APP_NAME}-server"
APP_PORT=${APP_PORT:-4000}
HOST_HTTP_PORT=${HOST_HTTP_PORT:-80}
ENV_FILE=${ENV_FILE:-/opt/random-character/.env}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file at $ENV_FILE" >&2
  exit 1
fi

echo "Pulling image $IMAGE_URI"
docker pull "$IMAGE_URI"

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Stopping previous container ${CONTAINER_NAME}"
  docker stop "$CONTAINER_NAME" || true
  docker rm "$CONTAINER_NAME" || true
fi

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart always \
  --env-file "$ENV_FILE" \
  -p ${HOST_HTTP_PORT}:${APP_PORT} \
  "$IMAGE_URI"

docker image prune -f >/dev/null

echo "Container ${CONTAINER_NAME} is running with image ${IMAGE_URI}"
