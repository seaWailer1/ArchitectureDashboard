import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSelector } from './language-selector';
import { LanguageProvider } from '@/contexts/LanguageContext';

const meta: Meta<typeof LanguageSelector> = {
  title: 'UI/LanguageSelector',
  component: LanguageSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive language selector component supporting English, French, Arabic, and Swahili with RTL support and cultural localization.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <div className="p-4">
          <Story />
        </div>
      </LanguageProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Visual variant of the language selector',
    },
    showRegion: {
      control: 'boolean',
      description: 'Whether to show the region information',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    showRegion: true,
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    showRegion: false,
  },
};

export const WithoutRegion: Story = {
  args: {
    variant: 'default',
    showRegion: false,
  },
};

export const MultilingualDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">African Fintech Languages</h3>
        <p className="text-muted-foreground">
          AfriPay supports multiple African languages with cultural localization
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Default Variant</h4>
          <LanguageSelector variant="default" showRegion={true} />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Compact Variant</h4>
          <LanguageSelector variant="compact" />
        </div>
      </div>
      
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Supported Languages:</h4>
        <ul className="space-y-1 text-sm">
          <li>🇺🇸 English - Global fintech standard</li>
          <li>🇫🇷 Français - West African francophone countries</li>
          <li>🇪🇬 العربية - North African Arabic-speaking regions</li>
          <li>🇰🇪 Kiswahili - East African Swahili-speaking countries</li>
        </ul>
      </div>
    </div>
  ),
};

export const AccessibilityFeatures: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">WCAG AAA Compliance</h4>
        <ul className="text-sm space-y-1">
          <li>✓ 44px minimum touch target size</li>
          <li>✓ High contrast colors (7:1 ratio)</li>
          <li>✓ Keyboard navigation support</li>
          <li>✓ Screen reader optimization</li>
          <li>✓ RTL text direction for Arabic</li>
          <li>✓ Cultural font preferences</li>
        </ul>
      </div>
      
      <LanguageSelector variant="default" showRegion={true} />
      
      <div className="text-xs text-muted-foreground">
        Try using keyboard navigation (Tab, Enter, Arrow keys) to interact with the language selector
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
        <h3 className="text-base font-semibold">Mobile Language Selection</h3>
        <p className="text-sm text-muted-foreground">
          Optimized for touch interactions
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Compact Mobile View</label>
          <div className="mt-1">
            <LanguageSelector variant="compact" />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Full Mobile View</label>
          <div className="mt-1">
            <LanguageSelector variant="default" showRegion={false} />
          </div>
        </div>
      </div>
    </div>
  ),
};