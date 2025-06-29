import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';
import { Search, Mail, Lock, User, Phone } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with support for icons, validation states, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'number', 'search', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="input-with-label">Email Address</Label>
      <Input id="input-with-label" type="email" placeholder="Enter your email" {...args} />
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input className="pl-10" placeholder="Search..." {...args} />
    </div>
  ),
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const FinTechVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Account Number</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="1234567890" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" type="tel" placeholder="+234 xxx xxx xxxx" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" type="email" placeholder="user@example.com" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>PIN</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" type="password" placeholder="Enter 4-digit PIN" maxLength={4} />
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityFeatures: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accessible-input">Required Field</Label>
        <Input 
          id="accessible-input"
          aria-required="true"
          aria-describedby="input-help"
          placeholder="This field is required"
        />
        <p id="input-help" className="text-sm text-muted-foreground">
          This field is required for account verification
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="error-input">Input with Error</Label>
        <Input 
          id="error-input"
          aria-invalid="true"
          aria-describedby="error-message"
          placeholder="Invalid input"
          className="border-destructive focus-visible:ring-destructive"
        />
        <p id="error-message" className="text-sm text-destructive">
          Please enter a valid email address
        </p>
      </div>
    </div>
  ),
};

export const MobileOptimized: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Touch-Friendly Input</Label>
        <Input 
          className="min-h-[48px] text-base"
          placeholder="Optimized for mobile"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Amount Input</Label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-muted-foreground">₦</span>
          <Input 
            className="pl-8 min-h-[48px] text-base"
            type="number"
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
      </div>
    </div>
  ),
};