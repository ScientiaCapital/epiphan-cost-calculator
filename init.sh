#!/bin/bash
set -e
echo "=== epiphan-cost-calculator setup ==="
[ -f .env.local ] || { echo "ERROR: .env.local missing. Run: vercel env pull"; exit 1; }
npm install
echo "Starting dev server..."
npm run dev
