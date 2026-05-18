#!/usr/bin/env bash
set -Eeuo pipefail

DEV_DIR="/root/gce-pwa-dev"
DEV_BRANCH="development"
DEV_PM2_PORT="3000"

cd "$DEV_DIR"

git fetch origin --prune
git checkout "$DEV_BRANCH"
git pull --ff-only origin "$DEV_BRANCH"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

npm run build

PM2_ID="$(pm2 jlist | node -e 'const fs=require("fs"); const apps=JSON.parse(fs.readFileSync(0,"utf8")); const match=apps.find(p=>{ const e=p.pm2_env||{}; const cwd=e.pm_cwd||""; const env=e.env||{}; const port=String(env.PORT||e.PORT||""); return cwd==="/root/gce-pwa-dev" || port==="3000"; }); if(match) process.stdout.write(String(match.pm_id));')"

if [ -z "$PM2_ID" ]; then
  echo "Could not identify the development PM2 process" >&2
  exit 1
fi

pm2 restart "$PM2_ID" --update-env
pm2 save
