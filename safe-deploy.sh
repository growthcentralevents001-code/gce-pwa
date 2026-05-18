#!/usr/bin/env bash
set -Eeuo pipefail

DEV_DIR="/root/gce-pwa-dev"
PROD_DIR="/root/gce-pwa-prod"
PROD_BRANCH="main"
DEV_BRANCH="development"
PROD_PM2_PORT="3000"

cd "$PROD_DIR"

git fetch origin --prune
git checkout "$PROD_BRANCH"

git diff --quiet || { echo "Production worktree is dirty" >&2; exit 1; }

git merge --no-edit --no-ff "origin/$DEV_BRANCH"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

npm run build

PM2_ID="$(pm2 jlist | node -e 'const fs=require("fs"); const apps=JSON.parse(fs.readFileSync(0,"utf8")); const match=apps.find(p=>{ const e=p.pm2_env||{}; const cwd=e.pm_cwd||""; const env=e.env||{}; const port=String(env.PORT||e.PORT||""); return cwd==="/root/gce-pwa-prod" || port==="3000"; }); if(match) process.stdout.write(String(match.pm_id));')"

if [ -z "$PM2_ID" ]; then
  echo "Could not identify the production PM2 process" >&2
  exit 1
fi

pm2 restart "$PM2_ID" --update-env
pm2 save
