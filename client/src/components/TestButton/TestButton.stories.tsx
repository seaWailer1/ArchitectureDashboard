import type { Meta, StoryObj } from '@storybook/react';
import { TestButton } from './TestButton';

const meta: Meta<typeof TestButton> = {
  title: 'Components/UI/TestButton',
  component: TestButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Test button component',
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
    children: 'TestButton',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TestButton variant="default">Default</TestButton>
      <TestButton variant="destructive">Destructive</TestButton>
      <TestButton variant="outline">Outline</TestButton>
      <TestButton variant="secondary">Secondary</TestButton>
      <TestButton variant="ghost">Ghost</TestButton>
      <TestButton variant="link">Link</TestButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TestButton size="sm">Small</TestButton>
      <TestButton size="default">Default</TestButton>
      <TestButton size="lg">Large</TestButton>
      <TestButton size="icon">Icon</TestButton>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <TestButton>Normal</TestButton>
      <TestButton disabled>Disabled</TestButton>
      <TestButton loading>Loading</TestButton>
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
      <TestButton {...args} />
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
      <TestButton className="w-full">Full Width Mobile</TestButton>
      <TestButton size="lg" className="w-full">Large Mobile</TestButton>
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
