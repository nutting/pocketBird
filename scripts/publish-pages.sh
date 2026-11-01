#!/usr/bin/env bash
# Publish a built site with the current repository's existing Git authentication.
# A temporary index keeps both source files and the caller's staging area intact.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
test -s dist/index.html
touch dist/.nojekyll
pages_index=$(mktemp)
rm "$pages_index"
trap 'rm -f "$pages_index"' EXIT
GIT_INDEX_FILE="$pages_index" git --work-tree="$PWD/dist" add --all
pages_tree=$(GIT_INDEX_FILE="$pages_index" git write-tree)
parent_args=()
if test -n "$(git ls-remote --heads origin refs/heads/gh-pages)"; then
  git fetch origin gh-pages
  parent_args=(-p "$(git rev-parse FETCH_HEAD)")
fi
pages_commit=$(git commit-tree "$pages_tree" "${parent_args[@]}" -m "Publish Pocket Bird $(git rev-parse --short HEAD)")
git push origin "$pages_commit:refs/heads/gh-pages"
printf 'Published static files in commit %s to gh-pages.\n' "$pages_commit"
