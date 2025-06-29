import type { Meta, StoryObj } from '@storybook/react';
import { QRGenerator } from './qr-generator';
import { LanguageProvider } from '@/contexts/LanguageContext';

const meta: Meta<typeof QRGenerator> = {
  title: 'QR/QRGenerator',
  component: QRGenerator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'QR code generator for AfriPay payments, supporting dynamic amounts, merchant info, and instant payment processing.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <div className="p-4 max-w-sm">
          <Story />
        </div>
      </LanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MerchantPayment: Story = {
  args: {
    amount: '25000',
    currency: 'NGN',
    merchantId: 'merchant-001',
    merchantName: 'Kemi\'s Fashion Store',
    description: 'Ankara fabric payment',
    paymentType: 'merchant',
  },
};

export const P2PTransfer: Story = {
  args: {
    amount: '5000',
    currency: 'NGN',
    recipientId: 'user-123',
    recipientName: 'Adaora Okwu',
    description: 'Lunch money',
    paymentType: 'p2p',
  },
};

export const AgentCashout: Story = {
  args: {
    amount: '50000',
    currency: 'NGN',
    agentId: 'agent-005',
    agentName: 'Musa\'s Mobile Money',
    description: 'Cash withdrawal',
    paymentType: 'agent',
    location: 'Victoria Island, Lagos',
  },
};

export const UtilityBill: Story = {
  args: {
    amount: '15000',
    currency: 'NGN',
    billerId: 'ekedc-001',
    billerName: 'Eko Electricity',
    description: 'Monthly electricity bill',
    paymentType: 'bill',
    accountNumber: '1234567890',
  },
};

export const DynamicAmount: Story = {
  args: {
    merchantId: 'merchant-002',
    merchantName: 'Fresh Market Lagos',
    description: 'Groceries',
    paymentType: 'merchant',
    allowAmountEdit: true,
  },
};

export const MultiCurrencyShowcase: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">African Currency Support</h3>
        <p className="text-sm text-muted-foreground">
          QR payments across different African currencies
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Nigerian Naira (NGN)</h4>
          <QRGenerator 
            amount="10000"
            currency="NGN"
            merchantName="Lagos Restaurant"
            paymentType="merchant"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Kenyan Shilling (KES)</h4>
          <QRGenerator 
            amount="1500"
            currency="KES"
            merchantName="Nairobi Cafe"
            paymentType="merchant"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Ghanaian Cedi (GHS)</h4>
          <QRGenerator 
            amount="250"
            currency="GHS"
            merchantName="Accra Market"
            paymentType="merchant"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">South African Rand (ZAR)</h4>
          <QRGenerator 
            amount="500"
            currency="ZAR"
            merchantName="Cape Town Shop"
            paymentType="merchant"
          />
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityFeatures: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">QR Accessibility Features</h4>
        <ul className="text-sm space-y-1">
          <li>✓ High contrast QR codes for better scanning</li>
          <li>✓ Alternative text descriptions for screen readers</li>
          <li>✓ Keyboard accessible controls</li>
          <li>✓ Clear visual payment information</li>
          <li>✓ Error correction in QR codes</li>
          <li>✓ Multiple size options for visibility</li>
        </ul>
      </div>
      
      <QRGenerator 
        amount="7500"
        currency="NGN"
        merchantName="Accessible Merchant"
        description="WCAG AAA compliant payment"
        paymentType="merchant"
      />
      
      <div className="text-xs text-muted-foreground">
        QR codes include error correction and high contrast for reliable scanning
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
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="text-base font-semibold">Mobile QR Payment</h3>
        <p className="text-sm text-muted-foreground">
          Optimized for mobile merchant terminals
        </p>
      </div>
      
      <QRGenerator 
        amount="12500"
        currency="NGN"
        merchantName="Mobile Vendor"
        description="Street food payment"
        paymentType="merchant"
      />
      
      <div className="text-xs text-muted-foreground text-center">
        Touch-friendly interface with large QR codes for easy scanning
      </div>
    </div>
  ),
};

export const RealTimeUpdates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Real-Time Features</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• QR codes expire after 10 minutes for security</li>
          <li>• Instant payment confirmation</li>
          <li>• Live transaction status updates</li>
          <li>• Automatic refresh for expired codes</li>
        </ul>
      </div>
      
      <QRGenerator 
        amount="30000"
        currency="NGN"
        merchantName="Real-Time Merchant"
        description="Live transaction demo"
        paymentType="merchant"
        expiryMinutes={10}
      />
    </div>
  ),
};

export const PaymentTypeShowcase: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">AfriPay Payment Types</h3>
        <p className="text-sm text-muted-foreground">
          Different QR payment scenarios for African fintech
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">🏪 Merchant Payment</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Pay at retail stores, restaurants, and businesses
          </p>
          <QRGenerator 
            amount="15000"
            currency="NGN"
            merchantName="SuperMart Lagos"
            description="Grocery shopping"
            paymentType="merchant"
          />
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">👥 Peer-to-Peer Transfer</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Send money to friends and family instantly
          </p>
          <QRGenerator 
            amount="8000"
            currency="NGN"
            recipientName="Chika Okonkwo"
            description="Birthday gift"
            paymentType="p2p"
          />
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">🏧 Agent Cash-Out</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Withdraw cash from AfriPay agent locations
          </p>
          <QRGenerator 
            amount="25000"
            currency="NGN"
            agentName="Quick Cash Agent"
            description="Cash withdrawal"
            paymentType="agent"
            location="Ikeja, Lagos"
          />
        </div>
      </div>
    </div>
  ),
};