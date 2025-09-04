#!/bin/bash

# 🔐 CareerBlast Git Security Cleanup Script
# This script removes sensitive data from git history

echo "🚨 CRITICAL: This will rewrite git history and remove sensitive data"
echo "⚠️  Make sure you have backups before proceeding!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🔄 Starting git security cleanup..."

# Remove .env from git history
echo "📝 Removing .env from git history..."
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env' \
    --prune-empty --tag-name-filter cat -- --all

# Remove any other sensitive files that might have been committed
echo "📝 Removing other sensitive files..."
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env.local .env.production .env.staging' \
    --prune-empty --tag-name-filter cat -- --all

# Clean up refs
echo "🧹 Cleaning up git references..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo "✅ Git security cleanup completed!"
echo ""
echo "🔄 Next steps:"
echo "1. Update all credentials in .env file"
echo "2. Force push to remote: git push origin --force --all"
echo "3. Notify team members to re-clone the repository"
echo ""
echo "⚠️  WARNING: All team members must re-clone the repository after force push!"
