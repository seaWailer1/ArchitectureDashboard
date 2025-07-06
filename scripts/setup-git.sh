
#!/bin/bash

# AfriPay SuperApp - Git Setup Script
echo "🚀 Setting up AfriPay SuperApp for GitHub..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Set up git configuration
echo "📝 Setting up Git configuration..."
echo "Enter your GitHub username:"
read username
echo "Enter your email:"
read email

git config user.name "$username"
git config user.email "$email"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOL
node_modules
dist
.DS_Store
server/public
vite.config.ts.*
*.tar.gz
.env
.env.local
.env.production
*.log
coverage/
storybook-static/
EOL
    echo "✅ .gitignore created"
fi

# Add all files and create initial commit
git add .
git status

echo "🔍 Review the files to be committed above."
echo "Ready to create initial commit? (y/n):"
read confirm

if [ "$confirm" = "y" ]; then
    git commit -m "feat: initial commit - AfriPay SuperApp

- Complete fintech application with multi-role support
- 103+ React components with TypeScript
- WCAG AAA accessibility compliance
- Multi-language support (50+ languages)
- Comprehensive testing suite
- Storybook component documentation
- Component management CLI
- Database schema and migrations
- Authentication and security features"
    
    echo "✅ Initial commit created"
    
    echo "Enter your GitHub repository URL (e.g., https://github.com/username/afripay-superapp.git):"
    read repo_url
    
    git remote add origin "$repo_url"
    git branch -M main
    
    echo "🚀 Ready to push to GitHub!"
    echo "Run: git push -u origin main"
else
    echo "⏸️  Commit cancelled. Review your changes and run the script again."
fi

echo "📋 Next steps:"
echo "1. git push -u origin main"
echo "2. Set up GitHub Pages for Storybook (in repository settings)"
echo "3. Configure repository secrets if needed"
echo "4. Enable GitHub Actions in repository settings"
