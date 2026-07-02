#!/usr/bin/env bash
set -Eeuo pipefail

DEV_DIR="/root/gce-pwa-dev"
DEV_BRANCH="development"
DEV_PM2_PORT="3000"
ECOSYSTEM="/root/gce-pwa-dev/ecosystem.config.cjs"

cd "$DEV_DIR"

git fetch origin --prune
git checkout "$DEV_BRANCH"
git pull --ff-only origin "$DEV_BRANCH"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

rm -rf .next
npm run build

PM2_ID="$(pm2 jlist | node -e 'const fs=require("fs"); const apps=JSON.parse(fs.readFileSync(0,"utf8")); const match=apps.find(p=>{ const e=p.pm2_env||{}; const cwd=e.pm_cwd||""; return cwd==="/root/gce-pwa-dev"; }); if(match) process.stdout.write(String(match.pm_id));')"

if [ -z "$PM2_ID" ]; then
  pm2 start "$ECOSYSTEM" --only gce-dev
else
  pm2 restart "$PM2_ID" --update-env
fi
pm2 save
