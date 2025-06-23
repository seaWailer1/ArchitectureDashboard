import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  Smartphone, 
  CreditCard, 
  Globe,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  preferredRole: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    preferredRole: "consumer",
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  // Auto-fill data from test user if available
  useEffect(() => {
    const testUserData = sessionStorage.getItem('testUserData');
    if (testUserData) {
      try {
        const userData = JSON.parse(testUserData);
        const nameParts = userData.name.split(' ');
        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(' ') || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          dateOfBirth: "1990-01-01", // Default date
          address: userData.address || "",
          city: userData.city || "",
          country: userData.country || "",
          preferredRole: userData.role || "consumer",
          acceptedTerms: false,
          acceptedPrivacy: false,
        });
        setIsAutoFilled(true);
        
        // Show notification about auto-fill
        toast({
          title: "Information Pre-filled",
          description: `Using ${userData.name}'s details for demo experience`,
        });
        
        // Clear the session data
        sessionStorage.removeItem('testUserData');
      } catch (error) {
        console.error('Error parsing test user data:', error);
      }
    }
  }, [toast]);

  const steps = [
    { title: "Welcome", icon: Globe },
    { title: "Personal Info", icon: User },
    { title: "Contact Details", icon: Phone },
    { title: "Role Selection", icon: CreditCard },
    { title: "Terms & Privacy", icon: Shield },
  ];

  const updateFormData = (field: keyof OnboardingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      return await apiRequest('/api/onboarding/complete', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to AfriPay!",
        description: "Your account has been created successfully.",
      });
      setLocation("/kyc");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboardingMutation.mutate(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth;
      case 2:
        return formData.email && formData.phone && formData.address && formData.city && formData.country;
      case 3:
        return formData.preferredRole;
      case 4:
        return formData.acceptedTerms && formData.acceptedPrivacy;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to AfriPay</h2>
              <p className="text-neutral-600 text-lg mb-6">
                Your gateway to financial freedom across Africa
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span>Mobile-first design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Multiple wallets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <span>Pan-African reach</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
              <p className="text-neutral-600">Tell us a bit about yourself</p>
              {isAutoFilled && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">Information pre-filled for demo experience</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="John"
                    className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Doe"
                    className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Contact Details</h2>
              <p className="text-neutral-600">How can we reach you?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="john@example.com"
                  className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+234 123 456 7890"
                  className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                  className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="Lagos"
                    className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger className={isAutoFilled ? "bg-blue-50 border-blue-200" : ""}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="EG">Egypt</SelectItem>
                      <SelectItem value="MA">Morocco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
              <p className="text-neutral-600">How will you primarily use AfriPay?</p>
            </div>
            <div className="space-y-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.preferredRole === 'consumer' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                }`}
                onClick={() => updateFormData('preferredRole', 'consumer')}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Consumer</h3>
                    <p className="text-sm text-neutral-600">Personal banking and payments</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.preferredRole === 'merchant' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                }`}
                onClick={() => updateFormData('preferredRole', 'merchant')}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Merchant</h3>
                    <p className="text-sm text-neutral-600">Accept payments for your business</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.preferredRole === 'agent' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                }`}
                onClick={() => updateFormData('preferredRole', 'agent')}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Agent</h3>
                    <p className="text-sm text-neutral-600">Provide financial services and earn commissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Terms & Privacy</h2>
              <p className="text-neutral-600">Please review and accept our policies</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked) => updateFormData('acceptedTerms', !!checked)}
                />
                <div className="text-sm">
                  <label htmlFor="terms" className="cursor-pointer">
                    I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                  </label>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={formData.acceptedPrivacy}
                  onCheckedChange={(checked) => updateFormData('acceptedPrivacy', !!checked)}
                />
                <div className="text-sm">
                  <label htmlFor="privacy" className="cursor-pointer">
                    I agree to the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg text-sm text-neutral-600">
                <p className="mb-2">By continuing, you acknowledge that:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your data will be protected with bank-level security</li>
                  <li>• KYC verification is required for full access</li>
                  <li>• You can change your role preferences anytime</li>
                  <li>• Customer support is available 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      index < currentStep ? 'bg-primary' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          <p className="text-sm text-neutral-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              disabled={!canProceed() || completeOnboardingMutation.isPending}
              className="flex-1"
            >
              {currentStep === steps.length - 1 ? (
                completeOnboardingMutation.isPending ? "Creating Account..." : "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}