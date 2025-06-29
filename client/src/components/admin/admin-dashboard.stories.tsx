import type { Meta, StoryObj } from '@storybook/react';
import { AdminDashboard } from './admin-dashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';

const meta: Meta<typeof AdminDashboard> = {
  title: 'Admin/AdminDashboard',
  component: AdminDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive administrative dashboard for AfriPay fintech platform with system monitoring, user management, analytics, and developer tools.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <Story />
        </div>
      </LanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default admin dashboard view with all tabs and comprehensive system overview.',
      },
    },
  },
};

export const SystemOverview: Story = {
  parameters: {
    docs: {
      description: {
        story: 'System overview tab showing key performance indicators, real-time metrics, and system health monitoring.',
      },
    },
  },
  render: () => (
    <AdminDashboard defaultTab="overview" />
  ),
};

export const UserManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: 'User management interface for handling customer accounts, KYC verification, and role management.',
      },
    },
  },
  render: () => (
    <AdminDashboard defaultTab="users" />
  ),
};

export const TransactionMonitoring: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Transaction monitoring dashboard with real-time payment tracking, fraud detection, and financial analytics.',
      },
    },
  },
  render: () => (
    <AdminDashboard defaultTab="transactions" />
  ),
};

export const Analytics: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive analytics dashboard with charts, reports, and business intelligence for fintech operations.',
      },
    },
  },
  render: () => (
    <AdminDashboard defaultTab="analytics" />
  ),
};

export const DeveloperTools: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Developer tools section including component library access, CLI documentation, and system utilities.',
      },
    },
  },
  render: () => (
    <AdminDashboard defaultTab="developer-tools" />
  ),
};

export const DemoDataManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demo data management tools for generating realistic test data across all user roles and scenarios.',
      },
    },
  },
  render: () => (
    <AdminDashboard defaultTab="demo-data" />
  ),
};

export const ResponsiveTablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Admin dashboard optimized for tablet devices with responsive layout and touch-friendly controls.',
      },
    },
  },
  render: () => (
    <AdminDashboard />
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
    docs: {
      description: {
        story: 'Mobile-optimized admin dashboard with collapsed navigation and essential controls accessible on mobile devices.',
      },
    },
  },
  render: () => (
    <AdminDashboard />
  ),
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <LanguageProvider>
        <div className="dark min-h-screen bg-background">
          <Story />
        </div>
      </LanguageProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Admin dashboard in dark mode theme with proper contrast and accessibility compliance.',
      },
    },
  },
};

export const FinTechFeatures: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">AfriPay Admin Features</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive fintech administration and monitoring capabilities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🔍 System Monitoring</h3>
          <ul className="text-sm space-y-1">
            <li>• Real-time transaction monitoring</li>
            <li>• System health dashboards</li>
            <li>• Performance metrics tracking</li>
            <li>• Error logging and alerts</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">👤 User Management</h3>
          <ul className="text-sm space-y-1">
            <li>• KYC verification workflows</li>
            <li>• Role-based access control</li>
            <li>• Account status management</li>
            <li>• Compliance reporting</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">💰 Financial Controls</h3>
          <ul className="text-sm space-y-1">
            <li>• Transaction limits management</li>
            <li>• Fraud detection systems</li>
            <li>• Regulatory compliance</li>
            <li>• Financial reporting</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">📊 Analytics & Insights</h3>
          <ul className="text-sm space-y-1">
            <li>• Business intelligence dashboards</li>
            <li>• Customer behavior analysis</li>
            <li>• Revenue tracking</li>
            <li>• Market trend analysis</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🛠️ Developer Tools</h3>
          <ul className="text-sm space-y-1">
            <li>• Component library management</li>
            <li>• API documentation</li>
            <li>• CLI tools integration</li>
            <li>• System utilities</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🌍 Multi-Regional Support</h3>
          <ul className="text-sm space-y-1">
            <li>• Multi-currency management</li>
            <li>• Localization controls</li>
            <li>• Regional compliance</li>
            <li>• Cross-border payments</li>
          </ul>
        </div>
      </div>
      
      <AdminDashboard />
    </div>
  ),
};

export const AccessibilityCompliance: Story = {
  render: () => (
    <div className="space-y-4 p-6">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">WCAG AAA Compliance Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-medium mb-2">Visual Accessibility</h4>
            <ul className="text-sm space-y-1">
              <li>✓ High contrast colors (7:1 ratio)</li>
              <li>✓ Scalable text and UI elements</li>
              <li>✓ Clear focus indicators</li>
              <li>✓ Color-blind friendly design</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Interaction Accessibility</h4>
            <ul className="text-sm space-y-1">
              <li>✓ Keyboard navigation support</li>
              <li>✓ Screen reader optimization</li>
              <li>✓ 44px minimum touch targets</li>
              <li>✓ Clear error messaging</li>
            </ul>
          </div>
        </div>
      </div>
      
      <AdminDashboard />
      
      <div className="text-xs text-muted-foreground text-center">
        Use Tab, Enter, and Arrow keys to navigate the admin interface
      </div>
    </div>
  ),
};