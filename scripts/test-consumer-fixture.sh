#!/usr/bin/env bash
# Verifies the PACKED @nswds/ui artefact end-to-end, the way a consumer
# receives it: npm pack → cold install into the fixtures/consumer Vite app →
# tsc --noEmit → vite build → assert tree-shaking (the imported icon's path
# data is in the bundle; an unimported icon's is not) → assert the stylesheet
# is cascade-safe in the two-build configuration the README documents.
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

# The fixture imports @nswds/ui/styles.css AND runs its own Tailwind build, so
# its stylesheet holds two independently-sorted sets of utilities in one cascade
# layer — the configuration in which an app's own `.justify-center` outranked
# Footer's `.lg\:justify-start` on v4.3.0. Prove both halves are really there
# before asserting anything about them, or the check silently degrades into a
# package-only one the moment app.css or the fixture markup drifts.
#
# The two markers have to be classes only ONE half can emit. Every colliding
# utility in the fixture's markup is by definition one the package emits too, so
# none of them can tell the halves apart — the app marker is a class the package
# never uses, and its uniqueness is re-verified below rather than assumed.
PACKAGE_MARKER='max-lg\:justify-center'
APP_MARKER='justify-evenly'
INSTALLED_CSS="node_modules/@nswds/ui/dist/styles.css"

echo "── Assert: '$APP_MARKER' is still absent from the packaged stylesheet"
# Without this, a moved/renamed path would make the grep below fail open and
# skip the very check that keeps the marker honest.
[ -f "$INSTALLED_CSS" ] || {
  echo "::error::$INSTALLED_CSS not found in the installed package — cannot verify that '$APP_MARKER' is app-only." >&2
  exit 1
}
if grep -qE "\.${APP_MARKER}[{,]" "$INSTALLED_CSS"; then
  echo "::error::@nswds/ui now emits '.${APP_MARKER}', so it can no longer prove the fixture's own Tailwind build ran. Pick a different app-only marker here and in fixtures/consumer/src/main.tsx." >&2
  exit 1
fi

# Vite can emit more than one CSS asset, and the halves are only interleaved
# within a single file — so select by content rather than trusting glob order.
echo "── Assert: one CSS asset holds both halves (ours + the app's own build)"
STYLESHEET=""
for candidate in "$BUNDLE_DIR"/*.css; do
  if grep -qF "$PACKAGE_MARKER" "$candidate" && grep -qE "\.${APP_MARKER}[{,]" "$candidate"; then
    STYLESHEET="$candidate"
    break
  fi
done

if [ -z "$STYLESHEET" ]; then
  echo "::error::No CSS asset contains both '$PACKAGE_MARKER' (@nswds/ui) and '.$APP_MARKER' (the fixture's own build), so this is no longer testing the two-build hazard. Candidates:" >&2
  for candidate in "$BUNDLE_DIR"/*.css; do
    echo "::error::  $candidate — package half: $(grep -cF "$PACKAGE_MARKER" "$candidate"), app half: $(grep -cE "\.${APP_MARKER}[{,]" "$candidate")" >&2
  done
  exit 1
fi
echo "   $STYLESHEET"

# Same invariant the package's own build enforces, but against the stylesheet a
# consumer actually ends up with: no element a component renders may carry two
# rules that set one property differently and are separated only by emission
# order.
echo "── Assert: no component depends on emission order in the combined stylesheet"
node "$ROOT/packages/ui/scripts/check-cascade-safety.mjs" \
  --css "$STYLESHEET" \
  --src "$ROOT/packages/ui/src"

echo "✔ Consumer fixture: install, typecheck, build, tree-shaking and cascade safety all pass"
