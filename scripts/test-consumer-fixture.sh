#!/usr/bin/env bash
# Verifies the PACKED @nswds/ui artefact end-to-end, the way a consumer
# receives it: npm pack → cold install into the fixtures/consumer Vite app →
# tsc --noEmit → vite build → assert tree-shaking (the imported icon's path
# data is in the bundle; an unimported icon's is not).
#
# publint/attw validate the package's *shape*; this exercises it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "── Packing @nswds/ui"
TARBALL="$(cd "$ROOT/packages/ui" && npm pack --pack-destination "$WORK" --silent | tail -n1)"
echo "   $TARBALL"

echo "── Installing fixture (cold)"
cp -R "$ROOT/fixtures/consumer/." "$WORK/app"
cd "$WORK/app"
npm install --silent --no-audit --no-fund "$WORK/$TARBALL"

echo "── Typecheck"
npx tsc --noEmit

echo "── Build"
npx vite build --logLevel warn

BUNDLE_DIR="dist/assets"

# Distinctive path-data prefixes, read from the real icon sources so the
# assertion can't drift from the icons themselves.
imported_d="$(grep -o 'd="[^"]\{60\}' "$ROOT/packages/ui/src/icons/search.tsx" | head -1 | cut -c4-)"
unimported_d="$(grep -o 'd="[^"]\{60\}' "$ROOT/packages/ui/src/icons/10k.tsx" | head -1 | cut -c4-)"

echo "── Assert: imported icon (search) is in the bundle"
grep -rqF "$imported_d" "$BUNDLE_DIR" || {
  echo "::error::IconSearch path data missing from the bundle — icon import is broken." >&2
  exit 1
}

echo "── Assert: unimported icon (10k) is NOT in the bundle (tree-shaking)"
if grep -rqF "$unimported_d" "$BUNDLE_DIR"; then
  echo "::error::Unimported icon path data found in the bundle — icon tree-shaking has regressed." >&2
  exit 1
fi

echo "── Assert: compiled stylesheet shipped"
ls "$BUNDLE_DIR"/*.css >/dev/null 2>&1 || {
  echo "::error::No CSS asset in the consumer build — @nswds/ui/styles.css import is broken." >&2
  exit 1
}

echo "✔ Consumer fixture: install, typecheck, build, and tree-shaking all pass"
