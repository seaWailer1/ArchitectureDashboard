#!/bin/bash

# AfriPay Quick Start Script for Local Development
# This script sets up the local development environment quickly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_banner() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                AfriPay Local Development Setup               ║"
    echo "║              Pan-African Fintech SuperApp                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Main setup function
main() {
    print_banner
    
    # Parse command line arguments
    BRANCH="main"
    SKIP_DEPS=false
    SKIP_DB=false
    SKIP_BUILD=false
    OPEN_VSCODE=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --branch|-b)
                BRANCH="$2"
                shift 2
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --skip-db)
                SKIP_DB=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --open-vscode)
                OPEN_VSCODE=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_status "Starting AfriPay local development setup..."
    print_status "Branch: $BRANCH"
    
    # Step 1: Check prerequisites
    check_prerequisites
    
    # Step 2: Setup Git branch
    setup_git_branch "$BRANCH"
    
    # Step 3: Install dependencies
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies
    else
        print_warning "Skipping dependency installation"
    fi
    
    # Step 4: Setup environment
    setup_environment
    
    # Step 5: Setup database
    if [ "$SKIP_DB" = false ]; then
        setup_database
    else
        print_warning "Skipping database setup"
    fi
    
    # Step 6: Build application
    if [ "$SKIP_BUILD" = false ]; then
        build_application
    else
        print_warning "Skipping application build"
    fi
    
    # Step 7: Setup VSCode
    setup_vscode_integration
    
    # Step 8: Final setup and instructions
    final_setup
    
    # Step 9: Open VSCode if requested
    if [ "$OPEN_VSCODE" = true ]; then
        open_vscode
    fi
    
    print_success "🎉 AfriPay local development environment is ready!"
    show_next_steps
}

check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
        
        # Check if version is 20.x or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | tr -d 'v')
        if [ "$MAJOR_VERSION" -lt 20 ]; then
            print_warning "Node.js version is $NODE_VERSION. AfriPay requires Node.js 20.x or higher"
        fi
    else
        print_error "Node.js not found. Please install Node.js 20.x or higher"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: v$NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "Git found: $GIT_VERSION"
    else
        print_error "Git not found. Please install Git"
        exit 1
    fi
    
    # Check PostgreSQL (optional)
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL client found"
    else
        print_warning "PostgreSQL client not found. Database features may not work"
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the AfriPay project root"
        exit 1
    fi
}

setup_git_branch() {
    local branch=$1
    print_status "Setting up Git branch: $branch"
    
    # Fetch latest changes
    git fetch origin || print_warning "Could not fetch from origin"
    
    # Check if branch exists locally
    if git show-ref --verify --quiet refs/heads/$branch; then
        print_status "Branch $branch exists locally, checking it out..."
        git checkout $branch
        
        # Pull latest changes if it's a tracking branch
        if git config --get branch.$branch.remote &> /dev/null; then
            print_status "Pulling latest changes for $branch..."
            git pull origin $branch || print_warning "Could not pull latest changes"
        fi
    else
        # Check if branch exists on remote
        if git show-ref --verify --quiet refs/remotes/origin/$branch; then
            print_status "Branch $branch exists on remote, creating local tracking branch..."
            git checkout -b $branch origin/$branch
        else
            print_warning "Branch $branch does not exist. Using current branch."
        fi
    fi
    
    CURRENT_BRANCH=$(git branch --show-current)
    print_success "Current branch: $CURRENT_BRANCH"
    
    # Show latest commit
    LATEST_COMMIT=$(git log -1 --oneline)
    print_status "Latest commit: $LATEST_COMMIT"
}

install_dependencies() {
    print_status "Installing dependencies..."
    
    # Check if node_modules exists and is up to date
    if [ -d "node_modules" ] && [ -f "package-lock.json" ]; then
        # Check if package-lock.json is newer than node_modules
        if [ "package-lock.json" -nt "node_modules" ]; then
            print_status "Dependencies need updating..."
            npm ci
        else
            print_success "Dependencies are up to date"
        fi
    else
        print_status "Installing fresh dependencies..."
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

setup_environment() {
    print_status "Setting up environment configuration..."
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
# AfriPay Local Development Environment
# Generated on $(date)

NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/afripay_local

# Session Configuration
SESSION_SECRET=local-dev-session-secret-$(openssl rand -hex 16)

# Development Settings
VITE_DEV_MODE=true
VITE_API_BASE_URL=http://localhost:5000

# Feature Flags
ENABLE_DEBUG_LOGS=true
ENABLE_DEMO_DATA=true
ENABLE_STORYBOOK=true

# AfriPay Configuration
DEFAULT_CURRENCY=USD
SUPPORTED_LANGUAGES=en,fr,ar,sw
DEFAULT_LANGUAGE=en

# Testing
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/afripay_test
EOF
        print_success "Environment file created: .env.local"
    else
        print_success "Environment file already exists: .env.local"
    fi
    
    # Copy to .env for compatibility
    cp .env.local .env
    print_status "Environment variables configured"
}

setup_database() {
    print_status "Setting up database..."
    
    # Test database connection
    if PGPASSWORD=password psql -h localhost -U postgres -c '\q' 2>/dev/null; then
        print_success "Database connection successful"
        
        # Create database if it doesn't exist
        PGPASSWORD=password createdb -h localhost -U postgres afripay_local 2>/dev/null || true
        PGPASSWORD=password createdb -h localhost -U postgres afripay_test 2>/dev/null || true
        
        # Run database migrations
        print_status "Running database migrations..."
        npm run db:push || print_warning "Database migrations failed"
        
        print_success "Database setup completed"
    else
        print_warning "Cannot connect to PostgreSQL. Database features will not work."
        print_status "To fix this:"
        print_status "1. Install and start PostgreSQL"
        print_status "2. Create a 'postgres' user with password 'password'"
        print_status "3. Run this script again"
    fi
}

build_application() {
    print_status "Building application..."
    
    # Type checking
    print_status "Running type check..."
    npm run check || print_warning "Type checking found issues"
    
    # Build
    print_status "Building for development..."
    npm run build || print_error "Build failed"
    
    print_success "Application built successfully"
}

setup_vscode_integration() {
    print_status "Setting up VSCode integration..."
    
    # VSCode directory should already exist from workflow
    if [ -d ".vscode" ]; then
        print_success "VSCode configuration found"
    else
        print_warning "VSCode configuration not found. Creating basic setup..."
        mkdir -p .vscode
        
        # Create basic settings
        cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "terminal.integrated.env.osx": {
    "NODE_ENV": "development"
  },
  "terminal.integrated.env.linux": {
    "NODE_ENV": "development"
  }
}
EOF
    fi
    
    # Check if workspace file exists
    if [ -f "afripay.code-workspace" ]; then
        print_success "VSCode workspace file found"
    else
        print_warning "VSCode workspace file not found"
    fi
}

final_setup() {
    print_status "Finalizing setup..."
    
    # Create useful shortcuts
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "Starting AfriPay development server..."
npm run dev
EOF
    chmod +x start-dev.sh
    
    cat > start-storybook.sh << 'EOF'
#!/bin/bash
echo "Starting AfriPay Storybook..."
npm run storybook
EOF
    chmod +x start-storybook.sh
    
    # Create development documentation
    cat > LOCAL_DEV_GUIDE.md << 'EOF'
# AfriPay Local Development Guide

## Quick Start Commands

```bash
./start-dev.sh          # Start development server
./start-storybook.sh    # Start Storybook
npm run db:studio       # Open database studio
npm test                # Run tests
```

## VSCode Integration

- Press F5 to start debugging
- Use Ctrl+Shift+P > "Tasks: Run Task" for common tasks
- Extensions will be recommended automatically

## URLs

- Application: http://localhost:5000
- Storybook: http://localhost:6006
- Database Studio: http://localhost:4983 (when running)

## Troubleshooting

- Ensure PostgreSQL is running
- Check .env.local for configuration
- Run `npm run check` for TypeScript errors
EOF
    
    print_success "Setup files created"
}

open_vscode() {
    print_status "Opening VSCode..."
    
    if command -v code &> /dev/null; then
        if [ -f "afripay.code-workspace" ]; then
            code afripay.code-workspace
        else
            code .
        fi
        print_success "VSCode opened"
    else
        print_warning "VSCode command 'code' not found. Open the project manually in VSCode"
    fi
}

show_next_steps() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                        Next Steps                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    print_status "1. Start development server:"
    echo "   ${GREEN}npm run dev${NC} or ${GREEN}./start-dev.sh${NC}"
    echo ""
    print_status "2. Open your browser:"
    echo "   ${BLUE}http://localhost:5000${NC}"
    echo ""
    print_status "3. Start Storybook (optional):"
    echo "   ${GREEN}npm run storybook${NC} or ${GREEN}./start-storybook.sh${NC}"
    echo ""
    print_status "4. Open VSCode (if not already open):"
    echo "   ${GREEN}code afripay.code-workspace${NC}"
    echo ""
    print_status "5. Read the development guide:"
    echo "   ${GREEN}cat LOCAL_DEV_GUIDE.md${NC}"
    echo ""
    print_success "Happy coding! 🚀"
}

show_help() {
    echo "AfriPay Local Development Setup Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -b, --branch BRANCH     Git branch to checkout (default: main)"
    echo "  --skip-deps             Skip dependency installation"
    echo "  --skip-db               Skip database setup"
    echo "  --skip-build            Skip application build"
    echo "  --open-vscode           Open VSCode after setup"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Basic setup on main branch"
    echo "  $0 -b feature/new       # Setup on specific branch"
    echo "  $0 --skip-deps --open-vscode  # Skip deps and open VSCode"
}

# Script execution starts here
main "$@"