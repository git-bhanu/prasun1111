#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="$(mktemp -t tina-local-build.XXXXXX)"

npx tinacms dev --noWatch > "$LOG_FILE" 2>&1 &
TINA_PID=$!
trap 'kill "$TINA_PID" 2>/dev/null || true' EXIT

echo "Waiting for Tina local server to fully index content..."

READY=false
for _ in $(seq 1 60); do
  RESPONSE="$(curl -s -X POST http://localhost:4001/graphql \
    -H 'Content-Type: application/json' \
    -d '{"query":"{ design: __type(name: \"Design\") { name } writing: __type(name: \"Writing\") { name } film: __type(name: \"Film\") { name } installation: __type(name: \"Installation\") { name } global: __type(name: \"Global\") { fields { name } } }"}' \
    2>/dev/null || true)"

  if echo "$RESPONSE" | grep -q '"Design"' \
    && echo "$RESPONSE" | grep -q '"Writing"' \
    && echo "$RESPONSE" | grep -q '"Film"' \
    && echo "$RESPONSE" | grep -q '"Installation"' \
    && echo "$RESPONSE" | grep -q '"sameAs"'; then
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" != "true" ]; then
  echo "Tina local server did not fully index content in time. Log: $LOG_FILE"
  exit 1
fi

echo "Tina local server ready."

rm -f "tina/__generated__/client.ts"
TINA_LOCAL=true npx next build
