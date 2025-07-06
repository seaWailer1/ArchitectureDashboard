#!/bin/bash

# AfriPay Git Workflow Helper Script
# Simplifies common Git operations for local development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to show current status
show_status() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                   Git Status Summary                         ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    
    CURRENT_BRANCH=$(git branch --show-current)
    print_status "Current branch: $CURRENT_BRANCH"
    
    # Show latest commit
    LATEST_COMMIT=$(git log -1 --oneline)
    print_status "Latest commit: $LATEST_COMMIT"
    
    # Show working directory status
    if git diff-index --quiet HEAD --; then
        print_success "Working directory is clean"
    else
        print_warning "Working directory has uncommitted changes"
        git status --porcelain
    fi
    
    # Show unpushed commits
    UNPUSHED=$(git log --oneline @{u}.. 2>/dev/null | wc -l)
    if [ "$UNPUSHED" -gt 0 ]; then
        print_warning "$UNPUSHED unpushed commits"
    else
        print_success "All commits are pushed"
    fi
    echo ""
}

# Function to pull from main
pull_from_main() {
    print_status "Pulling latest changes from main branch..."
    
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Stash any uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "Stashing uncommitted changes..."
        git stash push -m "Auto-stash before pulling main"
        STASHED=true
    else
        STASHED=false
    fi
    
    # Fetch latest changes
    git fetch origin
    
    # If we're on main, just pull
    if [ "$CURRENT_BRANCH" = "main" ]; then
        git pull origin main
        print_success "Pulled latest changes to main branch"
    else
        # Switch to main, pull, and switch back
        git checkout main
        git pull origin main
        git checkout "$CURRENT_BRANCH"
        
        # Rebase current branch on main
        print_status "Rebasing $CURRENT_BRANCH on latest main..."
        if git rebase main; then
            print_success "Successfully rebased $CURRENT_BRANCH on main"
        else
            print_error "Rebase conflicts detected. Please resolve manually."
            git rebase --abort
            return 1
        fi
    fi
    
    # Restore stashed changes
    if [ "$STASHED" = true ]; then
        print_status "Restoring stashed changes..."
        git stash pop
    fi
    
    print_success "Pull from main completed"
}

# Function to create feature branch
create_feature_branch() {
    local branch_name=$1
    
    if [ -z "$branch_name" ]; then
        echo -n "Enter feature branch name (without 'feature/' prefix): "
        read branch_name
    fi
    
    if [ -z "$branch_name" ]; then
        print_error "Branch name cannot be empty"
        return 1
    fi
    
    # Sanitize branch name
    branch_name=$(echo "$branch_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    local full_branch_name="feature/$branch_name"
    
    print_status "Creating feature branch: $full_branch_name"
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create and checkout new branch
    git checkout -b "$full_branch_name"
    
    print_success "Created and switched to branch: $full_branch_name"
    print_status "You can now start working on your feature"
}

# Function to deploy local branch
deploy_local_branch() {
    local branch_name=$1
    
    if [ -z "$branch_name" ]; then
        branch_name=$(git branch --show-current)
        print_status "Using current branch: $branch_name"
    fi
    
    print_status "Preparing local deployment for branch: $branch_name"
    
    # Check if we have uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes. Commit them first."
        git status
        return 1
    fi
    
    # Run the quick start script
    if [ -f "scripts/quick-start-local.sh" ]; then
        print_status "Running local development setup..."
        ./scripts/quick-start-local.sh --branch "$branch_name" --open-vscode
    else
        print_error "Local setup script not found"
        return 1
    fi
}

# Function to sync with remote
sync_with_remote() {
    print_status "Syncing with remote repository..."
    
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Fetch all branches
    git fetch origin
    
    # Check if current branch has a remote tracking branch
    if git config --get branch.$CURRENT_BRANCH.remote &> /dev/null; then
        REMOTE_BRANCH=$(git config --get branch.$CURRENT_BRANCH.merge | sed 's|refs/heads/||')
        print_status "Pulling changes from origin/$REMOTE_BRANCH..."
        
        if git pull origin "$REMOTE_BRANCH"; then
            print_success "Successfully synced with remote"
        else
            print_warning "Merge conflicts detected. Please resolve manually."
        fi
    else
        print_warning "Current branch '$CURRENT_BRANCH' has no remote tracking branch"
        print_status "Would you like to push it to origin? (y/n)"
        read -r response
        if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
            git push -u origin "$CURRENT_BRANCH"
            print_success "Branch pushed and tracking set up"
        fi
    fi
}

# Function to clean up old branches
cleanup_branches() {
    print_status "Cleaning up merged branches..."
    
    # Switch to main
    git checkout main
    
    # Pull latest main
    git pull origin main
    
    # Find merged branches (excluding main and current branch)
    MERGED_BRANCHES=$(git branch --merged | grep -v '^\*' | grep -v 'main' | grep -v 'master')
    
    if [ -z "$MERGED_BRANCHES" ]; then
        print_success "No merged branches to clean up"
        return 0
    fi
    
    print_status "Found merged branches:"
    echo "$MERGED_BRANCHES"
    
    echo ""
    print_status "Delete these branches? (y/n)"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        echo "$MERGED_BRANCHES" | xargs -n 1 git branch -d
        print_success "Merged branches deleted"
    else
        print_status "Branch cleanup cancelled"
    fi
}

# Function to show help
show_help() {
    echo "AfriPay Git Workflow Helper"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status                  Show current Git status"
    echo "  pull-main              Pull latest changes from main branch"
    echo "  create-feature [name]   Create a new feature branch"
    echo "  deploy-local [branch]   Deploy branch to local environment"
    echo "  sync                   Sync with remote repository"
    echo "  cleanup                Clean up merged branches"
    echo "  help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status              # Show current Git status"
    echo "  $0 pull-main           # Pull latest from main"
    echo "  $0 create-feature new-feature  # Create feature/new-feature branch"
    echo "  $0 deploy-local        # Deploy current branch locally"
    echo "  $0 sync                # Sync current branch with remote"
    echo "  $0 cleanup             # Clean up merged branches"
}

# Main script logic
case "$1" in
    "status")
        show_status
        ;;
    "pull-main")
        pull_from_main
        ;;
    "create-feature")
        create_feature_branch "$2"
        ;;
    "deploy-local")
        deploy_local_branch "$2"
        ;;
    "sync")
        sync_with_remote
        ;;
    "cleanup")
        cleanup_branches
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        print_status "AfriPay Git Workflow Helper"
        echo "Run '$0 help' for available commands"
        show_status
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Run '$0 help' for available commands"
        exit 1
        ;;
esac