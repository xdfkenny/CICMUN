#!/usr/bin/env bash
# Full regression audit for the CICMUN portal:
#   lint → unit tests → production build → dual-viewport Playwright layout audit
#
# The layout audit opens all 7 routes at 1440×900 and 375×812 and asserts the
# structural guarantees (single H1, zero horizontal overflow, lang=en, no
# placeholder nav, canonical after hydration, gallery pagination anchor) plus a
# branded 404 page, while archiving screenshots under .audit/shots/ for
# before/after visual comparison.
#
# Usage:  ./scripts/audit.sh          (full run)
#         ./scripts/audit.sh --quick  (skip lint/tests/build, reuse existing build)
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "${1:-}" != "--quick" ]]; then
  echo "==> eslint"
  npm run lint

  echo "==> unit tests"
  npm run test:unit

  echo "==> production build"
  npm run build
else
  echo "==> --quick: skipping lint/tests/build (reusing .output)"
fi

echo "==> playwright dual-viewport layout audit"
npx playwright test test/e2e/audit.spec.ts --reporter=line

echo "==> audit passed — screenshots in .audit/shots/"