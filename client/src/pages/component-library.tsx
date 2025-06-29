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
      ${component.props.map(prop => `${prop}={/* value */}`).join('\n      ')}` : ''}
    >
      {/* Content */}
    </${component.name}>
  );
}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-neutral-900' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Layers className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">AfriPay Component Library</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of 60+ reusable React components built with 
            TypeScript, TailwindCSS, and WCAG AAA accessibility standards. Perfect for building 
            modern fintech applications.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">60+</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">20+</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">AAA</div>
              <div className="text-sm text-muted-foreground">Accessibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">100%</div>
              <div className="text-sm text-muted-foreground">TypeScript</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {componentCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
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
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.components.map((component, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{component.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {component.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedComponent(component)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">
                              PROPS
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {component.props?.slice(0, 3).map((prop, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {prop}
                                </Badge>
                              ))}
                              {component.props?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{component.props.length - 3}
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

        {/* CLI Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Component CLI Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3">Quick Commands</h3>
                <div className="space-y-2 text-sm font-mono bg-neutral-900 text-neutral-100 p-4 rounded-lg">
                  <div className="text-green-400"># Add new component</div>
                  <div>bun codex.component.mts add Forms/Input input</div>
                  <div className="text-green-400 mt-3"># Remove component</div>
                  <div>bun codex.component.mts remove Forms/Input</div>
                  <div className="text-green-400 mt-3"># List all components</div>
                  <div>bun codex.component.mts list</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Available Templates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['box', 'button', 'input', 'modal'].map(template => (
                    <Badge key={template} variant="outline" className="justify-center py-2">
                      {template}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-info/10 rounded-lg">
                  <div className="text-sm text-info">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Auto-generates .tsx, .stories.tsx, .test.tsx, and Demo.tsx files
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Detail Modal */}
        {selectedComponent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{selectedComponent.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedComponent(null)}
                  >
                    ×
                  </Button>
                </div>
                <p className="text-muted-foreground">{selectedComponent.description}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
                      <div className="text-center text-muted-foreground">
                        Interactive preview would appear here
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Props</Label>
                      <div className="mt-2 space-y-2">
                        {selectedComponent.props?.map((prop: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
                            <code className="text-sm">{prop}</code>
                            <Badge variant="outline" className="text-xs">
                              {prop.includes('on') ? 'function' : 'string'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="code" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{generateComponentCode(selectedComponent)}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateComponentCode(selectedComponent))}
                      >
                        {copiedCode === generateComponentCode(selectedComponent) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
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