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
