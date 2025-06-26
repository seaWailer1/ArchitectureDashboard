import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Building2, 
  Code, 
  Globe, 
  Handshake,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  ExternalLink,
  Download,
  Zap,
  Shield,
  Smartphone,
  CreditCard,
  BarChart3,
  HeadphonesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PartnerWithAfriPayProps {
  onBack: () => void;
}

export default function PartnerWithAfriPay({ onBack }: PartnerWithAfriPayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'developer' | 'resources'>('overview');
  const [applicationData, setApplicationData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    businessType: '',
    partnershipType: '',
    description: '',
    expectedVolume: '',
    integrationNeeds: '',
    timeline: ''
  });

  const { toast } = useToast();

  // Partnership application mutation
  const applyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/partnerships/apply', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "We'll review your partnership application and get back to you within 3-5 business days.",
      });
      setApplicationData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        businessType: '',
        partnershipType: '',
        description: '',
        expectedVolume: '',
        integrationNeeds: '',
        timeline: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const partnershipTypes = [
    {
      id: 'fintech',
      title: 'Fintech Integration',
      description: 'Payment processing, lending, investment services',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600',
      benefits: ['Revenue sharing', 'API access', 'White-label solutions', 'Technical support'],
      requirements: ['Financial license', 'Security compliance', 'KYC procedures']
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Platform',
      description: 'Online marketplaces, retail integration',
      icon: Globe,
      color: 'bg-green-100 text-green-600',
      benefits: ['Payment gateway', 'Instant settlements', 'Fraud protection', 'Analytics'],
      requirements: ['Business registration', 'SSL certificate', 'API integration']
    },
    {
      id: 'merchant',
      title: 'Merchant Services',
      description: 'Point-of-sale, retail solutions',
      icon: Building2,
      color: 'bg-purple-100 text-purple-600',
      benefits: ['POS integration', 'QR payments', 'Inventory sync', 'Sales reports'],
      requirements: ['Business license', 'Tax compliance', 'Hardware compatibility']
    },
    {
      id: 'mobile',
      title: 'Mobile App Developer',
      description: 'In-app payments, subscription billing',
      icon: Smartphone,
      color: 'bg-orange-100 text-orange-600',
      benefits: ['SDK access', 'App store billing', 'User analytics', 'Developer tools'],
      requirements: ['App store approval', 'Privacy policy', 'Security audit']
    },
    {
      id: 'logistics',
      title: 'Logistics & Delivery',
      description: 'Shipping, last-mile delivery services',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      benefits: ['Delivery tracking', 'COD payments', 'Route optimization', 'Customer notifications'],
      requirements: ['Transport license', 'Insurance coverage', 'Driver verification']
    },
    {
      id: 'enterprise',
      title: 'Enterprise Solutions',
      description: 'B2B payments, payroll, expense management',
      icon: BarChart3,
      color: 'bg-indigo-100 text-indigo-600',
      benefits: ['Bulk payments', 'Multi-currency', 'Reporting suite', 'Dedicated support'],
      requirements: ['Enterprise agreement', 'Volume commitments', 'Security certification']
    }
  ];

  const updateApplicationData = (field: string, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitApplication = () => {
    if (!applicationData.companyName || !applicationData.email || !applicationData.partnershipType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate(applicationData);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Partner with AfriPay</h2>
          <p className="text-sm text-gray-600">Join Africa's leading fintech ecosystem</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apply">Apply</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Hero Section */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Handshake className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Partner with AfriPay</h3>
                  <p className="text-white/80">Scale your business across Africa</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">50M+</p>
                  <p className="text-sm text-white/80">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">54</p>
                  <p className="text-sm text-white/80">Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">$10B+</p>
                  <p className="text-sm text-white/80">Annual Volume</p>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => setActiveTab('apply')}
              >
                Start Partnership Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Partnership Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Partnership Opportunities</h3>
            <div className="grid gap-4">
              {partnershipTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card key={type.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setActiveTab('apply')}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-lg ${type.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{type.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Benefits</p>
                              <div className="flex flex-wrap gap-1">
                                {type.benefits.map((benefit, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Application Tab */}
        <TabsContent value="apply" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Application</CardTitle>
              <p className="text-sm text-gray-600">Tell us about your business and integration needs</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Company Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name *</Label>
                    <Input
                      placeholder="Your company name"
                      value={applicationData.companyName}
                      onChange={(e) => updateApplicationData('companyName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Contact Name *</Label>
                    <Input
                      placeholder="Primary contact person"
                      value={applicationData.contactName}
                      onChange={(e) => updateApplicationData('contactName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="contact@company.com"
                      value={applicationData.email}
                      onChange={(e) => updateApplicationData('email', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Partnership Type *</Label>
                    <Select value={applicationData.partnershipType} onValueChange={(value) => updateApplicationData('partnershipType', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select partnership type" />
                      </SelectTrigger>
                      <SelectContent>
                        {partnershipTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Business Description</Label>
                  <Textarea
                    placeholder="Describe your business and how you plan to integrate with AfriPay..."
                    value={applicationData.description}
                    onChange={(e) => updateApplicationData('description', e.target.value)}
                    className="mt-2 h-24"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmitApplication}
                disabled={applyMutation.isPending}
                className="w-full"
              >
                {applyMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer Tab */}
        <TabsContent value="developer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Developer Quick Start</CardTitle>
              <p className="text-sm text-gray-600">Get started with AfriPay APIs in minutes</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Step 1: Get API Keys</h4>
                <p className="text-sm text-gray-600 mb-3">Sign up for a developer account to receive your API credentials</p>
                <Button size="sm">Create Developer Account</Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Step 2: Make Your First API Call</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                  <div>curl -X GET \</div>
                  <div>&nbsp;&nbsp;https://api.afripay.com/v1/payments \</div>
                  <div>&nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Developer Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Developer resources coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}