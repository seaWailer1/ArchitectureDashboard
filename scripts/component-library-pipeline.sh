#!/bin/bash

# AfriPay Component Library Pipeline Management Script
# Integrates with Git workflows for automated component development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_component() {
    echo -e "${PURPLE}[COMPONENT]${NC} $1"
}

print_banner() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║            AfriPay Component Library Pipeline               ║"
    echo "║              Automated Component Management                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Main pipeline management function
main() {
    print_banner
    
    # Parse command line arguments
    ACTION=""
    COMPONENT_NAME=""
    BRANCH_PREFIX="feature/component-"
    AUTO_PUSH=false
    SKIP_TESTS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            create|update|validate|publish|sync)
                ACTION="$1"
                shift
                ;;
            --component|-c)
                COMPONENT_NAME="$2"
                shift 2
                ;;
            --auto-push)
                AUTO_PUSH=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
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
    
    if [ -z "$ACTION" ]; then
        print_error "No action specified"
        show_help
        exit 1
    fi
    
    print_status "Component Library Pipeline Action: $ACTION"
    
    case "$ACTION" in
        "create")
            create_component_workflow "$COMPONENT_NAME"
            ;;
        "update")
            update_component_workflow "$COMPONENT_NAME"
            ;;
        "validate")
            validate_component_library
            ;;
        "publish")
            publish_component_library
            ;;
        "sync")
            sync_component_library
            ;;
        *)
            print_error "Unknown action: $ACTION"
            show_help
            exit 1
            ;;
    esac
}

# Create new component with Git workflow
create_component_workflow() {
    local component_name=$1
    
    if [ -z "$component_name" ]; then
        echo -n "Enter component name: "
        read component_name
    fi
    
    if [ -z "$component_name" ]; then
        print_error "Component name cannot be empty"
        return 1
    fi
    
    # Sanitize component name
    component_name=$(echo "$component_name" | sed 's/[^a-zA-Z0-9]//g')
    local branch_name="${BRANCH_PREFIX}${component_name,,}"
    
    print_component "Creating new component: $component_name"
    print_status "Branch: $branch_name"
    
    # Create feature branch
    print_status "Creating feature branch..."
    git fetch origin
    git checkout main
    git pull origin main
    git checkout -b "$branch_name"
    
    # Generate component using CLI
    print_status "Generating component files..."
    if npx tsx codex.component.mts add "$component_name"; then
        print_success "Component files generated successfully"
    else
        print_error "Failed to generate component files"
        return 1
    fi
    
    # Add default story content
    create_default_story "$component_name"
    
    # Add default test content
    create_default_test "$component_name"
    
    # Stage changes
    print_status "Staging component files..."
    git add client/src/components/"$component_name"/
    git add client/src/components/index.ts
    
    # Commit changes
    local commit_message="feat(components): add $component_name component
    
- Generated component structure with CLI
- Added Storybook story with examples
- Added unit tests with accessibility checks
- Updated component exports

Component includes:
- TypeScript component definition
- Responsive design patterns
- WCAG AAA accessibility features
- Multilingual support ready
- Mobile-first approach"
    
    git commit -m "$commit_message"
    print_success "Component committed to branch: $branch_name"
    
    # Push branch if auto-push enabled
    if [ "$AUTO_PUSH" = true ]; then
        print_status "Pushing branch to origin..."
        git push -u origin "$branch_name"
        print_success "Branch pushed: $branch_name"
        
        # Trigger component library pipeline
        print_status "Component library pipeline will trigger automatically"
        print_status "Monitor progress at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
    fi
    
    # Show next steps
    print_status "Next steps:"
    echo "1. Implement component logic in client/src/components/$component_name/$component_name.tsx"
    echo "2. Add stories in client/src/components/$component_name/$component_name.stories.tsx"
    echo "3. Write tests in client/src/components/$component_name/$component_name.test.tsx"
    echo "4. Push branch: git push -u origin $branch_name"
    echo "5. Create pull request for component review"
}

# Update existing component with pipeline integration
update_component_workflow() {
    local component_name=$1
    
    if [ -z "$component_name" ]; then
        echo -n "Enter component name to update: "
        read component_name
    fi
    
    if [ ! -d "client/src/components/$component_name" ]; then
        print_error "Component '$component_name' not found"
        return 1
    fi
    
    print_component "Updating component: $component_name"
    
    # Check if we're on the right branch
    current_branch=$(git branch --show-current)
    expected_branch="${BRANCH_PREFIX}${component_name,,}"
    
    if [ "$current_branch" != "$expected_branch" ] && [ "$current_branch" != "main" ]; then
        print_warning "Current branch: $current_branch"
        print_status "Expected branch: $expected_branch"
        echo -n "Switch to $expected_branch? (y/n): "
        read -r response
        if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
            if git show-ref --verify --quiet refs/heads/$expected_branch; then
                git checkout "$expected_branch"
            else
                git checkout -b "$expected_branch"
            fi
        fi
    fi
    
    # Validate component structure
    print_status "Validating component structure..."
    validate_single_component "$component_name"
    
    # Run component tests
    if [ "$SKIP_TESTS" = false ]; then
        print_status "Running component tests..."
        npm test -- --testPathPattern="$component_name" --passWithNoTests
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes"
        git status --porcelain
        
        echo -n "Commit changes? (y/n): "
        read -r response
        if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
            echo -n "Enter commit message: "
            read commit_message
            if [ -z "$commit_message" ]; then
                commit_message="feat(components): update $component_name component"
            fi
            
            git add client/src/components/"$component_name"/
            git commit -m "$commit_message"
            print_success "Changes committed"
        fi
    fi
    
    print_success "Component update workflow completed"
}

# Validate entire component library
validate_component_library() {
    print_status "Validating component library..."
    
    # Check component CLI
    if [ ! -f "codex.component.mts" ]; then
        print_error "Component CLI not found"
        return 1
    fi
    
    # List all components
    print_status "Discovering components..."
    local components=()
    for component_dir in client/src/components/*/; do
        if [ -d "$component_dir" ]; then
            component_name=$(basename "$component_dir")
            # Skip utility directories
            if [[ ! "$component_name" =~ ^(ui|layout|shared)$ ]]; then
                components+=("$component_name")
            fi
        fi
    done
    
    print_success "Found ${#components[@]} components: ${components[*]}"
    
    # Validate each component
    local validation_errors=0
    for component in "${components[@]}"; do
        print_component "Validating: $component"
        if ! validate_single_component "$component"; then
            validation_errors=$((validation_errors + 1))
        fi
    done
    
    # Run TypeScript validation
    print_status "Running TypeScript validation..."
    if npx tsc --noEmit --project tsconfig.json; then
        print_success "TypeScript validation passed"
    else
        print_error "TypeScript validation failed"
        validation_errors=$((validation_errors + 1))
    fi
    
    # Run component tests
    if [ "$SKIP_TESTS" = false ]; then
        print_status "Running component tests..."
        if npm test -- --passWithNoTests --testPathPattern=components; then
            print_success "Component tests passed"
        else
            print_error "Component tests failed"
            validation_errors=$((validation_errors + 1))
        fi
    fi
    
    # Test Storybook build
    print_status "Testing Storybook build..."
    if npm run build-storybook; then
        print_success "Storybook build successful"
    else
        print_error "Storybook build failed"
        validation_errors=$((validation_errors + 1))
    fi
    
    # Summary
    if [ $validation_errors -eq 0 ]; then
        print_success "All component library validations passed!"
        return 0
    else
        print_error "Found $validation_errors validation errors"
        return 1
    fi
}

# Validate single component
validate_single_component() {
    local component_name=$1
    local component_dir="client/src/components/$component_name"
    local errors=0
    
    # Check main component file
    if [ -f "${component_dir}/${component_name}.tsx" ]; then
        print_success "✓ Component file found"
    elif [ -f "${component_dir}/index.tsx" ]; then
        print_success "✓ Index component file found"
    else
        print_error "✗ Missing main component file"
        errors=$((errors + 1))
    fi
    
    # Check story file
    if [ -f "${component_dir}/${component_name}.stories.tsx" ]; then
        print_success "✓ Story file found"
    else
        print_warning "⚠ Missing story file"
    fi
    
    # Check test file
    if [ -f "${component_dir}/${component_name}.test.tsx" ]; then
        print_success "✓ Test file found"
    else
        print_warning "⚠ Missing test file"
    fi
    
    # Check demo file
    if [ -f "${component_dir}/${component_name}Demo.tsx" ]; then
        print_success "✓ Demo file found"
    else
        print_warning "⚠ Missing demo file"
    fi
    
    return $errors
}

# Publish component library
publish_component_library() {
    print_status "Publishing component library..."
    
    # Ensure we're on main branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        print_error "Must be on main branch to publish"
        return 1
    fi
    
    # Ensure working directory is clean
    if ! git diff-index --quiet HEAD --; then
        print_error "Working directory must be clean to publish"
        return 1
    fi
    
    # Validate library first
    print_status "Pre-publish validation..."
    if ! validate_component_library; then
        print_error "Validation failed. Cannot publish."
        return 1
    fi
    
    # Build Storybook
    print_status "Building Storybook..."
    npm run build-storybook
    
    # Create library package structure
    print_status "Creating library package..."
    rm -rf dist/library
    mkdir -p dist/library
    
    # Copy components
    cp -r client/src/components/* dist/library/
    cp -r client/src/lib dist/library/
    cp -r client/src/hooks dist/library/
    
    # Create package.json
    local version=$(date +"%Y.%m.%d")
    cat > dist/library/package.json << EOF
{
  "name": "@afripay/component-library",
  "version": "$version",
  "description": "AfriPay React Component Library - Pan-African Fintech UI Components",
  "main": "index.js",
  "types": "index.d.ts",
  "files": ["**/*"],
  "keywords": ["react", "components", "afripay", "fintech", "ui", "africa"],
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/afripay/afripay-app.git"
  },
  "license": "MIT"
}
EOF
    
    # Build TypeScript declarations
    print_status "Building TypeScript declarations..."
    npx tsc --declaration --emitDeclarationOnly --outDir dist/library
    
    # Create documentation
    create_library_documentation
    
    print_success "Library package created in dist/library/"
    print_status "Ready for npm publish or GitHub release"
}

# Sync component library with latest changes
sync_component_library() {
    print_status "Syncing component library..."
    
    # Pull latest changes from main
    git fetch origin
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" != "main" ]; then
        print_status "Switching to main branch..."
        git checkout main
    fi
    
    git pull origin main
    
    # Update component dependencies
    print_status "Updating dependencies..."
    npm install
    
    # Rebuild components
    print_status "Rebuilding component library..."
    npm run build
    
    # Update Storybook
    print_status "Updating Storybook..."
    npm run build-storybook
    
    print_success "Component library synced successfully"
}

# Create default story content
create_default_story() {
    local component_name=$1
    local story_file="client/src/components/$component_name/$component_name.stories.tsx"
    
    if [ -f "$story_file" ]; then
        return 0
    fi
    
    cat > "$story_file" << EOF
import type { Meta, StoryObj } from '@storybook/react';
import { $component_name } from './$component_name';

const meta: Meta<typeof $component_name> = {
  title: 'Components/$component_name',
  component: $component_name,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable $component_name component for AfriPay applications.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Add component prop controls here
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  }
};

export const Interactive: Story = {
  args: {
    // Add interactive example props
  }
};

export const Accessibility: Story = {
  args: {
    // Add accessibility-focused example
  },
  parameters: {
    docs: {
      description: {
        story: 'This example demonstrates the accessibility features of the $component_name component.'
      }
    }
  }
};
EOF
    
    print_success "Created default story for $component_name"
}

# Create default test content
create_default_test() {
    local component_name=$1
    local test_file="client/src/components/$component_name/$component_name.test.tsx"
    
    if [ -f "$test_file" ]; then
        return 0
    fi
    
    cat > "$test_file" << EOF
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { $component_name } from './$component_name';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('$component_name', () => {
  it('renders without crashing', () => {
    render(<$component_name />);
    // Add basic rendering test
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<$component_name />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles interactions correctly', () => {
    render(<$component_name />);
    // Add interaction tests
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<$component_name className={customClass} />);
    // Add className test
  });
});
EOF
    
    print_success "Created default test for $component_name"
}

# Create library documentation
create_library_documentation() {
    cat > dist/library/README.md << 'EOF'
# AfriPay Component Library

A comprehensive React component library for African fintech applications, built with accessibility, multilingual support, and mobile-first design principles.

## 🚀 Features

- **103+ Components**: Comprehensive UI component collection
- **WCAG AAA Compliance**: Full accessibility support
- **Multilingual**: English, French, Arabic, Swahili
- **Mobile-First**: Responsive design for all devices
- **TypeScript**: Full type safety and IntelliSense
- **Storybook**: Interactive component documentation
- **Testing**: Comprehensive test coverage
- **African Fintech Focus**: Optimized for African markets

## 📦 Installation

```bash
npm install @afripay/component-library
```

## 🎯 Quick Start

```tsx
import { Button, Card, WalletCard } from '@afripay/component-library';

function App() {
  return (
    <Card>
      <WalletCard 
        balance="1,234.56"
        currency="USD"
        type="primary"
      />
      <Button variant="primary">
        Send Money
      </Button>
    </Card>
  );
}
```

## 📚 Component Categories

### 🔘 Core UI Components
- Buttons (Primary, Secondary, Ghost, Outline)
- Cards (Standard, Interactive, Payment)
- Modals (Standard, Confirmation, Payment)
- Forms (Input, Select, Checkbox, Radio)

### 💰 Financial Components
- WalletCard, TransactionItem, PaymentForm
- CurrencyDisplay, BalanceCard, QRCode
- LoanApplication, InvestmentCard

### 📊 Data & Analytics
- Charts, Metrics, KPICard, ProgressBar
- DataTable, StatCard, TrendIndicator

### 🎯 Navigation & Layout
- Header, Sidebar, Tabs, Breadcrumbs
- Pagination, SearchBar, LanguageSelector

### 🌍 Accessibility & Internationalization
- All components WCAG AAA compliant
- RTL text direction support
- Cultural accessibility features
- Voice guidance ready

## 🔧 Development

This library is part of the AfriPay ecosystem and follows enterprise-grade development practices:

- **Automated Testing**: Unit, integration, accessibility tests
- **Visual Regression**: Automated screenshot testing
- **Component CLI**: Automated component generation
- **Git Pipeline**: Automated publishing and validation

## 📖 Documentation

Visit our [Storybook](https://afripay-storybook.netlify.app) for:
- Interactive component examples
- API documentation
- Accessibility guidelines
- Usage patterns

## 🤝 Contributing

1. Create component branch: `git checkout -b feature/component-new-component`
2. Use component CLI: `npm run component:add NewComponent`
3. Implement component with tests and stories
4. Push branch to trigger validation pipeline
5. Create pull request for review

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ for African fintech innovation.
EOF
}

# Show help information
show_help() {
    echo "AfriPay Component Library Pipeline Management"
    echo ""
    echo "Usage: $0 ACTION [OPTIONS]"
    echo ""
    echo "Actions:"
    echo "  create              Create new component with Git workflow"
    echo "  update              Update existing component"
    echo "  validate            Validate entire component library"
    echo "  publish             Publish component library package"
    echo "  sync                Sync library with latest changes"
    echo ""
    echo "Options:"
    echo "  -c, --component NAME    Component name to work with"
    echo "  --auto-push             Automatically push branch to origin"
    echo "  --skip-tests            Skip running tests"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 create --component PaymentButton --auto-push"
    echo "  $0 update --component WalletCard"
    echo "  $0 validate"
    echo "  $0 publish"
    echo "  $0 sync"
}

# Script execution starts here
main "$@"