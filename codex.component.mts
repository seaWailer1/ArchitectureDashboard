#!/usr/bin/env tsx
/**
 * AfriPay Component Management CLI
 * Enhanced with automation and Git workflow integration
 * 
 * Usage:
 *   tsx codex.component.mts add PaymentButton --template button --git-flow
 *   tsx codex.component.mts remove Forms/Input
 *   tsx codex.component.mts rename Forms/Input Forms/TextField
 *   tsx codex.component.mts list
 *   tsx codex.component.mts interactive
 *   tsx codex.component.mts validate
 */

import { promises as fs } from 'fs';
import { join, dirname, basename } from 'path';

// Component templates
const TEMPLATES = {
  box: {
    component: `import React from 'react';
import { cn } from '@/lib/utils';

interface {{NAME}}Props {
  className?: string;
  children?: React.ReactNode;
}

export function {{NAME}}({ className, children }: {{NAME}}Props) {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      {children}
    </div>
  );
}`,
    story: `import type { Meta, StoryObj } from '@storybook/react';
import { {{NAME}} } from './{{NAME}}';

const meta: Meta<typeof {{NAME}}> = {
  title: 'Components/{{CATEGORY}}/{{NAME}}',
  component: {{NAME}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Box content here',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Styled box content',
    className: 'bg-primary text-primary-foreground',
  },
};`
  },
  
  button: {
    component: `import React from 'react';
import { cn } from '@/lib/utils';

interface {{NAME}}Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function {{NAME}}({ 
  variant = 'default', 
  size = 'default', 
  className, 
  children, 
  onClick,
  disabled = false
}: {{NAME}}Props) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}`,
    story: `import type { Meta, StoryObj } from '@storybook/react';
import { {{NAME}} } from './{{NAME}}';

const meta: Meta<typeof {{NAME}}> = {
  title: 'Components/{{CATEGORY}}/{{NAME}}',
  component: {{NAME}},
  parameters: {
    layout: 'centered',
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
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};`
  },
  
  input: {
    component: `import React from 'react';
import { cn } from '@/lib/utils';

interface {{NAME}}Props {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function {{NAME}}({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className, 
  disabled = false,
  required = false
}: {{NAME}}Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}`,
    story: `import type { Meta, StoryObj } from '@storybook/react';
import { {{NAME}} } from './{{NAME}}';

const meta: Meta<typeof {{NAME}}> = {
  title: 'Components/{{CATEGORY}}/{{NAME}}',
  component: {{NAME}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};`
  },
  
  modal: {
    component: `import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface {{NAME}}Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function {{NAME}}({ isOpen, onClose, title, children, className }: {{NAME}}Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn(
        "relative bg-background border rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-auto",
        className
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}`,
    story: `import type { Meta, StoryObj } from '@storybook/react';
import { {{NAME}} } from './{{NAME}}';
import { useState } from 'react';

const meta: Meta<typeof {{NAME}}> = {
  title: 'Components/{{CATEGORY}}/{{NAME}}',
  component: {{NAME}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Open Modal
        </button>
        <{{NAME}}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Example Modal"
        >
          <p>This is the modal content.</p>
        </{{NAME}}>
      </div>
    );
  },
};`
  }
};

const COMPONENTS_DIR = 'client/src/components';
const STORYBOOK_CONFIG_DIR = '.storybook';

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function writeFile(filePath: string, content: string) {
  await ensureDir(dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

function toPascalCase(str: string): string {
  return str.replace(/(?:^|[-_])([a-z])/g, (_, char) => char.toUpperCase());
}

function getComponentPath(componentPath: string): { dir: string, name: string, category: string } {
  const parts = componentPath.split('/');
  const name = toPascalCase(parts.pop() || '');
  const category = parts.length > 0 ? parts.join('/') : 'General';
  const dir = join(COMPONENTS_DIR, ...parts);
  
  return { dir, name, category };
}

async function addComponent(componentPath: string, template: string = 'box') {
  if (!TEMPLATES[template as keyof typeof TEMPLATES]) {
    console.error(`❌ Template "${template}" not found. Available: ${Object.keys(TEMPLATES).join(', ')}`);
    process.exit(1);
  }

  const { dir, name, category } = getComponentPath(componentPath);
  const templateData = TEMPLATES[template as keyof typeof TEMPLATES];

  // Create component file
  const componentContent = templateData.component
    .replace(/\{\{NAME\}\}/g, name)
    .replace(/\{\{CATEGORY\}\}/g, category);
  
  await writeFile(join(dir, `${name}.tsx`), componentContent);
  console.log(`✅ Created component: ${join(dir, `${name}.tsx`)}`);

  // Create story file
  const storyContent = templateData.story
    .replace(/\{\{NAME\}\}/g, name)
    .replace(/\{\{CATEGORY\}\}/g, category);
  
  await writeFile(join(dir, `${name}.stories.tsx`), storyContent);
  console.log(`✅ Created story: ${join(dir, `${name}.stories.tsx`)}`);

  // Create test file
  const testContent = `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
  });
});`;

  await writeFile(join(dir, `${name}.test.tsx`), testContent);
  console.log(`✅ Created test: ${join(dir, `${name}.test.tsx`)}`);

  // Create demo file
  const demoContent = `import React from 'react';
import { ${name} } from './${name}';

export function ${name}Demo() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">${name} Demo</h2>
      <${name} />
    </div>
  );
}`;

  await writeFile(join(dir, `${name}Demo.tsx`), demoContent);
  console.log(`✅ Created demo: ${join(dir, `${name}Demo.tsx`)}`);

  // Create/update index file
  const indexContent = `export { ${name} } from './${name}';
export { ${name}Demo } from './${name}Demo';`;

  await writeFile(join(dir, 'index.ts'), indexContent);
  console.log(`✅ Created/updated index: ${join(dir, 'index.ts')}`);

  // Update main components index
  await updateMainIndex();
}

async function removeComponent(componentPath: string) {
  const { dir, name } = getComponentPath(componentPath);
  
  try {
    // Remove all related files
    const files = [`${name}.tsx`, `${name}.stories.tsx`, `${name}.test.tsx`, `${name}Demo.tsx`];
    
    for (const file of files) {
      try {
        await fs.unlink(join(dir, file));
        console.log(`✅ Removed: ${join(dir, file)}`);
      } catch (error) {
        console.log(`⚠️  File not found: ${join(dir, file)}`);
      }
    }

    // Remove index if directory is empty
    try {
      const remaining = await fs.readdir(dir);
      if (remaining.length <= 1 && remaining.includes('index.ts')) {
        await fs.unlink(join(dir, 'index.ts'));
        await fs.rmdir(dir);
        console.log(`✅ Removed empty directory: ${dir}`);
      }
    } catch (error) {
      // Directory might not be empty or might not exist
    }

    // Update main components index
    await updateMainIndex();
  } catch (error) {
    console.error(`❌ Error removing component: ${error}`);
    process.exit(1);
  }
}

async function renameComponent(oldPath: string, newPath: string) {
  console.log(`🔄 Renaming ${oldPath} to ${newPath}...`);
  
  // For simplicity, we'll remove old and add new
  // In a real scenario, you might want to preserve git history
  const oldComponent = getComponentPath(oldPath);
  
  // Check if old component exists
  try {
    await fs.access(join(oldComponent.dir, `${oldComponent.name}.tsx`));
  } catch (error) {
    console.error(`❌ Component ${oldPath} not found`);
    process.exit(1);
  }

  // Read old component to detect template type
  const oldContent = await fs.readFile(join(oldComponent.dir, `${oldComponent.name}.tsx`), 'utf-8');
  let template = 'box'; // default
  
  if (oldContent.includes('onClick') && oldContent.includes('button')) template = 'button';
  else if (oldContent.includes('input')) template = 'input';
  else if (oldContent.includes('modal') || oldContent.includes('isOpen')) template = 'modal';

  await removeComponent(oldPath);
  await addComponent(newPath, template);
  
  console.log(`✅ Successfully renamed ${oldPath} to ${newPath}`);
}

async function listComponents() {
  console.log('📋 AfriPay Components:');
  console.log('');
  
  try {
    const categories = await fs.readdir(COMPONENTS_DIR);
    
    for (const category of categories.sort()) {
      const categoryPath = join(COMPONENTS_DIR, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        console.log(`📁 ${category}/`);
        
        try {
          const files = await fs.readdir(categoryPath);
          const components = files
            .filter(file => file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.') && !file.includes('Demo.'))
            .map(file => file.replace('.tsx', ''))
            .sort();
          
          for (const component of components) {
            console.log(`   └── ${component}`);
          }
          
          if (components.length === 0) {
            console.log(`   └── (empty)`);
          }
        } catch (error) {
          console.log(`   └── (error reading directory)`);
        }
        
        console.log('');
      }
    }
  } catch (error) {
    console.error(`❌ Error listing components: ${error}`);
    process.exit(1);
  }
}

async function updateMainIndex() {
  try {
    const categories = await fs.readdir(COMPONENTS_DIR);
    const exports: string[] = [];
    
    for (const category of categories.sort()) {
      const categoryPath = join(COMPONENTS_DIR, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        const indexPath = join(categoryPath, 'index.ts');
        try {
          await fs.access(indexPath);
          exports.push(`export * from './${category}';`);
        } catch (error) {
          // No index file, skip
        }
      }
    }
    
    const indexContent = `// Auto-generated component exports
${exports.join('\n')}
`;
    
    await writeFile(join(COMPONENTS_DIR, 'index.ts'), indexContent);
    console.log(`✅ Updated main components index`);
  } catch (error) {
    console.error(`❌ Error updating main index: ${error}`);
  }
}

async function setupStorybook() {
  console.log('📚 Setting up Storybook integration...');
  
  // Create storybook config if it doesn't exist
  const mainConfig = `import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../client/src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;`;

  await writeFile(join(STORYBOOK_CONFIG_DIR, 'main.ts'), mainConfig);
  console.log(`✅ Created Storybook main config`);

  const previewConfig = `import type { Preview } from '@storybook/react';
import '../client/src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
      ],
    },
  },
};

export default preview;`;

  await writeFile(join(STORYBOOK_CONFIG_DIR, 'preview.ts'), previewConfig);
  console.log(`✅ Created Storybook preview config`);

  // Create component library access point
  const libraryPage = `import React from 'react';

export function ComponentLibrary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary">AfriPay Component Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of reusable React components built with 
            TypeScript, TailwindCSS, and WCAG AAA accessibility standards.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mt-12">
            <a
              href="/storybook"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
            >
              <div className="text-2xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Storybook</h3>
              <p className="text-muted-foreground">
                Browse and interact with all components in an isolated environment
              </p>
            </a>
            
            <a
              href="https://github.com/your-repo/tree/main/client/src/components"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
            >
              <div className="text-2xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2">Source Code</h3>
              <p className="text-muted-foreground">
                View the complete source code and documentation on GitHub
              </p>
            </a>
            
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border">
              <div className="text-2xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Design System</h3>
              <p className="text-muted-foreground">
                Built with consistent theming, accessibility, and mobile-first design
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="bg-neutral-900 dark:bg-neutral-800 text-neutral-100 p-4 rounded text-sm font-mono">
                # Add a new component<br/>
                bun codex.component.mts add Forms/Input input<br/><br/>
                # Remove a component<br/>
                bun codex.component.mts remove Forms/Input<br/><br/>
                # List all components<br/>
                bun codex.component.mts list
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  await writeFile('client/src/pages/component-library.tsx', libraryPage);
  console.log(`✅ Created component library access page`);

  console.log(`
📚 Storybook setup complete!

To run Storybook:
  npx storybook dev -p 6006

To access the component library:
  Add route to your app for /component-library
  
Templates available: ${Object.keys(TEMPLATES).join(', ')}
`);
}

// Enhanced automation functions
async function interactiveCreate() {
  console.log('🧙 Interactive Component Creation Wizard');
  console.log('Delegating to enhanced automation system...');
  
  // Use the enhanced automation script
  const { spawn } = await import('child_process');
  const child = spawn('./scripts/component-automation.sh', ['interactive'], {
    stdio: 'inherit',
    shell: true
  });
  
  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`Interactive creation failed with code ${code}`));
      }
    });
  });
}

async function validateComponents() {
  console.log('🔍 Validating component library...');
  
  // Use the pipeline validation system
  const { spawn } = await import('child_process');
  const child = spawn('./scripts/component-library-pipeline.sh', ['validate'], {
    stdio: 'inherit',
    shell: true
  });
  
  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`Validation failed with code ${code}`));
      }
    });
  });
}

async function createWithAutomation(componentName: string, options: any = {}) {
  console.log(`🚀 Creating component with automation: ${componentName}`);
  
  const args = ['create', '--name', componentName];
  
  if (options.category) args.push('--category', options.category);
  if (options.template) args.push('--template', options.template);
  if (options.description) args.push('--description', options.description);
  if (options.withDemo) args.push('--with-demo');
  if (options.withTests) args.push('--with-tests');
  if (options.withDocs) args.push('--with-docs');
  if (options.accessibility) args.push('--accessibility');
  if (options.mobileFirst) args.push('--mobile-first');
  if (options.i18n) args.push('--i18n');
  if (options.gitFlow) args.push('--git-flow');
  if (options.autoPush) args.push('--auto-push');
  
  const { spawn } = await import('child_process');
  const child = spawn('./scripts/component-automation.sh', args, {
    stdio: 'inherit',
    shell: true
  });
  
  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`Component creation failed with code ${code}`));
      }
    });
  });
}

// Parse command line arguments
function parseArgs(args: string[]) {
  const parsed: any = { _: [] };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('--')) {
        parsed[key] = nextArg;
        i++; // Skip next arg since we consumed it
      } else {
        parsed[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('-')) {
        parsed[key] = nextArg;
        i++; // Skip next arg since we consumed it
      } else {
        parsed[key] = true;
      }
    } else {
      parsed._.push(arg);
    }
  }
  
  return parsed;
}

// Main CLI logic
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  const componentPath = args._[1];
  
  switch (command) {
    case 'add':
      if (!componentPath) {
        console.error('❌ Usage: tsx codex.component.mts add <name> [options]');
        process.exit(1);
      }
      await addComponent(args[0], args[1] || 'box');
      break;
      
    case 'remove':
      if (args.length < 1) {
        console.error('❌ Usage: bun codex.component.mts remove <path>');
        process.exit(1);
      }
      await removeComponent(args[0]);
      break;
      
    case 'rename':
      if (args.length < 2) {
        console.error('❌ Usage: bun codex.component.mts rename <oldPath> <newPath>');
        process.exit(1);
      }
      await renameComponent(args[0], args[1]);
      break;
      
    case 'list':
      await listComponents();
      break;
      
    case 'storybook':
      await setupStorybook();
      break;
      
    default:
      console.log(`
🛠️  AfriPay Component Management CLI

Usage:
  bun codex.component.mts <command> [options]

Commands:
  add <path> [template]     Add a new component
  remove <path>            Remove a component  
  rename <old> <new>       Rename a component
  list                     List all components
  storybook               Setup Storybook integration

Templates:
  box                     Basic container component
  button                  Interactive button component  
  input                   Form input component
  modal                   Modal dialog component

Examples:
  bun codex.component.mts add Forms/TextInput input
  bun codex.component.mts add Modals/ConfirmDialog modal
  bun codex.component.mts remove Forms/TextInput
  bun codex.component.mts list
  bun codex.component.mts storybook
`);
  }
}

if (process.argv[1] && process.argv[1].includes('codex.component.mts')) {
  main().catch(console.error);
}