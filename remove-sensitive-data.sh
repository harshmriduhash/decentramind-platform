#!/bin/bash

# Create a backup of the current state
git branch backup-main

# Remove sensitive files from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch \
    local.txt \
    .env* \
    scripts/deploy-devnet.sh \
    scripts/setup-devnet-env.sh \
    reset-and-rebuild.sh" \
  --prune-empty --tag-name-filter cat -- --all

# Add the files back without sensitive information
cp .env.template scripts/deploy-devnet.sh.template
cp .env.template scripts/setup-devnet-env.sh.template
cp .env.template reset-and-rebuild.sh.template

# Force push to remove sensitive data from GitHub
echo "Review the changes and then run: git push origin --force --all"