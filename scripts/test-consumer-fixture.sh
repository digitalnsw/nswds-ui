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

# ── Single-build entry (@nswds/ui/tailwind.css): one build, both halves ──
# The other consumption path: instead of the precompiled styles.css PLUS the
# app's own Tailwind (the two builds above), the consumer imports ONE entry that
# @sources the shipped components, so their utilities and the app's own compile
# together in a single build. This proves that entry resolves with only the
# OPTIONAL PEERS installed (tailwindcss, @nswds/tokens, tw-animate-css — the
# fixture installs no shadcn; that layer is vendored), that both halves land in
# one output, and that a utility both halves use is emitted ONCE — not twice as
# it is in the two-build stylesheet asserted above.
echo "── Assert: shadcn is NOT installed (the single-build entry must not need it)"
[ -d node_modules/shadcn ] && {
  echo "::error::shadcn is installed in the fixture — cannot prove @nswds/ui/tailwind.css compiles without it. Remove it from fixtures/consumer/package.json." >&2
  exit 1
} || true

echo "── Compiling the single-build entry with the consumer's own Tailwind"
SINGLE="$WORK/single-build.css"
npx @tailwindcss/cli -i src/app-singlebuild.css -o "$SINGLE" --minify
[ -s "$SINGLE" ] || {
  echo "::error::single-build output is empty — @nswds/ui/tailwind.css failed to compile." >&2
  exit 1
}

echo "── Assert: the app's own markup was scanned ('justify-evenly' present)"
grep -qE "\.justify-evenly[{,]" "$SINGLE" || {
  echo "::error::'justify-evenly' missing from the single build — the consumer's markup was not scanned." >&2
  exit 1
}

echo "── Assert: the components were scanned via @source dist ('$PACKAGE_MARKER' present)"
grep -qF "$PACKAGE_MARKER" "$SINGLE" || {
  echo "::error::'$PACKAGE_MARKER' missing from the single build — @source '../../dist' did not compile the library's components." >&2
  exit 1
}

# A utility BOTH halves use. The two-build stylesheet holds two copies (one per
# build); a single build must emit exactly one. Prove it is genuinely shared
# first, or the count proves nothing.
SHARED_MARKER='.flex{'
echo "── Assert: shared utility '$SHARED_MARKER' is emitted exactly once (de-duplicated)"
grep -qF "$SHARED_MARKER" "$INSTALLED_CSS" || {
  echo "::error::'$SHARED_MARKER' is not in the packaged stylesheet — pick another shared class for the de-dup check (here and above)." >&2
  exit 1
}
SHARED_COUNT=$(grep -oF "$SHARED_MARKER" "$SINGLE" | wc -l | tr -d ' ')
[ "$SHARED_COUNT" = "1" ] || {
  echo "::error::'$SHARED_MARKER' appears $SHARED_COUNT time(s) in the single build; expected exactly 1 — a single build must not duplicate utilities." >&2
  exit 1
}

# The order-dependent pairs #207 exists for are NOT covered by
# check-cascade-safety below — by design it only guards a rule against a
# CONDITIONAL (media/container) override of the same property (see its header),
# not unconditional shorthand-vs-longhand. So assert those directly. A single
# build emits each utility once in Tailwind's canonical order, longhand last, so
# the longhand wins: SelectItem's `.shrink-0` after `.flex-1` (flex-shrink stays
# 0), FieldSeparator's `.top-1\/2` after `.inset-0` (top stays 50%). In the
# two-build stylesheet a second copy of the shorthand lands in the app's half,
# after ours, and clobbers them — the whole reason for the single-build entry.
assert_emitted_after() { # winner loser description
  local winner="$1" loser="$2" desc="$3" w l
  # `|| true`: a missing marker makes the pipeline exit non-zero (pipefail), and
  # under `set -e` that would abort here before the `[ -n … ]` guard below can
  # report it. Neutralise the exit so the guard emits its own clear diagnostic.
  w=$(grep -boF "$winner" "$SINGLE" | head -1 | cut -d: -f1) || true
  l=$(grep -boF "$loser" "$SINGLE" | head -1 | cut -d: -f1) || true
  [ -n "$w" ] && [ -n "$l" ] || {
    echo "::error::single build: '$winner' or '$loser' missing — cannot verify $desc." >&2
    exit 1
  }
  [ "$w" -gt "$l" ] || {
    echo "::error::single build: '$winner' (byte $w) is not emitted after '$loser' (byte $l) — $desc would be clobbered." >&2
    exit 1
  }
}
echo "── Assert: single-build canonical order resolves the shorthand/longhand pairs #207 targets"
assert_emitted_after '.shrink-0{' '.flex-1{' "SelectItem shrink-0 vs flex-1"
assert_emitted_after '.top-1\/2{' '.inset-0{' "FieldSeparator top-1/2 vs inset-0"

# Belt-and-braces: the conditional-pair hazard check-cascade DOES cover can't
# arise under a single sort order either, but run the guard over the combined
# output so a future change to the entry can't regress it.
echo "── Assert: the single-build stylesheet is cascade-safe too"
node "$ROOT/packages/ui/scripts/check-cascade-safety.mjs" \
  --css "$SINGLE" \
  --src "$ROOT/packages/ui/src"

echo "✔ Consumer fixture: two-build AND single-build paths — install, typecheck, build, tree-shaking, de-dup, order safety and cascade safety all pass"
