#!/bin/bash
set -euo pipefail

# Dependencies used by this script and conventional-commit-config.sh
REQUIRED_CMDS=(git jq curl gh awk sed grep paste head)
for cmd in "${REQUIRED_CMDS[@]}"; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ Missing dependency: $cmd"
    exit 1
  fi
done

# Ensure API key is set
if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "❌ Please set your OPENAI_API_KEY environment variable."
  exit 1
fi

# Load Conventional Commit config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONVENTIONAL_CONFIG_SCRIPT="${SCRIPT_DIR}/conventional-commit-config.sh"
if [[ ! -x "$CONVENTIONAL_CONFIG_SCRIPT" ]]; then
  echo "❌ Missing helper script: ${CONVENTIONAL_CONFIG_SCRIPT}"
  exit 1
fi
CONVENTIONAL_COMMIT_REGEX="$("$CONVENTIONAL_CONFIG_SCRIPT" regex)"
CONVENTIONAL_COMMIT_TYPES_CSV="$("$CONVENTIONAL_CONFIG_SCRIPT" csv)"

# Detect whether curl supports --fail-with-body (curl ≥ 7.76)
CURL_FAIL_FLAG="--fail-with-body"
if ! curl --help all 2>/dev/null | grep -q -- '--fail-with-body'; then
  CURL_FAIL_FLAG="--fail"
fi

# Set model and endpoint
MODEL="gpt-4"
ENDPOINT="https://api.openai.com/v1/chat/completions"

# Get current branch and base branch
branch=$(git rev-parse --abbrev-ref HEAD)
default_branch=$(git remote show origin | grep 'HEAD branch' | awk '{print $NF}')

# Extract commits from current branch
commits=$(git log "$default_branch"..HEAD --pretty=format:"%s" | grep -E "$CONVENTIONAL_COMMIT_REGEX" || true)

if [ -z "$commits" ]; then
  echo "❌ No Conventional Commits found on this branch."
  exit 1
fi

# Prepare JSON payload with Conventional Commit title prompt
messages=$(jq -n \
  --arg commits "$commits" \
  --arg allowedTypes "$CONVENTIONAL_COMMIT_TYPES_CSV" \
  '[
    {
      "role": "system",
      "content": "You are an assistant that writes pull request titles in the Conventional Commits format (https://www.conventionalcommits.org/en/v1.0.0/)."
    },
    {
      "role": "user",
      "content": "Here are the commit messages:\n\n\($commits)\n\nWrite a concise PR title that summarizes the changes and follows the Conventional Commits format. Allowed types: \($allowedTypes). Include a scope in parentheses if applicable. Return only the title and nothing else."
    }
  ]'
)

# Call OpenAI API
set +e
response=$(curl -sS $CURL_FAIL_FLAG "$ENDPOINT" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"$MODEL\", \"messages\": $messages, \"temperature\": 0.4}" 2>&1)
curl_status=$?
set -e

if [[ $curl_status -ne 0 ]]; then
  echo "❌ OpenAI API request failed (curl exit code: $curl_status)."
  echo "$response" | head -c 500
  exit 1
fi

if ! echo "$response" | jq -e . >/dev/null 2>&1; then
  echo "❌ OpenAI API returned non-JSON output."
  echo "$response" | head -c 500
  exit 1
fi

if echo "$response" | jq -e '.error' >/dev/null 2>&1; then
  err_type=$(echo "$response" | jq -r '.error.type // "unknown"')
  err_msg=$(echo "$response" | jq -r '.error.message // ""' | head -c 300)
  echo "❌ OpenAI API error ($err_type): $err_msg"
  exit 1
fi

# Extract and validate title
title=$(echo "$response" | jq -r '.choices[0].message.content // ""' | head -n 1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

if [[ -z "$title" ]]; then
  echo "⚠️ OpenAI returned an empty title; falling back to first conventional commit."
  title=$(echo "$commits" | head -n 1)
fi

if [[ -n "$CONVENTIONAL_COMMIT_REGEX" ]] && ! echo "$title" | grep -qE "$CONVENTIONAL_COMMIT_REGEX"; then
  echo "⚠️ Suggested title does not match Conventional Commit format; falling back to first conventional commit."
  title=$(echo "$commits" | head -n 1)
fi

echo ""
echo "✅ Suggested PR title from OpenAI:"
echo "$title"
echo ""

# Optionally prompt to confirm and create PR
read -p "📝 Use this title to create the PR? [y/N]: " confirm
if [[ $confirm =~ ^[Yy]$ ]]; then
  gh pr create --title "$title" --body "" --head "$branch"
else
  echo "🛑 PR not created. You can still copy and use the title manually."
fi
