#!/bin/bash

# Update GitHub Actions versions across all workflow files

echo "Updating GitHub Actions to latest versions..."

# List of workflow files
WORKFLOW_FILES=(
  ".github/workflows/accessibility.yml"
  ".github/workflows/ci.yml"
  ".github/workflows/component-library.yml"
  ".github/workflows/component-release.yml"
  ".github/workflows/database.yml"
  ".github/workflows/deploy.yml"
  ".github/workflows/deployment.yml"
  ".github/workflows/i18n.yml"
  ".github/workflows/local-development.yml"
  ".github/workflows/performance.yml"
  ".github/workflows/security.yml"
  ".github/workflows/storybook.yml"
  ".github/workflows/workflow-config.yml"
)

# Update actions versions
for file in "${WORKFLOW_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Update actions versions
    sed -i 's/actions\/upload-artifact@v3/actions\/upload-artifact@v4/g' "$file"
    sed -i 's/actions\/download-artifact@v3/actions\/download-artifact@v4/g' "$file"
    sed -i 's/actions\/create-release@v1/softprops\/action-gh-release@v1/g' "$file"
    sed -i 's/actions\/upload-release-asset@v1/softprops\/action-gh-release@v1/g' "$file"
    
    echo "✅ Updated $file"
  else
    echo "⚠️ File not found: $file"
  fi
done

echo "✅ All GitHub Actions versions updated!"
echo "📝 Backup files created with .backup extension"