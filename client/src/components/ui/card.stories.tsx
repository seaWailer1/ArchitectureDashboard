
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>Your current balance across all wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$1,234.56</div>
        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const AfriPayTransactionCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Transaction</CardTitle>
        <CardDescription>Money sent to John Doe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Transfer to John</p>
            <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-red-600">-$50.00</p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
