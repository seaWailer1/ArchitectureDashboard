import type { Meta, StoryObj } from '@storybook/react';
import { DemoPaymentCard } from './DemoPaymentCard';

const meta: Meta<typeof DemoPaymentCard> = {
  title: 'Components/Financial/DemoPaymentCard',
  component: DemoPaymentCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A demo payment card component for showcasing automation',
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
    children: 'DemoPaymentCard',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <DemoPaymentCard variant="default">Default</DemoPaymentCard>
      <DemoPaymentCard variant="destructive">Destructive</DemoPaymentCard>
      <DemoPaymentCard variant="outline">Outline</DemoPaymentCard>
      <DemoPaymentCard variant="secondary">Secondary</DemoPaymentCard>
      <DemoPaymentCard variant="ghost">Ghost</DemoPaymentCard>
      <DemoPaymentCard variant="link">Link</DemoPaymentCard>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DemoPaymentCard size="sm">Small</DemoPaymentCard>
      <DemoPaymentCard size="default">Default</DemoPaymentCard>
      <DemoPaymentCard size="lg">Large</DemoPaymentCard>
      <DemoPaymentCard size="icon">Icon</DemoPaymentCard>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <DemoPaymentCard>Normal</DemoPaymentCard>
      <DemoPaymentCard disabled>Disabled</DemoPaymentCard>
      <DemoPaymentCard loading>Loading</DemoPaymentCard>
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
      <DemoPaymentCard {...args} />
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
      <DemoPaymentCard className="w-full">Full Width Mobile</DemoPaymentCard>
      <DemoPaymentCard size="lg" className="w-full">Large Mobile</DemoPaymentCard>
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
