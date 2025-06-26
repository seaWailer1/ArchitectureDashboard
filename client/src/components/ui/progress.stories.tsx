
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const Full: Story = {
  args: {
    value: 100,
  },
};

export const KYCProgress: Story = {
  render: () => (
    <div className="w-[350px] space-y-3">
      <div>
        <div className="flex justify-between text-sm">
          <span>KYC Verification Progress</span>
          <span>60%</span>
        </div>
        <Progress value={60} className="mt-2" />
      </div>
      <p className="text-xs text-muted-foreground">
        Complete your identity verification to unlock all features
      </p>
    </div>
  ),
};
