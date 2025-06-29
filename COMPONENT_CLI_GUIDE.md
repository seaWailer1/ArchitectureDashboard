# AfriPay Component Management CLI

A TypeScript automation tool for managing React components in the AfriPay fintech application. Built for Replit environments with Bun compatibility.

## Quick Start

```bash
# Make CLI executable
chmod +x codex.component.mts

# List all existing components
bun codex.component.mts list

# Add a new component
bun codex.component.mts add Forms/TextInput input

# Remove a component
bun codex.component.mts remove Forms/TextInput

# Rename a component
bun codex.component.mts rename Forms/TextInput Forms/TextField

# Setup Storybook integration
bun codex.component.mts storybook
```

## Commands

### `add <path> [template]`

Creates a new component with all necessary files:

- `ComponentName.tsx` - Main component file
- `ComponentName.stories.tsx` - Storybook stories
- `ComponentName.test.tsx` - Jest tests
- `ComponentNameDemo.tsx` - Demo/showcase component
- `index.ts` - Barrel export file

**Templates Available:**
- `box` (default) - Basic container component
- `button` - Interactive button with variants and sizes
- `input` - Form input component with validation support
- `modal` - Modal dialog component with overlay

**Examples:**
```bash
bun codex.component.mts add UI/CustomButton button
bun codex.component.mts add Forms/EmailInput input
bun codex.component.mts add Modals/ConfirmDialog modal
bun codex.component.mts add Layout/FlexBox box
```

### `remove <path>`

Safely removes a component and all associated files:

```bash
bun codex.component.mts remove UI/CustomButton
```

- Removes all related files (component, stories, tests, demo)
- Cleans up empty directories
- Updates barrel export files automatically

### `rename <oldPath> <newPath>`

Renames a component and updates all references:

```bash
bun codex.component.mts rename UI/Button UI/PrimaryButton
```

### `list`

Displays all components organized by category:

```bash
bun codex.component.mts list
```

Shows a tree view of all components in the `client/src/components/` directory.

### `storybook`

Sets up Storybook integration:

```bash
bun codex.component.mts storybook
```

Creates:
- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.ts` - Global preview settings
- `client/src/pages/component-library.tsx` - Access page

## File Structure

When you add a component, the CLI creates this structure:

```
client/src/components/
├── YourCategory/
│   ├── ComponentName.tsx
│   ├── ComponentName.stories.tsx
│   ├── ComponentName.test.tsx
│   ├── ComponentNameDemo.tsx
│   └── index.ts
└── index.ts (auto-updated)
```

## Component Templates

### Box Template

Basic container component with className and children props:

```typescript
interface BoxProps {
  className?: string;
  children?: React.ReactNode;
}
```

### Button Template

Feature-rich button component with variants and sizes:

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
}
```

### Input Template

Form input with common HTML input props:

```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}
```

### Modal Template

Modal dialog with overlay and close functionality:

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}
```

## Storybook Integration

After running `bun codex.component.mts storybook`, you can:

1. **Run Storybook locally:**
   ```bash
   npm run storybook
   # Opens on port 6006
   ```

2. **Access Component Library page:**
   Visit `/component-library` in your app for a dashboard view

3. **View component stories:**
   All `.stories.tsx` files are automatically discovered by Storybook

## Automatic Features

### Barrel Exports

The CLI automatically maintains barrel export files:

```typescript
// client/src/components/index.ts
export * from './ui';
export * from './forms';
export * from './layout';
// ... auto-generated exports
```

### Story Generation

Each component gets comprehensive Storybook stories:

```typescript
// Multiple story variants
export const Default: Story = { /* ... */ };
export const WithCustomProps: Story = { /* ... */ };
export const Disabled: Story = { /* ... */ };
```

### Test Scaffolding

Basic test structure for each component:

```typescript
describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
  });
});
```

## Best Practices

### Naming Conventions

- **Components:** PascalCase (`TextInput`, `PrimaryButton`)
- **Files:** Match component name (`TextInput.tsx`)
- **Paths:** Use forward slashes (`Forms/TextInput`)

### Component Structure

- Keep components focused and single-purpose
- Use TypeScript interfaces for all props
- Include proper accessibility attributes
- Follow WCAG AAA compliance standards

### Storybook Stories

- Document all component variants
- Include interactive controls (args)
- Show edge cases and error states
- Add accessibility addon support

## Troubleshooting

### Permission Issues

```bash
chmod +x codex.component.mts
```

### Component Not Found

Ensure you're using the correct path format:
```bash
# Correct
bun codex.component.mts remove Forms/TextInput

# Incorrect
bun codex.component.mts remove forms/textinput
```

### Storybook Not Loading

Check that all dependencies are installed:
```bash
npm run storybook
```

## Integration with AfriPay

The CLI is designed specifically for the AfriPay fintech application:

- **Existing Components:** Over 60 components across 20+ categories
- **Design System:** Built with TailwindCSS and Radix UI
- **Accessibility:** WCAG AAA compliant components
- **Mobile-First:** Responsive design patterns
- **Testing:** Jest and React Testing Library integration

## Development Workflow

1. **Plan Component:** Define props and behavior
2. **Add Component:** Use CLI to scaffold files
3. **Develop:** Implement component logic
4. **Test:** Write tests and verify in Storybook
5. **Document:** Update stories with examples
6. **Integrate:** Use in AfriPay application

This CLI streamlines component development in the AfriPay ecosystem while maintaining consistency and quality standards.