import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  Phone, 
  FileText, 
  Camera, 
  CheckCircle, 
  Upload,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  User,
  CreditCard,
  Eye,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import AppHeader from "@/components/layout/app-header";

interface KYCData {
  phoneNumber: string;
  verificationCode: string;
  documentType: string;
  documentNumber: string;
  documentFront: File | null;
  documentBack: File | null;
  selfiePhoto: File | null;
}

export default function KYC() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [kycData, setKycData] = useState<KYCData>({
    phoneNumber: "",
    verificationCode: "",
    documentType: "",
    documentNumber: "",
    documentFront: null,
    documentBack: null,
    selfiePhoto: null,
  });

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [biometricCaptured, setBiometricCaptured] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const steps = [
    { 
      title: "Phone Verification", 
      icon: Phone, 
      description: "Verify your phone number",
      status: phoneVerified ? "completed" : "pending"
    },
    { 
      title: "Document Upload", 
      icon: FileText, 
      description: "Upload identity documents",
      status: documentUploaded ? "completed" : "pending"
    },
    { 
      title: "Biometric Verification", 
      icon: Camera, 
      description: "Take a selfie for verification",
      status: biometricCaptured ? "completed" : "pending"
    },
  ];

  const sendOTPMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      return await apiRequest('/api/kyc/send-otp', {
        method: 'POST',
        body: { phoneNumber },
      });
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      return await apiRequest('/api/kyc/verify-otp', {
        method: 'POST',
        body: { phoneNumber: phone, verificationCode: code },
      });
    },
    onSuccess: () => {
      setPhoneVerified(true);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified.",
      });
      setCurrentStep(1);
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest('/api/kyc/upload-document', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      setDocumentUploaded(true);
      toast({
        title: "Documents Uploaded",
        description: "Your identity documents have been uploaded successfully.",
      });
      setCurrentStep(2);
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitBiometricMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest('/api/kyc/submit-biometric', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      setBiometricCaptured(true);
      toast({
        title: "KYC Complete",
        description: "Your identity verification is now under review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Failed to submit biometric data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendOTP = () => {
    if (kycData.phoneNumber) {
      sendOTPMutation.mutate(kycData.phoneNumber);
    }
  };

  const handleVerifyOTP = () => {
    if (kycData.phoneNumber && kycData.verificationCode) {
      verifyOTPMutation.mutate({
        phone: kycData.phoneNumber,
        code: kycData.verificationCode,
      });
    }
  };

  const handleDocumentUpload = () => {
    if (kycData.documentType && kycData.documentNumber && kycData.documentFront) {
      const formData = new FormData();
      formData.append('documentType', kycData.documentType);
      formData.append('documentNumber', kycData.documentNumber);
      formData.append('documentFront', kycData.documentFront);
      if (kycData.documentBack) {
        formData.append('documentBack', kycData.documentBack);
      }
      uploadDocumentMutation.mutate(formData);
    }
  };

  const handleBiometricSubmit = () => {
    if (kycData.selfiePhoto) {
      const formData = new FormData();
      formData.append('selfiePhoto', kycData.selfiePhoto);
      submitBiometricMutation.mutate(formData);
    }
  };

  const updateKYCData = (field: keyof KYCData, value: string | File | null) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof KYCData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateKYCData(field, file);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Phone Verification</h2>
              <p className="text-neutral-600">We need to verify your phone number for security</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={kycData.phoneNumber}
                  onChange={(e) => updateKYCData('phoneNumber', e.target.value)}
                  placeholder="+234 123 456 7890"
                />
              </div>
              
              <Button 
                onClick={handleSendOTP}
                disabled={!kycData.phoneNumber || sendOTPMutation.isPending}
                className="w-full"
              >
                {sendOTPMutation.isPending ? "Sending..." : "Send Verification Code"}
              </Button>
              
              {sendOTPMutation.isSuccess && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      value={kycData.verificationCode}
                      onChange={(e) => updateKYCData('verificationCode', e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={!kycData.verificationCode || verifyOTPMutation.isPending}
                    className="w-full"
                  >
                    {verifyOTPMutation.isPending ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Identity Documents</h2>
              <p className="text-neutral-600">Upload a valid government-issued ID</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="docType">Document Type</Label>
                <Select value={kycData.documentType} onValueChange={(value) => updateKYCData('documentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">International Passport</SelectItem>
                    <SelectItem value="national_id">National ID Card</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="voter_card">Voter's Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="docNumber">Document Number</Label>
                <Input
                  id="docNumber"
                  value={kycData.documentNumber}
                  onChange={(e) => updateKYCData('documentNumber', e.target.value)}
                  placeholder="Enter document number"
                />
              </div>
              
              <div>
                <Label htmlFor="docFront">Document Front</Label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 mb-2">
                    {kycData.documentFront ? kycData.documentFront.name : "Upload front side"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('documentFront', e)}
                    className="hidden"
                    id="docFront"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="docFront" className="cursor-pointer">Choose File</label>
                  </Button>
                </div>
              </div>
              
              {kycData.documentType !== 'passport' && (
                <div>
                  <Label htmlFor="docBack">Document Back (Optional)</Label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600 mb-2">
                      {kycData.documentBack ? kycData.documentBack.name : "Upload back side"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('documentBack', e)}
                      className="hidden"
                      id="docBack"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="docBack" className="cursor-pointer">Choose File</label>
                    </Button>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleDocumentUpload}
                disabled={!kycData.documentType || !kycData.documentNumber || !kycData.documentFront || uploadDocumentMutation.isPending}
                className="w-full"
              >
                {uploadDocumentMutation.isPending ? "Uploading..." : "Upload Documents"}
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Biometric Verification</h2>
              <p className="text-neutral-600">Take a clear selfie for facial verification</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Photo Guidelines:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure good lighting</li>
                  <li>• Face the camera directly</li>
                  <li>• Remove glasses and hat</li>
                  <li>• Keep a neutral expression</li>
                  <li>• Make sure your face is clearly visible</li>
                </ul>
              </div>
              
              <div>
                <Label htmlFor="selfie">Selfie Photo</Label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 mb-3">
                    {kycData.selfiePhoto ? kycData.selfiePhoto.name : "Take or upload a selfie"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileUpload('selfiePhoto', e)}
                    className="hidden"
                    id="selfie"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="selfie" className="cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Selfie
                    </label>
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleBiometricSubmit}
                disabled={!kycData.selfiePhoto || submitBiometricMutation.isPending}
                className="w-full"
              >
                {submitBiometricMutation.isPending ? "Submitting..." : "Complete Verification"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">KYC Verification</CardTitle>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-100 text-green-600' :
                      index === currentStep ? 'bg-primary text-white' :
                      'bg-neutral-200 text-neutral-400'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-neutral-600">{step.description}</p>
                    </div>
                    <Badge variant={
                      step.status === 'completed' ? 'default' :
                      index === currentStep ? 'secondary' : 'outline'
                    }>
                      {step.status === 'completed' ? 'Complete' :
                       index === currentStep ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">Need Help?</p>
                <p className="text-amber-800">
                  Contact our support team if you encounter any issues during verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}