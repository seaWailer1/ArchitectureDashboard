import { useState, useEffect } from "react";
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
import { PartnershipI18n, SupportedLanguage } from "@/lib/i18n-partnerships";
import LanguageSelector from "./language-selector";

interface PartnerWithAfriPayProps {
  onBack: () => void;
}

export default function PartnerWithAfriPay({ onBack }: PartnerWithAfriPayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'developer' | 'resources'>('overview');
  const [i18n] = useState(() => new PartnershipI18n());
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(i18n.getCurrentLanguage());
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
  const t = i18n.getTranslations();
  const isRTL = i18n.isRTL();

  useEffect(() => {
    // Apply RTL styles when language changes
    if (isRTL) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [isRTL]);

  const handleLanguageChange = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  // Partnership application mutation
  const applyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/partnerships/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.applicationSubmitted,
        description: t.applicationSubmittedDesc,
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
        title: t.submissionFailed,
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const partnershipTypes = [
    {
      id: 'fintech',
      title: t.fintechIntegration,
      description: t.fintechDescription,
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600',
      benefits: ['Revenue sharing', 'API access', 'White-label solutions', 'Technical support'],
      requirements: ['Financial license', 'Security compliance', 'KYC procedures']
    },
    {
      id: 'ecommerce',
      title: t.ecommercePlatform,
      description: t.ecommerceDescription,
      icon: Globe,
      color: 'bg-green-100 text-green-600',
      benefits: ['Payment gateway', 'Instant settlements', 'Fraud protection', 'Analytics'],
      requirements: ['Business registration', 'SSL certificate', 'API integration']
    },
    {
      id: 'merchant',
      title: t.merchantServices,
      description: t.merchantDescription,
      icon: Building2,
      color: 'bg-purple-100 text-purple-600',
      benefits: ['POS integration', 'QR payments', 'Inventory sync', 'Sales reports'],
      requirements: ['Business license', 'Tax compliance', 'Hardware compatibility']
    },
    {
      id: 'mobile',
      title: t.mobileAppDeveloper,
      description: t.mobileDescription,
      icon: Smartphone,
      color: 'bg-orange-100 text-orange-600',
      benefits: ['SDK access', 'App store billing', 'User analytics', 'Developer tools'],
      requirements: ['App store approval', 'Privacy policy', 'Security audit']
    },
    {
      id: 'logistics',
      title: t.logisticsDelivery,
      description: t.logisticsDescription,
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      benefits: ['Delivery tracking', 'COD payments', 'Route optimization', 'Customer notifications'],
      requirements: ['Transport license', 'Insurance coverage', 'Driver verification']
    },
    {
      id: 'enterprise',
      title: t.enterpriseSolutions,
      description: t.enterpriseDescription,
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
        title: t.missingInformation,
        description: t.fillRequiredFields,
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate(applicationData);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{t.subtitle}</p>
          </div>
        </div>
        <LanguageSelector 
          i18n={i18n} 
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="apply">{t.apply}</TabsTrigger>
          <TabsTrigger value="developer">{t.developer}</TabsTrigger>
          <TabsTrigger value="resources">{t.resources}</TabsTrigger>
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
                  <h3 className="text-xl font-bold">{t.heroTitle}</h3>
                  <p className="text-white/80">{t.heroSubtitle}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">50M+</p>
                  <p className="text-sm text-white/80">{t.activeUsers}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">54</p>
                  <p className="text-sm text-white/80">{t.countries}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">$10B+</p>
                  <p className="text-sm text-white/80">{t.annualVolume}</p>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => setActiveTab('apply')}
              >
                {t.startApplication}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </CardContent>
          </Card>

          {/* Partnership Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.partnershipOpportunities}</h3>
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
                              <p className="text-xs font-medium text-gray-500 mb-1">{t.benefits}</p>
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
              <CardTitle>{t.partnershipApplication}</CardTitle>
              <p className="text-sm text-gray-600">{t.applicationSubtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Information */}
              <div className="space-y-4">
                <h4 className="font-medium">{t.companyInformation}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.companyName} *</Label>
                    <Input
                      placeholder={t.companyName}
                      value={applicationData.companyName}
                      onChange={(e) => updateApplicationData('companyName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t.contactName} *</Label>
                    <Input
                      placeholder={t.contactName}
                      value={applicationData.contactName}
                      onChange={(e) => updateApplicationData('contactName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.emailAddress} *</Label>
                    <Input
                      type="email"
                      placeholder="contact@company.com"
                      value={applicationData.email}
                      onChange={(e) => updateApplicationData('email', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t.partnershipType} *</Label>
                    <Select value={applicationData.partnershipType} onValueChange={(value) => updateApplicationData('partnershipType', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t.partnershipType} />
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
                  <Label>{t.businessDescription}</Label>
                  <Textarea
                    placeholder={t.businessDescriptionPlaceholder}
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
                {applyMutation.isPending ? t.submitting : t.submitApplication}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer Tab */}
        <TabsContent value="developer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.developerQuickStart}</CardTitle>
              <p className="text-sm text-gray-600">{t.getStartedMinutes}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{t.step1Title}</h4>
                <p className="text-sm text-gray-600 mb-3">{t.step1Description}</p>
                <Button size="sm">{t.createAccount}</Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{t.step2Title}</h4>
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
              <CardTitle>{t.developmentResources}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">{t.comingSoon}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}