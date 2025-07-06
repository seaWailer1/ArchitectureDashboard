import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedCard } from './EnhancedCard';

const meta: Meta<typeof EnhancedCard> = {
  title: 'Components/UI/EnhancedCard',
  component: EnhancedCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced card with all features',
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
    children: 'EnhancedCard',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <EnhancedCard variant="default">Default</EnhancedCard>
      <EnhancedCard variant="destructive">Destructive</EnhancedCard>
      <EnhancedCard variant="outline">Outline</EnhancedCard>
      <EnhancedCard variant="secondary">Secondary</EnhancedCard>
      <EnhancedCard variant="ghost">Ghost</EnhancedCard>
      <EnhancedCard variant="link">Link</EnhancedCard>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <EnhancedCard size="sm">Small</EnhancedCard>
      <EnhancedCard size="default">Default</EnhancedCard>
      <EnhancedCard size="lg">Large</EnhancedCard>
      <EnhancedCard size="icon">Icon</EnhancedCard>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <EnhancedCard>Normal</EnhancedCard>
      <EnhancedCard disabled>Disabled</EnhancedCard>
      <EnhancedCard loading>Loading</EnhancedCard>
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
      <EnhancedCard {...args} />
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
      <EnhancedCard className="w-full">Full Width Mobile</EnhancedCard>
      <EnhancedCard size="lg" className="w-full">Large Mobile</EnhancedCard>
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
