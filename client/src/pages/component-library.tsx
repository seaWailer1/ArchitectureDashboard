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

// Component categories and their examples
const componentCategories = [
  {
    id: 'ui',
    name: 'UI Components',
    icon: <Layers className="w-5 h-5" />,
    count: 25,
    description: 'Basic building blocks for interfaces',
    components: [
      {
        name: 'Button',
        description: 'Interactive button component with variants',
        category: 'ui',
        props: ['variant', 'size', 'disabled', 'onClick'],
        examples: ['Primary', 'Secondary', 'Outline', 'Ghost']
      },
      {
        name: 'Card',
        description: 'Container component for content grouping',
        category: 'ui',
        props: ['className', 'children'],
        examples: ['Basic', 'With Header', 'With Footer', 'Elevated']
      },
      {
        name: 'Input',
        description: 'Form input component with validation',
        category: 'ui',
        props: ['type', 'placeholder', 'value', 'onChange'],
        examples: ['Text', 'Email', 'Password', 'Number']
      },
      {
        name: 'Badge',
        description: 'Small status indicators and labels',
        category: 'ui',
        props: ['variant', 'children'],
        examples: ['Default', 'Secondary', 'Success', 'Destructive']
      },
      {
        name: 'Progress',
        description: 'Progress indicator for loading states',
        category: 'ui',
        props: ['value', 'max', 'className'],
        examples: ['Loading', 'Upload', 'Completion', 'Multi-step']
      }
    ]
  },
  {
    id: 'wallet',
    name: 'Wallet Components',
    icon: <Heart className="w-5 h-5" />,
    count: 15,
    description: 'Financial and wallet management components',
    components: [
      {
        name: 'WalletCard',
        description: 'Displays wallet information and balance',
        category: 'wallet',
        props: ['wallet', 'onAction', 'variant'],
        examples: ['Primary', 'Savings', 'Crypto', 'Investment']
      },
      {
        name: 'TransactionItem',
        description: 'Individual transaction display component',
        category: 'wallet',
        props: ['transaction', 'onSelect', 'showDetails'],
        examples: ['Send', 'Receive', 'Payment', 'Transfer']
      },
      {
        name: 'BalanceDisplay',
        description: 'Shows formatted balance with currency',
        category: 'wallet',
        props: ['amount', 'currency', 'showCents'],
        examples: ['USD', 'NGN', 'KES', 'GHS']
      }
    ]
  },
  {
    id: 'forms',
    name: 'Form Components',
    icon: <Settings className="w-5 h-5" />,
    count: 12,
    description: 'Form controls and validation components',
    components: [
      {
        name: 'FormField',
        description: 'Wrapper for form inputs with validation',
        category: 'forms',
        props: ['name', 'label', 'error', 'required'],
        examples: ['Text Field', 'Select Field', 'Checkbox', 'Radio Group']
      },
      {
        name: 'PhoneInput',
        description: 'International phone number input',
        category: 'forms',
        props: ['value', 'onChange', 'country'],
        examples: ['Nigeria', 'Kenya', 'Ghana', 'International']
      }
    ]
  },
  {
    id: 'layout',
    name: 'Layout Components',
    icon: <Palette className="w-5 h-5" />,
    count: 8,
    description: 'Page layout and structure components',
    components: [
      {
        name: 'Header',
        description: 'Application header with navigation',
        category: 'layout',
        props: ['title', 'showBack', 'actions'],
        examples: ['Main', 'With Back', 'With Actions', 'Minimal']
      },
      {
        name: 'Sidebar',
        description: 'Navigation sidebar component',
        category: 'layout',
        props: ['items', 'collapsed', 'onToggle'],
        examples: ['Expanded', 'Collapsed', 'With Icons', 'Role-based']
      }
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
    }`}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary text-center">
              AfriPay Component Library
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
            Explore our comprehensive collection of 60+ reusable React components built with 
            TypeScript, TailwindCSS, and WCAG AAA accessibility standards. Perfect for building 
            modern fintech applications.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-primary">60+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-success">20+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-accent">AAA</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Accessibility</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-info">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">TypeScript</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4">
            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full h-12 text-base"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="h-12 text-base">All Categories</SelectItem>
                  {componentCategories.map(category => (
                    <SelectItem key={category.id} value={category.id} className="h-12 text-base">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Settings Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <Badge variant="outline" className="text-xs">
                {filteredCategories.reduce((acc, cat) => acc + cat.components.length, 0)} components
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