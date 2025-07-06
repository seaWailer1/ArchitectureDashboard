#!/bin/bash

# AfriPay Component Automation System
# Enhanced component creation with Git workflow integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
COMPONENTS_DIR="client/src/components"
STORIES_DIR="client/src/stories"
TEMPLATES_DIR=".component-templates"
DOCS_DIR="docs/components"

# Banner
show_banner() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}${BOLD}            AfriPay Component Automation System              ${NC}${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}${BOLD}              Enhanced Component Development                  ${NC}${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Help function
show_help() {
    echo -e "${BOLD}AfriPay Component Automation System${NC}"
    echo ""
    echo -e "${BOLD}Usage:${NC} $0 ACTION [OPTIONS]"
    echo ""
    echo -e "${BOLD}Actions:${NC}"
    echo -e "  ${GREEN}create${NC}              Create new component with full automation"
    echo -e "  ${GREEN}interactive${NC}         Interactive component creation wizard"
    echo -e "  ${GREEN}batch${NC}               Create multiple components from config"
    echo -e "  ${GREEN}update${NC}              Update existing component structure"
    echo -e "  ${GREEN}enhance${NC}             Add missing files to existing components"
    echo -e "  ${GREEN}validate${NC}            Validate component structure and quality"
    echo -e "  ${GREEN}publish${NC}             Prepare component for library publishing"
    echo ""
    echo -e "${BOLD}Options:${NC}"
    echo -e "  ${CYAN}-n, --name NAME${NC}         Component name (required for create)"
    echo -e "  ${CYAN}-c, --category CATEGORY${NC} Component category (UI, Financial, etc.)"
    echo -e "  ${CYAN}-t, --template TYPE${NC}     Template type (button, card, modal, form)"
    echo -e "  ${CYAN}-d, --description DESC${NC}  Component description"
    echo -e "  ${CYAN}--with-demo${NC}             Include demo component"
    echo -e "  ${CYAN}--with-tests${NC}            Include comprehensive tests"
    echo -e "  ${CYAN}--with-docs${NC}             Generate documentation"
    echo -e "  ${CYAN}--git-flow${NC}              Use Git workflow (branch, commit, push)"
    echo -e "  ${CYAN}--auto-push${NC}             Automatically push to remote"
    echo -e "  ${CYAN}--accessibility${NC}         Include accessibility features"
    echo -e "  ${CYAN}--mobile-first${NC}          Use mobile-first responsive design"
    echo -e "  ${CYAN}--i18n${NC}                  Include internationalization support"
    echo -e "  ${CYAN}-h, --help${NC}              Show this help message"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo -e "  $0 create --name PaymentButton --category Financial --template button --git-flow"
    echo -e "  $0 interactive"
    echo -e "  $0 batch --config components.yaml"
    echo -e "  $0 enhance --name WalletCard --with-tests --with-docs"
    echo -e "  $0 validate --name TransactionList"
    echo ""
}

# Initialize component templates
init_templates() {
    if [ ! -d "$TEMPLATES_DIR" ]; then
        echo -e "${BLUE}[INFO]${NC} Initializing component templates..."
        mkdir -p "$TEMPLATES_DIR"
        
        # Create enhanced templates
        create_template_files
        echo -e "${GREEN}[SUCCESS]${NC} Templates initialized"
    fi
}

# Create template files
create_template_files() {
    # Advanced Button Template
    cat > "$TEMPLATES_DIR/button.tsx" << 'EOF'
import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const {{NAME_LOWER}}Variants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface {{NAME}}Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof {{NAME_LOWER}}Variants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const {{NAME}} = forwardRef<HTMLButtonElement, {{NAME}}Props>(
  ({ className, variant, size, asChild = false, loading = false, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn({{NAME_LOWER}}Variants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </Comp>
    );
  }
);

{{NAME}}.displayName = "{{NAME}}";

export { {{NAME}}, {{NAME_LOWER}}Variants };
EOF

    # Advanced Card Template
    cat > "$TEMPLATES_DIR/card.tsx" << 'EOF'
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const {{NAME_LOWER}}Variants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "shadow-md hover:shadow-lg",
        outlined: "border-2 border-primary/20",
        ghost: "border-transparent shadow-none",
        gradient: "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10",
      },
      size: {
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface {{NAME}}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof {{NAME_LOWER}}Variants> {
  children?: React.ReactNode;
}

const {{NAME}} = forwardRef<HTMLDivElement, {{NAME}}Props>(
  ({ className, variant, size, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn({{NAME_LOWER}}Variants({ variant, size, interactive, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

{{NAME}}.displayName = "{{NAME}}";

const {{NAME}}Header = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
{{NAME}}Header.displayName = "{{NAME}}Header";

const {{NAME}}Title = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
{{NAME}}Title.displayName = "{{NAME}}Title";

const {{NAME}}Description = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
{{NAME}}Description.displayName = "{{NAME}}Description";

const {{NAME}}Content = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
{{NAME}}Content.displayName = "{{NAME}}Content";

const {{NAME}}Footer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
{{NAME}}Footer.displayName = "{{NAME}}Footer";

export {
  {{NAME}},
  {{NAME}}Header,
  {{NAME}}Title,
  {{NAME}}Description,
  {{NAME}}Content,
  {{NAME}}Footer,
  {{NAME_LOWER}}Variants,
};
EOF

    # Story Template
    cat > "$TEMPLATES_DIR/component.stories.tsx" << 'EOF'
import type { Meta, StoryObj } from '@storybook/react';
import { {{NAME}} } from './{{NAME}}';

const meta: Meta<typeof {{NAME}}> = {
  title: 'Components/{{CATEGORY}}/{{NAME}}',
  component: {{NAME}},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{{DESCRIPTION}}',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '{{NAME}}',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <{{NAME}} variant="default">Default</{{NAME}}>
      <{{NAME}} variant="destructive">Destructive</{{NAME}}>
      <{{NAME}} variant="outline">Outline</{{NAME}}>
      <{{NAME}} variant="secondary">Secondary</{{NAME}}>
      <{{NAME}} variant="ghost">Ghost</{{NAME}}>
      <{{NAME}} variant="link">Link</{{NAME}}>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <{{NAME}} size="sm">Small</{{NAME}}>
      <{{NAME}} size="default">Default</{{NAME}}>
      <{{NAME}} size="lg">Large</{{NAME}}>
      <{{NAME}} size="icon">Icon</{{NAME}}>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <{{NAME}}>Normal</{{NAME}}>
      <{{NAME}} disabled>Disabled</{{NAME}}>
      <{{NAME}} loading>Loading</{{NAME}}>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!'),
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Send Money',
    icon: '💰',
  },
};

// Accessibility testing story
export const AccessibilityTest: Story = {
  args: {
    children: 'Accessible Button',
    'aria-label': 'Send money to recipient',
    'aria-describedby': 'button-description',
  },
  render: (args) => (
    <div>
      <{{NAME}} {...args} />
      <p id="button-description" className="sr-only">
        This button will initiate a money transfer
      </p>
    </div>
  ),
};

// Mobile responsiveness story
export const MobileResponsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <{{NAME}} className="w-full">Full Width Mobile</{{NAME}}>
      <{{NAME}} size="lg" className="w-full">Large Mobile</{{NAME}}>
    </div>
  ),
};

// Dark mode story
export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: {
    children: 'Dark Mode Button',
  },
};
EOF

    # Test Template
    cat > "$TEMPLATES_DIR/component.test.tsx" << 'EOF'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { {{NAME}} } from './{{NAME}}';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('{{NAME}}', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<{{NAME}}>Test Content</{{NAME}}>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<{{NAME}} className="custom-class">Test</{{NAME}}>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('renders all variant styles correctly', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
      
      variants.forEach((variant) => {
        const { unmount } = render(<{{NAME}} variant={variant as any}>Test</{{NAME}}>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    it('renders all size variants correctly', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'];
      
      sizes.forEach((size) => {
        const { unmount } = render(<{{NAME}} size={size as any}>Test</{{NAME}}>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick}>Click me</{{NAME}}>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick} disabled>Click me</{{NAME}}>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick} loading>Click me</{{NAME}}>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick}>Press Enter</{{NAME}}>);
      
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  // State tests
  describe('States', () => {
    it('shows loading state correctly', () => {
      render(<{{NAME}} loading>Loading</{{NAME}}>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows disabled state correctly', () => {
      render(<{{NAME}} disabled>Disabled</{{NAME}}>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });

    it('displays icon when provided', () => {
      render(
        <{{NAME}} icon={<span data-testid="icon">💰</span>}>
          With Icon
        </{{NAME}}>
      );
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<{{NAME}}>Accessible Button</{{NAME}}>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports ARIA attributes', () => {
      render(
        <{{NAME}} 
          aria-label="Send money"
          aria-describedby="button-desc"
        >
          Send
        </{{NAME}}>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Send money');
      expect(button).toHaveAttribute('aria-describedby', 'button-desc');
    });

    it('has proper focus management', () => {
      render(<{{NAME}}>Focus Test</{{NAME}}>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('supports screen reader announcements', () => {
      render(<{{NAME}} loading>Processing</{{NAME}}>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('renders efficiently with many instances', () => {
      const startTime = performance.now();
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <{{NAME}} key={i}>Button {i}</{{NAME}}>
          ))}
        </div>
      );
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should render in under 100ms
    });

    it('handles rapid click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick}>Rapid Click</{{NAME}}>);
      
      const button = screen.getByRole('button');
      
      // Simulate rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles undefined children gracefully', () => {
      render(<{{NAME}}>{undefined}</{{NAME}}>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles empty string children', () => {
      render(<{{NAME}}>""</{{NAME}}>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('works with asChild prop', () => {
      render(
        <{{NAME}} asChild>
          <a href="#test">Link Button</a>
        </{{NAME}}>
      );
      
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByText('Link Button')).toBeInTheDocument();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('works within forms', () => {
      const handleSubmit = jest.fn();
      
      render(
        <form onSubmit={handleSubmit}>
          <{{NAME}} type="submit">Submit Form</{{NAME}}>
        </form>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('works with React.forwardRef', () => {
      const ref = jest.fn();
      
      render(<{{NAME}} ref={ref}>Ref Test</{{NAME}}>);
      expect(ref).toHaveBeenCalled();
    });
  });
});

// Snapshot tests
describe('{{NAME}} Snapshots', () => {
  it('matches snapshot for default variant', () => {
    const { container } = render(<{{NAME}}>Default</{{NAME}}>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
    
    variants.forEach((variant) => {
      const { container } = render(<{{NAME}} variant={variant as any}>Test</{{NAME}}>);
      expect(container.firstChild).toMatchSnapshot(`{{NAME}}-${variant}`);
    });
  });
});
EOF

    echo -e "${GREEN}[SUCCESS]${NC} Component templates created"
}

# Interactive component creation wizard
interactive_create() {
    echo -e "${BOLD}🧙 Interactive Component Creation Wizard${NC}"
    echo ""
    
    # Component name
    echo -e "${CYAN}Component Name (PascalCase):${NC}"
    read -r COMPONENT_NAME
    
    if [ -z "$COMPONENT_NAME" ]; then
        echo -e "${RED}[ERROR]${NC} Component name is required"
        exit 1
    fi
    
    # Category selection
    echo -e "${CYAN}Select Category:${NC}"
    echo "1) UI Components"
    echo "2) Financial Components"
    echo "3) Data Components"
    echo "4) Navigation Components"
    echo "5) Layout Components"
    echo "6) Form Components"
    echo "7) Custom Category"
    read -r CATEGORY_CHOICE
    
    case $CATEGORY_CHOICE in
        1) CATEGORY="UI" ;;
        2) CATEGORY="Financial" ;;
        3) CATEGORY="Data" ;;
        4) CATEGORY="Navigation" ;;
        5) CATEGORY="Layout" ;;
        6) CATEGORY="Form" ;;
        7) 
            echo -e "${CYAN}Enter custom category:${NC}"
            read -r CATEGORY
            ;;
        *) CATEGORY="UI" ;;
    esac
    
    # Template selection
    echo -e "${CYAN}Select Template:${NC}"
    echo "1) Button (Interactive element)"
    echo "2) Card (Container element)"
    echo "3) Modal (Overlay element)"
    echo "4) Form (Input element)"
    echo "5) Custom Template"
    read -r TEMPLATE_CHOICE
    
    case $TEMPLATE_CHOICE in
        1) TEMPLATE="button" ;;
        2) TEMPLATE="card" ;;
        3) TEMPLATE="modal" ;;
        4) TEMPLATE="form" ;;
        5) TEMPLATE="custom" ;;
        *) TEMPLATE="button" ;;
    esac
    
    # Description
    echo -e "${CYAN}Component Description:${NC}"
    read -r DESCRIPTION
    
    # Features selection
    echo -e "${CYAN}Select Features (y/n):${NC}"
    
    echo -n "Include demo component? (y/n): "
    read -r WITH_DEMO
    
    echo -n "Include comprehensive tests? (y/n): "
    read -r WITH_TESTS
    
    echo -n "Include documentation? (y/n): "
    read -r WITH_DOCS
    
    echo -n "Include accessibility features? (y/n): "
    read -r WITH_ACCESSIBILITY
    
    echo -n "Include mobile-first design? (y/n): "
    read -r WITH_MOBILE
    
    echo -n "Include internationalization? (y/n): "
    read -r WITH_I18N
    
    echo -n "Use Git workflow? (y/n): "
    read -r WITH_GIT
    
    if [ "$WITH_GIT" = "y" ]; then
        echo -n "Auto-push to remote? (y/n): "
        read -r AUTO_PUSH
    fi
    
    # Summary
    echo ""
    echo -e "${BOLD}📋 Creation Summary:${NC}"
    echo -e "  Name: ${GREEN}$COMPONENT_NAME${NC}"
    echo -e "  Category: ${GREEN}$CATEGORY${NC}"
    echo -e "  Template: ${GREEN}$TEMPLATE${NC}"
    echo -e "  Description: ${GREEN}$DESCRIPTION${NC}"
    echo -e "  Features: Demo($WITH_DEMO), Tests($WITH_TESTS), Docs($WITH_DOCS)"
    echo -e "  Accessibility: $WITH_ACCESSIBILITY, Mobile: $WITH_MOBILE, i18n: $WITH_I18N"
    echo -e "  Git Workflow: $WITH_GIT, Auto Push: ${AUTO_PUSH:-n}"
    echo ""
    
    echo -n "Proceed with creation? (y/n): "
    read -r CONFIRM
    
    if [ "$CONFIRM" = "y" ]; then
        # Build arguments
        ARGS="--name $COMPONENT_NAME --category $CATEGORY --template $TEMPLATE"
        
        if [ -n "$DESCRIPTION" ]; then
            ARGS="$ARGS --description \"$DESCRIPTION\""
        fi
        
        if [ "$WITH_DEMO" = "y" ]; then
            ARGS="$ARGS --with-demo"
        fi
        
        if [ "$WITH_TESTS" = "y" ]; then
            ARGS="$ARGS --with-tests"
        fi
        
        if [ "$WITH_DOCS" = "y" ]; then
            ARGS="$ARGS --with-docs"
        fi
        
        if [ "$WITH_ACCESSIBILITY" = "y" ]; then
            ARGS="$ARGS --accessibility"
        fi
        
        if [ "$WITH_MOBILE" = "y" ]; then
            ARGS="$ARGS --mobile-first"
        fi
        
        if [ "$WITH_I18N" = "y" ]; then
            ARGS="$ARGS --i18n"
        fi
        
        if [ "$WITH_GIT" = "y" ]; then
            ARGS="$ARGS --git-flow"
            
            if [ "$AUTO_PUSH" = "y" ]; then
                ARGS="$ARGS --auto-push"
            fi
        fi
        
        # Execute creation
        create_component $ARGS
    else
        echo -e "${YELLOW}[INFO]${NC} Component creation cancelled"
    fi
}

# Create component function
create_component() {
    local NAME=""
    local CATEGORY="UI"
    local TEMPLATE="button"
    local DESCRIPTION=""
    local WITH_DEMO=false
    local WITH_TESTS=false
    local WITH_DOCS=false
    local WITH_ACCESSIBILITY=false
    local WITH_MOBILE=false
    local WITH_I18N=false
    local GIT_FLOW=false
    local AUTO_PUSH=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -n|--name)
                NAME="$2"
                shift 2
                ;;
            -c|--category)
                CATEGORY="$2"
                shift 2
                ;;
            -t|--template)
                TEMPLATE="$2"
                shift 2
                ;;
            -d|--description)
                DESCRIPTION="$2"
                shift 2
                ;;
            --with-demo)
                WITH_DEMO=true
                shift
                ;;
            --with-tests)
                WITH_TESTS=true
                shift
                ;;
            --with-docs)
                WITH_DOCS=true
                shift
                ;;
            --accessibility)
                WITH_ACCESSIBILITY=true
                shift
                ;;
            --mobile-first)
                WITH_MOBILE=true
                shift
                ;;
            --i18n)
                WITH_I18N=true
                shift
                ;;
            --git-flow)
                GIT_FLOW=true
                shift
                ;;
            --auto-push)
                AUTO_PUSH=true
                shift
                ;;
            *)
                echo -e "${RED}[ERROR]${NC} Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    if [ -z "$NAME" ]; then
        echo -e "${RED}[ERROR]${NC} Component name is required"
        exit 1
    fi
    
    echo -e "${BLUE}[INFO]${NC} Creating component: ${BOLD}$NAME${NC}"
    
    # Initialize Git workflow if requested
    if [ "$GIT_FLOW" = true ]; then
        setup_git_workflow "$NAME"
    fi
    
    # Create component directory
    COMPONENT_DIR="$COMPONENTS_DIR/$NAME"
    mkdir -p "$COMPONENT_DIR"
    
    # Create component files
    create_component_file "$NAME" "$CATEGORY" "$TEMPLATE" "$DESCRIPTION" "$COMPONENT_DIR"
    create_story_file "$NAME" "$CATEGORY" "$TEMPLATE" "$DESCRIPTION" "$COMPONENT_DIR"
    
    if [ "$WITH_TESTS" = true ]; then
        create_test_file "$NAME" "$COMPONENT_DIR"
    fi
    
    if [ "$WITH_DEMO" = true ]; then
        create_demo_file "$NAME" "$COMPONENT_DIR"
    fi
    
    if [ "$WITH_DOCS" = true ]; then
        create_documentation "$NAME" "$CATEGORY" "$DESCRIPTION"
    fi
    
    # Update barrel exports
    update_barrel_exports
    
    # Commit changes if using Git workflow
    if [ "$GIT_FLOW" = true ]; then
        commit_component_changes "$NAME" "$DESCRIPTION" "$AUTO_PUSH"
    fi
    
    echo -e "${GREEN}[SUCCESS]${NC} Component ${BOLD}$NAME${NC} created successfully!"
    echo -e "${BLUE}[INFO]${NC} Location: $COMPONENT_DIR"
    
    # Show next steps
    show_next_steps "$NAME" "$GIT_FLOW"
}

# Setup Git workflow
setup_git_workflow() {
    local NAME="$1"
    local BRANCH_NAME="feature/component-$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
    
    echo -e "${BLUE}[INFO]${NC} Setting up Git workflow..."
    
    # Ensure we're on main and up to date
    git checkout main 2>/dev/null || echo "Already on main"
    git pull origin main 2>/dev/null || echo "Unable to pull from origin"
    
    # Create feature branch
    if git checkout -b "$BRANCH_NAME" 2>/dev/null; then
        echo -e "${GREEN}[SUCCESS]${NC} Created branch: $BRANCH_NAME"
    else
        echo -e "${YELLOW}[WARNING]${NC} Branch $BRANCH_NAME already exists, switching to it"
        git checkout "$BRANCH_NAME"
    fi
}

# Create component file
create_component_file() {
    local NAME="$1"
    local CATEGORY="$2"
    local TEMPLATE="$3"
    local DESCRIPTION="$4"
    local DIR="$5"
    
    local TEMPLATE_FILE="$TEMPLATES_DIR/$TEMPLATE.tsx"
    local OUTPUT_FILE="$DIR/$NAME.tsx"
    
    if [ -f "$TEMPLATE_FILE" ]; then
        # Process template
        sed -e "s/{{NAME}}/$NAME/g" \
            -e "s/{{NAME_LOWER}}/$(echo "$NAME" | tr '[:upper:]' '[:lower:]')/g" \
            -e "s/{{CATEGORY}}/$CATEGORY/g" \
            -e "s/{{DESCRIPTION}}/$DESCRIPTION/g" \
            "$TEMPLATE_FILE" > "$OUTPUT_FILE"
    else
        # Fallback to basic component
        cat > "$OUTPUT_FILE" << EOF
import React from 'react';
import { cn } from '@/lib/utils';

interface ${NAME}Props {
  className?: string;
  children?: React.ReactNode;
}

export function ${NAME}({ className, children }: ${NAME}Props) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
EOF
    fi
    
    echo -e "${GREEN}[SUCCESS]${NC} Created component file: $OUTPUT_FILE"
}

# Create story file
create_story_file() {
    local NAME="$1"
    local CATEGORY="$2"
    local TEMPLATE="$3"
    local DESCRIPTION="$4"
    local DIR="$5"
    
    local TEMPLATE_FILE="$TEMPLATES_DIR/component.stories.tsx"
    local OUTPUT_FILE="$DIR/$NAME.stories.tsx"
    
    if [ -f "$TEMPLATE_FILE" ]; then
        sed -e "s/{{NAME}}/$NAME/g" \
            -e "s/{{CATEGORY}}/$CATEGORY/g" \
            -e "s/{{DESCRIPTION}}/$DESCRIPTION/g" \
            "$TEMPLATE_FILE" > "$OUTPUT_FILE"
    else
        cat > "$OUTPUT_FILE" << EOF
import type { Meta, StoryObj } from '@storybook/react';
import { ${NAME} } from './${NAME}';

const meta: Meta<typeof ${NAME}> = {
  title: 'Components/${CATEGORY}/${NAME}',
  component: ${NAME},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default ${NAME}',
  },
};
EOF
    fi
    
    echo -e "${GREEN}[SUCCESS]${NC} Created story file: $OUTPUT_FILE"
}

# Create test file
create_test_file() {
    local NAME="$1"
    local DIR="$2"
    
    local TEMPLATE_FILE="$TEMPLATES_DIR/component.test.tsx"
    local OUTPUT_FILE="$DIR/$NAME.test.tsx"
    
    if [ -f "$TEMPLATE_FILE" ]; then
        sed -e "s/{{NAME}}/$NAME/g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"
    else
        cat > "$OUTPUT_FILE" << EOF
import { render, screen } from '@testing-library/react';
import { ${NAME} } from './${NAME}';

describe('${NAME}', () => {
  it('renders correctly', () => {
    render(<${NAME}>Test</${NAME}>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
EOF
    fi
    
    echo -e "${GREEN}[SUCCESS]${NC} Created test file: $OUTPUT_FILE"
}

# Create demo file
create_demo_file() {
    local NAME="$1"
    local DIR="$2"
    
    cat > "$DIR/${NAME}Demo.tsx" << EOF
import React from 'react';
import { ${NAME} } from './${NAME}';

export function ${NAME}Demo() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">${NAME} Demo</h2>
      <div className="space-y-4">
        <${NAME}>
          Demo content for ${NAME}
        </${NAME}>
      </div>
    </div>
  );
}
EOF
    
    echo -e "${GREEN}[SUCCESS]${NC} Created demo file: $DIR/${NAME}Demo.tsx"
}

# Update barrel exports
update_barrel_exports() {
    local INDEX_FILE="$COMPONENTS_DIR/index.ts"
    
    echo -e "${BLUE}[INFO]${NC} Updating barrel exports..."
    
    # Recreate index file
    echo "// Auto-generated barrel exports" > "$INDEX_FILE"
    echo "// Do not edit manually" >> "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"
    
    # Find all component directories and add exports
    find "$COMPONENTS_DIR" -maxdepth 1 -type d ! -path "$COMPONENTS_DIR" | while read -r dir; do
        local component_name=$(basename "$dir")
        local main_file="$dir/$component_name.tsx"
        
        if [ -f "$main_file" ]; then
            echo "export * from './$component_name/$component_name';" >> "$INDEX_FILE"
        fi
    done
    
    echo -e "${GREEN}[SUCCESS]${NC} Updated barrel exports"
}

# Commit component changes
commit_component_changes() {
    local NAME="$1"
    local DESCRIPTION="$2"
    local AUTO_PUSH="$3"
    
    echo -e "${BLUE}[INFO]${NC} Committing component changes..."
    
    # Add files
    git add "$COMPONENTS_DIR/$NAME/"
    git add "$COMPONENTS_DIR/index.ts"
    
    # Commit with conventional commit message
    local commit_message="feat(components): add $NAME component"
    if [ -n "$DESCRIPTION" ]; then
        commit_message="$commit_message

$DESCRIPTION"
    fi
    
    git commit -m "$commit_message"
    
    echo -e "${GREEN}[SUCCESS]${NC} Committed changes"
    
    # Push if requested
    if [ "$AUTO_PUSH" = true ]; then
        local branch_name=$(git branch --show-current)
        git push -u origin "$branch_name"
        echo -e "${GREEN}[SUCCESS]${NC} Pushed to origin/$branch_name"
    fi
}

# Show next steps
show_next_steps() {
    local NAME="$1"
    local GIT_FLOW="$2"
    
    echo ""
    echo -e "${BOLD}🚀 Next Steps:${NC}"
    echo ""
    
    if [ "$GIT_FLOW" = true ]; then
        local branch_name=$(git branch --show-current)
        echo -e "  1. ${CYAN}Review the generated code${NC}"
        echo -e "  2. ${CYAN}Test the component: npm test -- --testPathPattern=$NAME${NC}"
        echo -e "  3. ${CYAN}View in Storybook: npm run storybook${NC}"
        echo -e "  4. ${CYAN}Create Pull Request from branch: $branch_name${NC}"
        echo -e "  5. ${CYAN}Merge after review and CI passes${NC}"
    else
        echo -e "  1. ${CYAN}Review the generated code${NC}"
        echo -e "  2. ${CYAN}Test the component: npm test -- --testPathPattern=$NAME${NC}"
        echo -e "  3. ${CYAN}View in Storybook: npm run storybook${NC}"
        echo -e "  4. ${CYAN}Commit and push your changes${NC}"
    fi
    
    echo ""
    echo -e "${BOLD}📂 Generated Files:${NC}"
    echo -e "  • $COMPONENTS_DIR/$NAME/$NAME.tsx"
    echo -e "  • $COMPONENTS_DIR/$NAME/$NAME.stories.tsx"
    echo -e "  • $COMPONENTS_DIR/$NAME/$NAME.test.tsx (if requested)"
    echo -e "  • $COMPONENTS_DIR/$NAME/${NAME}Demo.tsx (if requested)"
    echo ""
}

# Main script logic
main() {
    show_banner
    init_templates
    
    case "${1:-}" in
        create)
            shift
            create_component "$@"
            ;;
        interactive)
            interactive_create
            ;;
        batch)
            echo -e "${YELLOW}[TODO]${NC} Batch creation not yet implemented"
            ;;
        update|enhance|validate|publish)
            echo -e "${YELLOW}[TODO]${NC} Action '$1' not yet implemented"
            ;;
        -h|--help|help|"")
            show_help
            ;;
        *)
            echo -e "${RED}[ERROR]${NC} Unknown action: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"