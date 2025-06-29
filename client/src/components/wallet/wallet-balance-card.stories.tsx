import type { Meta, StoryObj } from '@storybook/react';
import { WalletBalanceCard } from './wallet-balance-card';
import { LanguageProvider } from '@/contexts/LanguageContext';

const meta: Meta<typeof WalletBalanceCard> = {
  title: 'Wallet/WalletBalanceCard',
  component: WalletBalanceCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive wallet balance card showing account balance, recent transactions, and quick actions for AfriPay fintech platform.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <div className="p-4 max-w-md">
          <Story />
        </div>
      </LanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock wallet data for different scenarios
const mockConsumerWallet = {
  id: 1,
  userId: 'consumer-001',
  walletType: 'primary' as const,
  balance: '125000.50',
  pendingBalance: '2500.00',
  currency: 'NGN',
  isActive: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-06-29T12:00:00Z',
};

const mockMerchantWallet = {
  id: 2,
  userId: 'merchant-001', 
  walletType: 'primary' as const,
  balance: '2750000.00',
  pendingBalance: '45000.00',
  currency: 'NGN',
  isActive: true,
  createdAt: '2024-01-10T09:00:00Z',
  updatedAt: '2024-06-29T12:00:00Z',
};

const mockAgentWallet = {
  id: 3,
  userId: 'agent-001',
  walletType: 'primary' as const,
  balance: '850000.75',
  pendingBalance: '15000.00',
  currency: 'NGN',
  isActive: true,
  createdAt: '2024-02-01T08:00:00Z',
  updatedAt: '2024-06-29T12:00:00Z',
};

const mockCryptoWallet = {
  id: 4,
  userId: 'consumer-001',
  walletType: 'crypto' as const,
  balance: '0.0245',
  pendingBalance: '0.0012',
  currency: 'BTC',
  isActive: true,
  createdAt: '2024-03-15T14:00:00Z',
  updatedAt: '2024-06-29T12:00:00Z',
};

export const ConsumerWallet: Story = {
  args: {
    wallet: mockConsumerWallet,
    userRole: 'consumer',
    showActions: true,
  },
};

export const MerchantWallet: Story = {
  args: {
    wallet: mockMerchantWallet,
    userRole: 'merchant',
    showActions: true,
  },
};

export const AgentWallet: Story = {
  args: {
    wallet: mockAgentWallet,
    userRole: 'agent', 
    showActions: true,
  },
};

export const CryptoWallet: Story = {
  args: {
    wallet: mockCryptoWallet,
    userRole: 'consumer',
    showActions: true,
  },
};

export const LowBalance: Story = {
  args: {
    wallet: {
      ...mockConsumerWallet,
      balance: '250.00',
      pendingBalance: '0.00',
    },
    userRole: 'consumer',
    showActions: true,
  },
};

export const WithoutActions: Story = {
  args: {
    wallet: mockConsumerWallet,
    userRole: 'consumer',
    showActions: false,
  },
};

export const MultiCurrencyDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Multi-Currency Wallets</h3>
        <p className="text-sm text-muted-foreground">
          AfriPay supports multiple African currencies and cryptocurrencies
        </p>
      </div>
      
      <div className="grid gap-4">
        <WalletBalanceCard 
          wallet={{...mockConsumerWallet, currency: 'NGN'}}
          userRole="consumer"
          showActions={false}
        />
        
        <WalletBalanceCard 
          wallet={{...mockConsumerWallet, balance: '12500.00', currency: 'GHS'}}
          userRole="consumer"
          showActions={false}
        />
        
        <WalletBalanceCard 
          wallet={{...mockConsumerWallet, balance: '850000.00', currency: 'KES'}}
          userRole="consumer"
          showActions={false}
        />
        
        <WalletBalanceCard 
          wallet={{...mockCryptoWallet, currency: 'ETH', balance: '2.456'}}
          userRole="consumer"
          showActions={false}
        />
      </div>
    </div>
  ),
};

export const ResponsiveDemo: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="space-y-4 p-2">
      <div className="text-center">
        <h3 className="text-base font-semibold">Mobile Wallet View</h3>
      </div>
      
      <WalletBalanceCard 
        wallet={mockConsumerWallet}
        userRole="consumer"
        showActions={true}
      />
      
      <div className="text-xs text-muted-foreground text-center">
        Optimized for mobile interactions with 44px touch targets
      </div>
    </div>
  ),
};

export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">Accessibility Features</h4>
        <ul className="text-sm space-y-1">
          <li>✓ Screen reader optimized with ARIA labels</li>
          <li>✓ High contrast mode support</li>
          <li>✓ Keyboard navigation</li>
          <li>✓ Focus management</li>
          <li>✓ Currency formatting with locale support</li>
          <li>✓ Color-blind friendly design</li>
        </ul>
      </div>
      
      <WalletBalanceCard 
        wallet={mockConsumerWallet}
        userRole="consumer"
        showActions={true}
      />
      
      <div className="text-xs text-muted-foreground">
        Try using Tab and Enter keys to navigate through the card actions
      </div>
    </div>
  ),
};