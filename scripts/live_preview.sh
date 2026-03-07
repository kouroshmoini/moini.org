#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"
SYNC_SECONDS="${SYNC_SECONDS:-5}"

echo "Starting local preview on branch: ${BRANCH}"
echo "Sync interval: ${SYNC_SECONDS}s"

if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler is not installed. Install it with: gem install bundler"
  exit 1
fi

bundle check >/dev/null 2>&1 || bundle install --path vendor/bundle

cleanup() {
  if [[ -n "${SYNC_PID:-}" ]]; then
    kill "${SYNC_PID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

(
  while true; do
    if [[ -n "$(git status --porcelain)" ]]; then
      echo "[sync] Local changes detected, skipping auto-pull."
      sleep "${SYNC_SECONDS}"
      continue
    fi

    git fetch origin "${BRANCH}" --quiet || true

    local_head="$(git rev-parse HEAD)"
    remote_head="$(git rev-parse "origin/${BRANCH}")"

    if [[ "${local_head}" != "${remote_head}" ]]; then
      echo "[sync] Pulling latest changes from origin/${BRANCH}..."
      git pull --ff-only origin "${BRANCH}" || echo "[sync] Pull failed, will retry."
    fi

    sleep "${SYNC_SECONDS}"
  done
) &

SYNC_PID=$!

bundle exec jekyll serve \
  --host 127.0.0.1 \
  --port 4000 \
  --livereload \
  --incremental \
  --future \
  --unpublished \
  --drafts
