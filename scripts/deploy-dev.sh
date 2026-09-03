#!/usr/bin/env bash
# Safe gce-dev deploy: build in a staging tree, swap .next only after success.
# Never deletes the live .next until a replacement BUILD_ID exists.
# Never restarts or modifies gce-prod / production.
set -Eeuo pipefail

LIVE_DIR="/root/gce-pwa-dev"
STAGING_DIR="/root/gce-pwa-dev-staging"
DEV_BRANCH="development"
ECOSYSTEM="${LIVE_DIR}/ecosystem.config.cjs"
LOCK_FILE="/var/lock/gce-dev-deploy.lock"
HEALTH_URL="http://127.0.0.1:3000/api/health/live"
HOME_URL="http://127.0.0.1:3000/"
PM2_APP="gce-dev"
PROD_PM2_APP="gce-prod"

MODE="deploy"
SKIP_BUILD=0

usage() {
  cat <<'EOF'
Usage: scripts/deploy-dev.sh [--self-test] [--skip-build]

  default       Fetch/build in /root/gce-pwa-dev-staging, swap live .next, restart gce-dev, health-check.
  --skip-build  Reuse an existing staging .next/BUILD_ID (no npm ci / next build).
  --self-test   Copy live .next through swap + rollback without compiling. Does not git pull.

Does not touch gce-prod, Nginx, or /root/gce-pwa-prod.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --self-test) MODE="self-test"; SKIP_BUILD=1; shift ;;
    --skip-build) SKIP_BUILD=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

log() { echo "[gce-dev-deploy] $*"; }
die() { echo "[gce-dev-deploy] ERROR: $*" >&2; exit 1; }

assert_not_prod_cwd() {
  local cwd
  cwd="$(pwd -P)"
  if [[ "$cwd" == "/root/gce-pwa-prod" ]]; then
    die "refusing to run in production worktree"
  fi
}

pm2_app_id() {
  local name="$1"
  pm2 jlist | node -e '
    const name = process.argv[1];
    const apps = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const match = apps.find((p) => p.name === name);
    if (match) process.stdout.write(String(match.pm_id));
  ' "$name"
}

restart_gce_dev() {
  local id
  id="$(pm2_app_id "$PM2_APP" || true)"
  if [[ -z "$id" ]]; then
    log "starting ${PM2_APP} from ecosystem (prod app not started)"
    pm2 start "$ECOSYSTEM" --only "$PM2_APP"
  else
    log "restarting ${PM2_APP} (id=${id}) — not ${PROD_PM2_APP}"
    pm2 restart "$PM2_APP" --update-env
  fi
}

health_ok() {
  local code="000"
  code="$(curl -sS -o /tmp/gce-dev-health.body -w '%{http_code}' --max-time 15 "$HEALTH_URL" || true)"
  [[ "$code" == "200" ]]
}

wait_healthy() {
  local attempts="${1:-8}"
  local i
  for i in $(seq 1 "$attempts"); do
    if health_ok; then
      log "health OK (${HEALTH_URL})"
      return 0
    fi
    log "health not ready (attempt ${i}/${attempts})"
    sleep 2
  done
  return 1
}

home_ok() {
  local code="000"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$HOME_URL" || true)"
  [[ "$code" == "200" ]]
}

require_build_id() {
  local dir="$1"
  [[ -f "${dir}/BUILD_ID" ]] || die "missing ${dir}/BUILD_ID"
  local id
  id="$(tr -d '[:space:]' <"${dir}/BUILD_ID")"
  [[ -n "$id" ]] || die "empty BUILD_ID in ${dir}"
  echo "$id"
}

ensure_staging_worktree() {
  mkdir -p "$(dirname "$STAGING_DIR")"
  git -C "$LIVE_DIR" fetch origin --prune
  # Detached origin/development — live tree already has branch `development` checked out.
  if [[ ! -e "${STAGING_DIR}/.git" ]]; then
    log "creating detached staging worktree at ${STAGING_DIR}"
    git -C "$LIVE_DIR" worktree add --detach "$STAGING_DIR" "origin/${DEV_BRANCH}"
  else
    log "updating detached staging worktree"
    git -C "$STAGING_DIR" fetch origin --prune
    git -C "$STAGING_DIR" checkout --detach "origin/${DEV_BRANCH}"
  fi
}

sync_env_into_staging() {
  local f
  for f in .env.local .env; do
    if [[ -f "${LIVE_DIR}/${f}" ]]; then
      cp -a "${LIVE_DIR}/${f}" "${STAGING_DIR}/${f}"
      log "copied ${f} into staging (value not logged)"
    fi
  done
}

build_staging() {
  cd "$STAGING_DIR"
  if [[ -f package-lock.json ]]; then
    log "npm ci (staging)"
    npm ci
  else
    log "npm install (staging)"
    npm install
  fi
  log "npm run build (staging) — live .next is not deleted"
  npm run build
  require_build_id "${STAGING_DIR}/.next" >/dev/null
}

lockfile_changed() {
  if [[ ! -f "${LIVE_DIR}/package-lock.json" || ! -f "${STAGING_DIR}/package-lock.json" ]]; then
    return 0
  fi
  ! cmp -s "${LIVE_DIR}/package-lock.json" "${STAGING_DIR}/package-lock.json"
}

sync_node_modules_if_needed() {
  if lockfile_changed; then
    log "package-lock changed — rsync staging node_modules to live immediately before restart"
    mkdir -p "${LIVE_DIR}/node_modules"
    rsync -a --delete "${STAGING_DIR}/node_modules/" "${LIVE_DIR}/node_modules/"
    cp -a "${STAGING_DIR}/package-lock.json" "${LIVE_DIR}/package-lock.json"
  else
    log "package-lock unchanged — leaving live node_modules in place"
  fi
}

swap_next() {
  local incoming="$1"
  local live="${LIVE_DIR}/.next"
  local prev="${LIVE_DIR}/.next.prev"
  require_build_id "$incoming" >/dev/null

  if [[ -d "$prev" ]]; then
    rm -rf "${LIVE_DIR}/.next.prev.bak"
    mv "$prev" "${LIVE_DIR}/.next.prev.bak"
  fi
  if [[ -d "$live" ]]; then
    mv "$live" "$prev"
    log "preserved live .next as .next.prev"
  fi
  mv "$incoming" "$live"
  log "installed new .next (BUILD_ID=$(tr -d '[:space:]' <"${live}/BUILD_ID"))"
}

rollback_next() {
  local live="${LIVE_DIR}/.next"
  local prev="${LIVE_DIR}/.next.prev"
  [[ -d "$prev" ]] || die "rollback failed: ${prev} missing"

  rm -rf "${LIVE_DIR}/.next.bad"
  if [[ -d "$live" ]]; then
    mv "$live" "${LIVE_DIR}/.next.bad"
  fi
  mv "$prev" "$live"
  log "restored .next from .next.prev (BUILD_ID=$(tr -d '[:space:]' <"${live}/BUILD_ID"))"
}

post_restart_verify() {
  sleep 12
  if wait_healthy 12 && home_ok; then
    log "liveness and / both returned 200"
    return 0
  fi
  return 1
}

run_deploy() {
  ensure_staging_worktree
  sync_env_into_staging
  if [[ "$SKIP_BUILD" -eq 1 ]]; then
    log "skip-build: requiring existing staging .next"
    require_build_id "${STAGING_DIR}/.next" >/dev/null
  else
    build_staging
  fi
  sync_node_modules_if_needed
  swap_next "${STAGING_DIR}/.next"
  restart_gce_dev
  if post_restart_verify; then
    rm -rf "${LIVE_DIR}/.next.prev.bak" "${LIVE_DIR}/.next.bad"
    pm2 save
    log "deploy OK"
    return 0
  fi
  log "health check failed — rolling back to .next.prev"
  rollback_next
  restart_gce_dev
  if post_restart_verify; then
    die "new build failed health; previous .next restored and healthy"
  fi
  die "new build failed health AND rollback health failed — inspect ${LIVE_DIR}/.next"
}

run_self_test() {
  local incoming="${LIVE_DIR}/.next.selftest-incoming"
  local live_id prev_id
  [[ -f "${LIVE_DIR}/.next/BUILD_ID" ]] || die "self-test requires a live .next/BUILD_ID"
  live_id="$(require_build_id "${LIVE_DIR}/.next")"
  log "self-test: copying live .next (BUILD_ID=${live_id}) — no compile, live site stays on current artifact until swap"

  rm -rf "$incoming"
  cp -a "${LIVE_DIR}/.next" "$incoming"
  swap_next "$incoming"
  restart_gce_dev
  post_restart_verify || die "self-test swap health failed"

  log "self-test: exercising rollback (.next.prev -> .next)"
  rollback_next
  restart_gce_dev
  post_restart_verify || die "self-test rollback health failed"
  prev_id="$(require_build_id "${LIVE_DIR}/.next")"
  [[ "$prev_id" == "$live_id" ]] || die "self-test BUILD_ID mismatch after rollback"

  rm -rf "${LIVE_DIR}/.next.bad" "${LIVE_DIR}/.next.prev.bak" "${LIVE_DIR}/.next.selftest-incoming"
  pm2 save
  log "self-test OK (swap + rollback + health) BUILD_ID=${prev_id}"
}

# --- main ---
assert_not_prod_cwd
[[ "$(id -u)" -eq 0 || -w "$LIVE_DIR" ]] || die "need write access to ${LIVE_DIR}"

mkdir -p "$(dirname "$LOCK_FILE")"
exec 9>"$LOCK_FILE"
flock -n 9 || die "another gce-dev deploy holds ${LOCK_FILE}"

cd "$LIVE_DIR"
assert_not_prod_cwd

prod_before="$(pm2_app_id "$PROD_PM2_APP" || true)"
log "mode=${MODE} skip_build=${SKIP_BUILD} prod_pm2_id=${prod_before:-none}"

if [[ "$MODE" == "self-test" ]]; then
  run_self_test
else
  run_deploy
fi

prod_after="$(pm2_app_id "$PROD_PM2_APP" || true)"
[[ "$prod_before" == "$prod_after" ]] || die "gce-prod PM2 id changed — aborting for safety"
log "gce-prod untouched (pm2 id=${prod_after:-none})"
