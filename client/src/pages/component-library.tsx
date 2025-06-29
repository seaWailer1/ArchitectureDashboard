import React, { useState } from 'react';
import { 
  Search, 
  Code, 
  Eye, 
  Copy, 
  Check, 
  Filter,
  Palette,
  Settings,
  Layers,
  Shield,
  Zap,
  Heart,
  Star,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryTranslation, getComponentDescription } from '@/lib/i18n-component-library';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/ui/language-selector';

// Component categories and their examples
const componentCategories = [
  {
    id: 'ui',
    name: 'UI Components',
    icon: <Layers className="w-5 h-5" />,
    count: 35,
    description: 'Essential UI building blocks and interface elements',
    components: [
      { name: 'Button', description: 'Interactive button with variants and sizes', category: 'ui', props: ['variant', 'size', 'disabled', 'onClick'], examples: ['Primary', 'Secondary', 'Outline', 'Ghost'] },
      { name: 'Card', description: 'Container for grouping related content', category: 'ui', props: ['className', 'children'], examples: ['Basic', 'With Header', 'Elevated', 'Interactive'] },
      { name: 'Input', description: 'Text input field with validation support', category: 'ui', props: ['type', 'placeholder', 'value', 'onChange'], examples: ['Text', 'Email', 'Password', 'Search'] },
      { name: 'Badge', description: 'Small status indicators and labels', category: 'ui', props: ['variant', 'children'], examples: ['Default', 'Secondary', 'Success', 'Destructive'] },
      { name: 'Avatar', description: 'User profile picture display', category: 'ui', props: ['src', 'alt', 'fallback'], examples: ['Image', 'Initials', 'Icon', 'Loading'] },
      { name: 'Alert', description: 'Important message notifications', category: 'ui', props: ['variant', 'title', 'description'], examples: ['Info', 'Warning', 'Error', 'Success'] },
      { name: 'Tabs', description: 'Organize content in tabbed interface', category: 'ui', props: ['defaultValue', 'orientation'], examples: ['Horizontal', 'Vertical', 'Pills', 'Underline'] },
      { name: 'Tooltip', description: 'Contextual information on hover', category: 'ui', props: ['content', 'side', 'delay'], examples: ['Top', 'Bottom', 'Left', 'Right'] },
      { name: 'Switch', description: 'Toggle between two states', category: 'ui', props: ['checked', 'onCheckedChange'], examples: ['Basic', 'With Label', 'Disabled', 'Loading'] },
      { name: 'Slider', description: 'Select value from a range', category: 'ui', props: ['value', 'min', 'max', 'step'], examples: ['Single', 'Range', 'Vertical', 'Custom'] },
      { name: 'Progress', description: 'Visual progress indicator', category: 'ui', props: ['value', 'max'], examples: ['Linear', 'Circular', 'Striped', 'Animated'] },
      { name: 'Skeleton', description: 'Loading placeholder component', category: 'ui', props: ['className'], examples: ['Text', 'Circle', 'Rectangle', 'Card'] },
      { name: 'Separator', description: 'Visual divider between content', category: 'ui', props: ['orientation'], examples: ['Horizontal', 'Vertical', 'Dashed', 'Thick'] },
      { name: 'Scroll Area', description: 'Custom scrollable container', category: 'ui', props: ['className'], examples: ['Vertical', 'Horizontal', 'Both', 'Custom'] },
      { name: 'Popover', description: 'Floating content container', category: 'ui', props: ['open', 'onOpenChange'], examples: ['Click', 'Hover', 'Manual', 'Nested'] }
    ]
  },
  {
    id: 'wallet',
    name: 'Wallet & Financial',
    icon: <Heart className="w-5 h-5" />,
    count: 12,
    description: 'Financial and wallet management components',
    components: [
      { name: 'WalletCard', description: 'Wallet information and balance display', category: 'wallet', props: ['wallet', 'onAction', 'variant'], examples: ['Primary', 'Savings', 'Crypto', 'Investment'] },
      { name: 'BalanceDisplay', description: 'Formatted currency balance', category: 'wallet', props: ['amount', 'currency', 'showCents'], examples: ['USD', 'NGN', 'KES', 'GHS'] },
      { name: 'WalletSummary', description: 'Overview of all wallet balances', category: 'wallet', props: ['wallets', 'totalBalance'], examples: ['Total View', 'By Type', 'Chart View', 'Minimal'] },
      { name: 'CurrencyConverter', description: 'Live currency conversion', category: 'wallet', props: ['fromCurrency', 'toCurrency'], examples: ['USD/NGN', 'EUR/KES', 'Live Rates', 'Historical'] },
      { name: 'WalletActions', description: 'Quick wallet action buttons', category: 'wallet', props: ['actions', 'wallet'], examples: ['Send', 'Receive', 'Top Up', 'Exchange'] },
      { name: 'AssetHoldings', description: 'Investment and asset portfolio', category: 'wallet', props: ['holdings', 'performance'], examples: ['Stocks', 'Crypto', 'Bonds', 'Commodities'] }
    ]
  },
  {
    id: 'transactions',
    name: 'Transactions',
    icon: <ArrowRight className="w-5 h-5" />,
    count: 8,
    description: 'Transaction display and management components',
    components: [
      { name: 'TransactionItem', description: 'Individual transaction display', category: 'transactions', props: ['transaction', 'onSelect'], examples: ['Send', 'Receive', 'Payment', 'Transfer'] },
      { name: 'TransactionList', description: 'List of transaction history', category: 'transactions', props: ['transactions', 'filter'], examples: ['Recent', 'Filtered', 'Paginated', 'Grouped'] },
      { name: 'TransactionDetails', description: 'Detailed transaction view', category: 'transactions', props: ['transaction'], examples: ['Receipt', 'Details', 'Status', 'Actions'] },
      { name: 'TransactionFilter', description: 'Filter and search transactions', category: 'transactions', props: ['filters', 'onChange'], examples: ['Date Range', 'Type', 'Amount', 'Status'] },
      { name: 'TransactionChart', description: 'Visual transaction analytics', category: 'transactions', props: ['data', 'period'], examples: ['Line Chart', 'Bar Chart', 'Pie Chart', 'Trends'] }
    ]
  },
  {
    id: 'crypto',
    name: 'Crypto & Trading',
    icon: <Star className="w-5 h-5" />,
    count: 15,
    description: 'Cryptocurrency and trading components',
    components: [
      { name: 'CryptoPrice', description: 'Live cryptocurrency prices', category: 'crypto', props: ['symbol', 'showChange'], examples: ['BTC', 'ETH', 'List View', 'Card View'] },
      { name: 'TradingChart', description: 'Advanced trading charts', category: 'crypto', props: ['symbol', 'interval'], examples: ['Candlestick', 'Line', 'Volume', 'Indicators'] },
      { name: 'OrderBook', description: 'Market depth and orders', category: 'crypto', props: ['pair', 'depth'], examples: ['Buy Orders', 'Sell Orders', 'Combined', 'Simplified'] },
      { name: 'Portfolio', description: 'Crypto portfolio overview', category: 'crypto', props: ['holdings', 'performance'], examples: ['Holdings', 'Performance', 'Allocation', 'History'] },
      { name: 'TradingForm', description: 'Buy/sell trading interface', category: 'crypto', props: ['type', 'pair'], examples: ['Market', 'Limit', 'Stop Loss', 'OCO'] },
      { name: 'WalletConnect', description: 'External wallet connection', category: 'crypto', props: ['onConnect'], examples: ['MetaMask', 'WalletConnect', 'Coinbase', 'Trust'] }
    ]
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: <Settings className="w-5 h-5" />,
    count: 10,
    description: 'Investment and wealth management components',
    components: [
      { name: 'InvestmentCard', description: 'Investment product display', category: 'investment', props: ['investment', 'performance'], examples: ['Stocks', 'Bonds', 'Mutual Funds', 'ETFs'] },
      { name: 'PortfolioChart', description: 'Investment portfolio visualization', category: 'investment', props: ['data', 'timeframe'], examples: ['Allocation', 'Performance', 'Growth', 'Comparison'] },
      { name: 'RiskAssessment', description: 'Investment risk profiling', category: 'investment', props: ['score', 'category'], examples: ['Conservative', 'Moderate', 'Aggressive', 'Custom'] },
      { name: 'DividendTracker', description: 'Dividend income tracking', category: 'investment', props: ['dividends'], examples: ['Monthly', 'Quarterly', 'Annual', 'Projected'] },
      { name: 'GoalTracker', description: 'Investment goal progress', category: 'investment', props: ['goal', 'progress'], examples: ['Retirement', 'Education', 'House', 'Emergency'] }
    ]
  },
  {
    id: 'loans',
    name: 'Loans & Credit',
    icon: <Shield className="w-5 h-5" />,
    count: 8,
    description: 'Loan and credit management components',
    components: [
      { name: 'LoanCard', description: 'Loan information display', category: 'loans', props: ['loan', 'status'], examples: ['Personal', 'Business', 'Mortgage', 'Auto'] },
      { name: 'CreditScore', description: 'Credit score visualization', category: 'loans', props: ['score', 'range'], examples: ['Gauge', 'Progress', 'History', 'Factors'] },
      { name: 'LoanCalculator', description: 'Loan payment calculator', category: 'loans', props: ['principal', 'rate', 'term'], examples: ['Monthly', 'Amortization', 'Comparison', 'What-if'] },
      { name: 'RepaymentSchedule', description: 'Loan repayment timeline', category: 'loans', props: ['schedule'], examples: ['Monthly', 'Bi-weekly', 'Custom', 'Early Payment'] }
    ]
  },
  {
    id: 'kyc',
    name: 'KYC & Verification',
    icon: <Shield className="w-5 h-5" />,
    count: 6,
    description: 'Identity verification and compliance components',
    components: [
      { name: 'DocumentUpload', description: 'Secure document upload interface', category: 'kyc', props: ['documentType', 'onUpload'], examples: ['ID Card', 'Passport', 'Utility Bill', 'Bank Statement'] },
      { name: 'BiometricCapture', description: 'Biometric verification interface', category: 'kyc', props: ['type', 'onCapture'], examples: ['Fingerprint', 'Face ID', 'Voice', 'Signature'] },
      { name: 'VerificationStatus', description: 'KYC verification progress', category: 'kyc', props: ['status', 'steps'], examples: ['Pending', 'In Progress', 'Verified', 'Rejected'] },
      { name: 'ComplianceCheck', description: 'Regulatory compliance verification', category: 'kyc', props: ['checks'], examples: ['AML', 'Sanctions', 'PEP', 'Risk Level'] }
    ]
  },
  {
    id: 'qr',
    name: 'QR & Payments',
    icon: <Code className="w-5 h-5" />,
    count: 5,
    description: 'QR code and payment processing components',
    components: [
      { name: 'QRGenerator', description: 'Generate payment QR codes', category: 'qr', props: ['amount', 'recipient'], examples: ['Payment', 'Contact', 'WiFi', 'URL'] },
      { name: 'QRScanner', description: 'Camera-based QR scanner', category: 'qr', props: ['onScan'], examples: ['Payment', 'Contact', 'General', 'Batch'] },
      { name: 'PaymentForm', description: 'Quick payment interface', category: 'qr', props: ['recipient', 'amount'], examples: ['Person to Person', 'Merchant', 'Bill Payment', 'Donation'] }
    ]
  },
  {
    id: 'merchant',
    name: 'Merchant Tools',
    icon: <Palette className="w-5 h-5" />,
    count: 9,
    description: 'Business and merchant management components',
    components: [
      { name: 'MerchantDashboard', description: 'Business overview dashboard', category: 'merchant', props: ['merchantData'], examples: ['Sales', 'Analytics', 'Inventory', 'Customers'] },
      { name: 'InventoryManager', description: 'Product inventory management', category: 'merchant', props: ['products'], examples: ['Add Product', 'Stock Levels', 'Pricing', 'Categories'] },
      { name: 'SalesAnalytics', description: 'Sales performance charts', category: 'merchant', props: ['salesData'], examples: ['Daily', 'Weekly', 'Monthly', 'Yearly'] },
      { name: 'CustomerManagement', description: 'Customer relationship tools', category: 'merchant', props: ['customers'], examples: ['Customer List', 'Purchase History', 'Loyalty', 'Support'] }
    ]
  },
  {
    id: 'admin',
    name: 'Admin & Management',
    icon: <Settings className="w-5 h-5" />,
    count: 7,
    description: 'Administrative and system management components',
    components: [
      { name: 'UserManagement', description: 'User administration interface', category: 'admin', props: ['users'], examples: ['User List', 'Roles', 'Permissions', 'Activity'] },
      { name: 'SystemMetrics', description: 'System performance monitoring', category: 'admin', props: ['metrics'], examples: ['CPU', 'Memory', 'Network', 'Database'] },
      { name: 'AuditLog', description: 'System activity logging', category: 'admin', props: ['logs'], examples: ['User Actions', 'System Events', 'Security', 'Errors'] },
      { name: 'ConfigurationPanel', description: 'System configuration interface', category: 'admin', props: ['config'], examples: ['General', 'Security', 'Integrations', 'Notifications'] }
    ]
  },
  {
    id: 'layout',
    name: 'Layout & Navigation',
    icon: <Layers className="w-5 h-5" />,
    count: 8,
    description: 'Page layout and navigation components',
    components: [
      { name: 'Header', description: 'Application header with navigation', category: 'layout', props: ['title', 'showBack', 'actions'], examples: ['Main', 'With Back', 'Actions', 'Minimal'] },
      { name: 'Sidebar', description: 'Collapsible navigation sidebar', category: 'layout', props: ['items', 'collapsed'], examples: ['Expanded', 'Collapsed', 'Icons', 'Nested'] },
      { name: 'Breadcrumb', description: 'Navigation breadcrumb trail', category: 'layout', props: ['items'], examples: ['Simple', 'With Icons', 'Dropdown', 'Mobile'] },
      { name: 'TabNavigation', description: 'Tab-based navigation', category: 'layout', props: ['tabs', 'activeTab'], examples: ['Top', 'Bottom', 'Side', 'Pills'] }
    ]
  }
];

export function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [codeView, setCodeView] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  const { language, t, isRTL, formatNumber } = useLanguage();

  const filteredCategories = componentCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;
    if (searchTerm) {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.components.some(comp => 
               comp.name.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const generateComponentCode = (component: any) => {
    return `import { ${component.name} } from '@/components/${component.category}/${component.name.toLowerCase()}';

export function Example() {
  return (
    <${component.name}${component.props?.length ? `
      ${component.props.map((prop: string) => `${prop}={/* value */}`).join('\n      ')}` : ''}
    >
      {/* Content */}
    </${component.name}>
  );
}`;
  };

  const generateTestCode = (component: any) => {
    return `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${component.name} } from '@/components/${component.category}/${component.name.toLowerCase()}';

describe('${component.name}', () => {
  it('renders correctly', () => {
    render(<${component.name}>Test content</${component.name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(
      <${component.name} onClick={handleClick}>
        Click me
      </${component.name}>
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('meets accessibility standards', () => {
    render(<${component.name}>Accessible content</${component.name}>);
    
    // Check for proper ARIA attributes
    const element = screen.getByRole('${component.name.toLowerCase()}');
    expect(element).toBeInTheDocument();
    expect(element).toBeVisible();
  });
});`;
  };

  const renderComponentPreview = (component: any) => {
    if (!component) return null;

    switch (component.name) {
      case 'Button':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        );
      
      case 'Card':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold">Basic Card</h3>
                <p className="text-sm text-muted-foreground">Simple card content</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card with Header</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Card with header and content sections</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'Input':
        return (
          <div className="space-y-4 max-w-sm">
            <Input placeholder="Text input" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <Input type="number" placeholder="Number input" />
            <Input disabled placeholder="Disabled input" />
          </div>
        );
      
      case 'Badge':
        return (
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        );
      
      case 'Progress':
        return (
          <div className="space-y-4 max-w-sm">
            <div>
              <Label className="text-sm font-medium">Loading Progress</Label>
              <Progress value={33} className="mt-2" />
            </div>
            <div>
              <Label className="text-sm font-medium">Upload Progress</Label>
              <Progress value={66} className="mt-2" />
            </div>
            <div>
              <Label className="text-sm font-medium">Completion</Label>
              <Progress value={100} className="mt-2" />
            </div>
          </div>
        );
      
      case 'WalletCard':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/20">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Primary Wallet</h3>
                  <p className="text-2xl font-bold mt-2">$2,458.50</p>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </div>
                <Badge variant="secondary">Primary</Badge>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-success/10 to-success/20">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Savings Wallet</h3>
                  <p className="text-2xl font-bold mt-2">$8,250.00</p>
                  <p className="text-sm text-muted-foreground">Saved Amount</p>
                </div>
                <Badge variant="outline">Savings</Badge>
              </div>
            </Card>
          </div>
        );
      
      case 'TransactionItem':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Payment to John Doe</p>
                  <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">-$50.00</p>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-primary rotate-180" />
                </div>
                <div>
                  <p className="font-medium">Received from Sarah</p>
                  <p className="text-sm text-muted-foreground">Yesterday, 4:15 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-success">+$125.00</p>
                <Badge variant="secondary">Received</Badge>
              </div>
            </div>
          </div>
        );
      
      case 'FormField':
        return (
          <div className="space-y-4 max-w-sm">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Enter your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+234 801 234 5678" className="mt-1" />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Code className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{component.name} Component</h3>
            <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {component.examples?.map((example: string, index: number) => (
                <Badge key={index} variant="outline">{example}</Badge>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-neutral-900' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
    } ${isRTL ? 'rtl font-arabic' : ''}`}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Language Selector */}
        <div className={`flex justify-end mb-4 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <LanguageSelector variant="compact" />
        </div>
        
        {/* Header */}
        <div className={`text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 ${isRTL ? 'text-right' : 'text-center'}`}>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-primary ${isRTL ? 'text-center' : 'text-center'}`}>
              {t.title}
            </h1>
          </div>
          <p className={`text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2 ${isRTL ? 'leading-loose' : ''}`}>
            {t.subtitle}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-primary">103+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.components}</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-success">11</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.categories}</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-accent">AAA</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.accessibility}</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-info">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.typescript}</div>
            </div>
          </div>

          {/* Storybook Integration Notice */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary">🚀 Storybook Integration Ready</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'en' && "Complete Storybook documentation with 15+ interactive stories covering UI components, wallet features, QR payments, and admin tools. Run 'npm run storybook' to explore the full interactive component playground."}
                  {language === 'fr' && "Documentation Storybook complète avec plus de 15 histoires interactives couvrant les composants UI, fonctionnalités de portefeuille, paiements QR et outils d'administration."}
                  {language === 'ar' && "وثائق Storybook شاملة مع أكثر من 15 قصة تفاعلية تغطي مكونات واجهة المستخدم وميزات المحفظة ومدفوعات QR وأدوات الإدارة."}
                  {language === 'sw' && "Nyaraka kamili za Storybook na hadithi zaidi ya 15 za maingiliano zinazoshughulikia vipengele vya UI, vipengele vya pochi, malipo ya QR, na zana za utawala."}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs text-muted-foreground bg-amber-50 px-3 py-2 rounded border border-amber-200">
                  {language === 'en' && 'Run: npm run storybook'}
                  {language === 'fr' && 'Exécuter: npm run storybook'}
                  {language === 'ar' && 'تشغيل: npm run storybook'}
                  {language === 'sw' && 'Endesha: npm run storybook'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'en' && 'Then visit: localhost:6006'}
                  {language === 'fr' && 'Puis visitez: localhost:6006'}
                  {language === 'ar' && 'ثم قم بزيارة: localhost:6006'}
                  {language === 'sw' && 'Kisha tembelea: localhost:6006'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4">
            {/* Search and Filter Row */}
            <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full h-12 text-base ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 text-base">
                  <SelectValue placeholder={t.allCategories} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="h-12 text-base">{t.allCategories}</SelectItem>
                  {componentCategories.map(category => (
                    <SelectItem key={category.id} value={category.id} className="h-12 text-base">
                      {getCategoryTranslation(category.id, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Settings Row */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label htmlFor="dark-mode" className="text-sm">{t.darkMode}</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <Badge variant="outline" className="text-xs">
                {formatNumber(filteredCategories.reduce((acc, cat) => acc + cat.count, 0))} {t.components}
              </Badge>
            </div>
          </div>
        </div>

        {/* Component Categories */}
        <div className="grid gap-8">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
                <div className="flex items-center gap-3">
                  {category.icon}
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {category.count} components
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {category.components.map((component, index) => (
                    <Card 
                      key={index} 
                      className="hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer touch-manipulation select-none"
                      onClick={() => setSelectedComponent(component)}
                    >
                      <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate leading-tight">{component.name}</CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                              {component.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedComponent(component)}
                            className="shrink-0 min-w-[44px] min-h-[44px] p-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View {component.name} details</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">
                              PROPS
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {component.props?.slice(0, 2).map((prop, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {prop}
                                </Badge>
                              ))}
                              {component.props?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{component.props.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">
                              EXAMPLES
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {component.examples?.slice(0, 2).map((example, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                              {component.examples?.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{component.examples.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Playground */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Interactive Playground
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Try Components Live</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Button Variants</Label>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Button variant="default" size="sm" className="text-xs sm:text-sm min-h-[44px] px-4 active:scale-95 transition-transform">Primary</Button>
                        <Button variant="secondary" size="sm" className="text-xs sm:text-sm min-h-[44px] px-4 active:scale-95 transition-transform">Secondary</Button>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm min-h-[44px] px-4 active:scale-95 transition-transform">Outline</Button>
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm min-h-[44px] px-4 active:scale-95 transition-transform">Ghost</Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Try different variants and sizes
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Form Controls</Label>
                    <div className="space-y-2 sm:space-y-3">
                      <Input placeholder="Interactive input field" className="text-sm" />
                      <Select>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2">
                        <Switch id="demo-switch" />
                        <Label htmlFor="demo-switch" className="text-xs sm:text-sm">Enable feature</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Component Properties</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Progress Indicators</Label>
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                          <span>Loading</span>
                          <span>33%</span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                          <span>Processing</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                          <span>Complete</span>
                          <span>100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Status Badges</Label>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="default" className="text-xs">Active</Badge>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                      <Badge variant="outline" className="text-xs">Review</Badge>
                      <Badge variant="destructive" className="text-xs">Error</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CLI Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Component CLI Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Quick Commands</h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-mono bg-neutral-900 text-neutral-100 p-3 sm:p-4 rounded-lg overflow-x-auto">
                  <div className="text-green-400"># Add new component</div>
                  <div className="break-all">bun codex.component.mts add Forms/Input input</div>
                  <div className="text-green-400 mt-2 sm:mt-3"># Remove component</div>
                  <div className="break-all">bun codex.component.mts remove Forms/Input</div>
                  <div className="text-green-400 mt-2 sm:mt-3"># List all components</div>
                  <div>bun codex.component.mts list</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Available Templates</h3>
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  {['box', 'button', 'input', 'modal'].map(template => (
                    <Badge key={template} variant="outline" className="justify-center py-2 text-xs sm:text-sm">
                      {template}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-info/10 rounded-lg">
                  <div className="text-xs sm:text-sm text-info">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    Auto-generates .tsx, .stories.tsx, .test.tsx, and Demo.tsx files
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Testing */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Accessibility Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">WCAG AAA Compliance</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-success/10 rounded-lg">
                    <span className="text-xs sm:text-sm">Color Contrast</span>
                    <Badge variant="secondary" className="text-xs">7:1 Ratio</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-success/10 rounded-lg">
                    <span className="text-xs sm:text-sm">Touch Targets</span>
                    <Badge variant="secondary" className="text-xs">44px Min</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-success/10 rounded-lg">
                    <span className="text-xs sm:text-sm">Keyboard Navigation</span>
                    <Badge variant="secondary" className="text-xs">✓ Full</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-success/10 rounded-lg">
                    <span className="text-xs sm:text-sm">Screen Readers</span>
                    <Badge variant="secondary" className="text-xs">✓ Optimized</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Interactive Testing</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="p-2 sm:p-3 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium">Focus Management</Label>
                    <div className="mt-2 space-y-1 sm:space-y-2">
                      <Button size="sm" tabIndex={1} className="w-full sm:w-auto text-xs">First Tab</Button>
                      <Input placeholder="Second Tab" tabIndex={2} className="text-xs sm:text-sm" />
                      <Button size="sm" variant="outline" tabIndex={3} className="w-full sm:w-auto text-xs">Third Tab</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                      Use Tab key to test focus order
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium">High Contrast</Label>
                    <div className="mt-2 space-y-1 sm:space-y-2">
                      <div className="p-2 bg-black text-white rounded text-xs sm:text-sm">
                        High contrast text
                      </div>
                      <div className="p-2 border-2 border-black rounded text-xs sm:text-sm">
                        High contrast border
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Design Tokens</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="p-2 sm:p-3 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium">Color Palette</Label>
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded" title="Primary Color"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded" title="Secondary Color"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-success rounded" title="Success Color"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-destructive rounded" title="Error Color"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                      All colors pass AAA contrast
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 border rounded-lg">
                    <Label className="text-xs sm:text-sm font-medium">Typography Scale</Label>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs">12px - Small</div>
                      <div className="text-sm">14px - Body</div>
                      <div className="text-base">16px - Default</div>
                      <div className="text-lg">18px - Large</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Detail Modal */}
        {selectedComponent && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedComponent(null);
              }
            }}
          >
            <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all duration-200 scale-95 animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl truncate">{selectedComponent.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">{selectedComponent.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedComponent(null)}
                    className="shrink-0 min-w-[44px] min-h-[44px] p-3 text-lg"
                  >
                    ×
                    <span className="sr-only">Close modal</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" className="text-sm">Preview</TabsTrigger>
                    <TabsTrigger value="code" className="text-sm">Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="space-y-3 sm:space-y-4">
                    <div className="p-4 sm:p-6 border rounded-lg bg-neutral-50 dark:bg-neutral-900 overflow-x-auto">
                      {renderComponentPreview(selectedComponent)}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Props</Label>
                      <div className="mt-2 space-y-2">
                        {selectedComponent.props?.map((prop: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded gap-2">
                            <code className="text-xs sm:text-sm truncate flex-1">{prop}</code>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {prop.includes('on') ? 'function' : 'string'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="code" className="space-y-3 sm:space-y-4">
                    <Tabs defaultValue="usage" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="usage" className="text-xs sm:text-sm">Usage</TabsTrigger>
                        <TabsTrigger value="props" className="text-xs sm:text-sm">Props</TabsTrigger>
                        <TabsTrigger value="test" className="text-xs sm:text-sm">Testing</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="usage" className="space-y-3 sm:space-y-4">
                        <div className="relative">
                          <pre className="bg-neutral-900 text-neutral-100 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto max-h-64 sm:max-h-80">
                            <code>{generateComponentCode(selectedComponent)}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(generateComponentCode(selectedComponent))}
                          >
                            {copiedCode === generateComponentCode(selectedComponent) ? (
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="props" className="space-y-2 sm:space-y-3">
                        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                          {selectedComponent.props?.map((prop: string, index: number) => (
                            <div key={index} className="p-2 sm:p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                                <code className="text-xs sm:text-sm font-mono font-medium truncate">{prop}</code>
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {prop.includes('on') ? 'function' : 
                                   prop.includes('is') || prop.includes('disabled') ? 'boolean' : 'string'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {prop === 'variant' ? 'Controls the visual style of the component' :
                                 prop === 'size' ? 'Sets the size variant (sm, default, lg)' :
                                 prop === 'disabled' ? 'Disables component interaction' :
                                 prop === 'onClick' ? 'Callback function for click events' :
                                 prop === 'className' ? 'Additional CSS classes to apply' :
                                 prop === 'children' ? 'Content to render inside the component' :
                                 `Configuration property for ${prop}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="test" className="space-y-3 sm:space-y-4">
                        <div className="relative">
                          <pre className="bg-neutral-900 text-neutral-100 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto max-h-64 sm:max-h-80">
                            <code>{generateTestCode(selectedComponent)}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(generateTestCode(selectedComponent))}
                          >
                            {copiedCode === generateTestCode(selectedComponent) ? (
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}