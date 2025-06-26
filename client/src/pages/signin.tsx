import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Globe, 
  ArrowRight,
  Shield,
  Smartphone,
  FaCreditCard,
  Users,
  Lock,
  Mail,
  FaEye,
  FaEyeSlash,
  FaCheckCircle
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const signInMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await apiRequest('/api/auth/signin', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      if (response.needsOnboarding) {
        setLocation("/onboarding");
      } else if (response.needsKYC) {
        setLocation("/kyc");
      } else {
        setLocation("/");
      }
    },
    onError: () => {
      toast({
        title: "Sign In Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
      return await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Account Created!",
        description: "Please complete your profile setup.",
      });
      setLocation("/onboarding");
    },
    onError: () => {
      toast({
        title: "Sign Up Failed",
        description: "An account with this email already exists or there was an error.",
        variant: "destructive",
      });
    },
  });

  const replitAuthMutation = useMutation({
    mutationFn: async () => {
      window.location.href = "/api/login";
    },
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }
      signUpMutation.mutate({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } else {
      signInMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const canSubmit = () => {
    if (isSignUp) {
      return formData.email && formData.password && formData.confirmPassword && 
             formData.firstName && formData.lastName && formData.password === formData.confirmPassword;
    }
    return formData.email && formData.password;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <div className="text-center text-white mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AfriPay</h1>
          <p className="text-white/80 text-lg">Your Gateway to Financial Freedom</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <Shield className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Secure</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <Smartphone className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Mobile First</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <FaCreditCard className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Multi-Wallet</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Pan-African</p>
          </div>
        </div>

        {/* Sign In/Up Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
            <p className="text-neutral-600">
              {isSignUp ? "Join thousands of users across Africa" : "Sign in to your AfriPay account"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10"
                      required
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-3">
                        {formData.password === formData.confirmPassword ? (
                          <FaCheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={!canSubmit() || signInMutation.isPending || signUpMutation.isPending}
                className="w-full"
              >
                {(signInMutation.isPending || signUpMutation.isPending) ? (
                  "Loading..."
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
            
            {!isSignUp && (
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Forgot your password?
                </Button>
              </div>
            )}
            
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-neutral-500 text-sm">or</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => replitAuthMutation.mutate()}
              className="w-full"
            >
              Continue with Replit
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <Button 
                  variant="link" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-1 p-0 h-auto font-semibold"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-8 text-white/80">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="w-4 h-4" />
              <span>Bank-level Security</span>
            </div>
          </div>
          <p className="text-xs mt-2">Trusted by 1M+ users across Africa</p>
        </div>
      </div>
    </div>
  );
}