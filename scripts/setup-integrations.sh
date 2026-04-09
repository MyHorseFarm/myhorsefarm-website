#!/bin/bash
# ============================================================
# My Horse Farm — Integration Setup Agent Script
# ============================================================
# This script validates and tests all third-party integrations
# after env vars are set on Vercel.
#
# Usage: ./scripts/setup-integrations.sh [check|test-square|test-meta|test-all]
# ============================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load .env.local if present (using grep to avoid bash parsing issues with unquoted values)
if [ -f .env.local ]; then
  while IFS= read -r line; do
    # Skip comments and empty lines
    [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
    # Only export lines that look like KEY=VALUE (not commented-out vars)
    if [[ "$line" =~ ^[A-Z_]+= ]]; then
      export "$line" 2>/dev/null || true
    fi
  done < .env.local
fi

log_ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_fail() { echo -e "${RED}[FAIL]${NC} $1"; }
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }

# ---- CHECK: Verify env vars exist ----
check_env() {
  echo ""
  echo "========================================="
  echo " Environment Variable Check"
  echo "========================================="

  local all_good=true

  # Square
  echo ""
  log_info "--- Square ---"
  if [ -n "${SQUARE_ACCESS_TOKEN:-}" ]; then
    log_ok "SQUARE_ACCESS_TOKEN is set (${#SQUARE_ACCESS_TOKEN} chars)"
  else
    log_fail "SQUARE_ACCESS_TOKEN is NOT set"
    all_good=false
  fi

  if [ -n "${SQUARE_WEBHOOK_SIGNATURE_KEY:-}" ]; then
    log_ok "SQUARE_WEBHOOK_SIGNATURE_KEY is set (${#SQUARE_WEBHOOK_SIGNATURE_KEY} chars)"
  else
    log_fail "SQUARE_WEBHOOK_SIGNATURE_KEY is NOT set"
    all_good=false
  fi

  if [ -n "${SQUARE_ENVIRONMENT:-}" ]; then
    log_ok "SQUARE_ENVIRONMENT = ${SQUARE_ENVIRONMENT}"
  else
    log_warn "SQUARE_ENVIRONMENT not set (defaults to production)"
  fi

  if [ -n "${NEXT_PUBLIC_SQUARE_LOCATION_ID:-}" ]; then
    log_ok "NEXT_PUBLIC_SQUARE_LOCATION_ID is set"
  else
    log_warn "NEXT_PUBLIC_SQUARE_LOCATION_ID not set (order search won't work)"
  fi

  # Meta
  echo ""
  log_info "--- Meta CAPI ---"
  if [ -n "${META_PIXEL_ID:-}" ]; then
    log_ok "META_PIXEL_ID is set (${META_PIXEL_ID})"
  else
    log_fail "META_PIXEL_ID is NOT set"
    all_good=false
  fi

  if [ -n "${META_CAPI_ACCESS_TOKEN:-}" ]; then
    log_ok "META_CAPI_ACCESS_TOKEN is set (${#META_CAPI_ACCESS_TOKEN} chars)"
  else
    log_fail "META_CAPI_ACCESS_TOKEN is NOT set"
    all_good=false
  fi

  if [ -n "${FACEBOOK_PAGE_ID:-}" ]; then
    log_ok "FACEBOOK_PAGE_ID is set"
  else
    log_warn "FACEBOOK_PAGE_ID not set (ad posting won't work)"
  fi

  if [ -n "${FACEBOOK_PAGE_ACCESS_TOKEN:-}" ]; then
    log_ok "FACEBOOK_PAGE_ACCESS_TOKEN is set"
  else
    log_warn "FACEBOOK_PAGE_ACCESS_TOKEN not set (ad posting won't work)"
  fi

  # Summary
  echo ""
  echo "========================================="
  if $all_good; then
    log_ok "All required env vars are set!"
  else
    log_fail "Some env vars are missing — see above"
  fi
  echo "========================================="
}

# ---- TEST: Square API connectivity ----
test_square() {
  echo ""
  log_info "Testing Square API connectivity..."

  if [ -z "${SQUARE_ACCESS_TOKEN:-}" ]; then
    log_fail "SQUARE_ACCESS_TOKEN not set, skipping"
    return 1
  fi

  local response
  response=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer ${SQUARE_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    "https://connect.squareup.com/v2/locations")

  local http_code
  http_code=$(echo "$response" | tail -n1)
  local body
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    log_ok "Square API connection successful (HTTP 200)"
    local location_count
    location_count=$(echo "$body" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('locations',[])))" 2>/dev/null || echo "?")
    log_info "Found ${location_count} location(s)"

    # Show location IDs for reference
    echo "$body" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for loc in data.get('locations', []):
    print(f\"  - {loc['name']}: {loc['id']} ({loc.get('status','unknown')})\")" 2>/dev/null || true
  else
    log_fail "Square API returned HTTP ${http_code}"
    echo "$body" | head -5
    return 1
  fi
}

# ---- TEST: Meta CAPI connectivity ----
test_meta() {
  echo ""
  log_info "Testing Meta CAPI connectivity..."

  if [ -z "${META_PIXEL_ID:-}" ] || [ -z "${META_CAPI_ACCESS_TOKEN:-}" ]; then
    log_fail "META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set, skipping"
    return 1
  fi

  # Send a test event (PageView) - this is harmless and validates the token
  local test_event
  test_event=$(cat <<JSONEOF
{
  "data": [{
    "event_name": "PageView",
    "event_time": $(date +%s),
    "action_source": "system_generated",
    "event_source_url": "https://www.myhorsefarm.com",
    "user_data": {
      "client_ip_address": "0.0.0.0",
      "client_user_agent": "integration-test"
    }
  }],
  "test_event_code": "TEST_$(date +%s)"
}
JSONEOF
)

  local response
  response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$test_event" \
    "https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}")

  local http_code
  http_code=$(echo "$response" | tail -n1)
  local body
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    log_ok "Meta CAPI connection successful (HTTP 200)"
    log_info "Response: $body"
    log_info "Check Events Manager > Test Events to see the test event"
  else
    log_fail "Meta CAPI returned HTTP ${http_code}"
    echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',{}).get('message','Unknown error'))" 2>/dev/null || echo "$body"
    return 1
  fi
}

# ---- TEST ALL ----
test_all() {
  test_square || true
  test_meta || true

  echo ""
  echo "========================================="
  log_info "Integration tests complete"
  echo "========================================="
}

# ---- MAIN ----
case "${1:-check}" in
  check)       check_env ;;
  test-square) test_square ;;
  test-meta)   test_meta ;;
  test-all)    check_env && test_all ;;
  *)
    echo "Usage: $0 [check|test-square|test-meta|test-all]"
    exit 1
    ;;
esac
