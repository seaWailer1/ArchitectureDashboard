import React, { useState } from 'react';
import { AccessibleHeading, AccessibleButton, StatusMessage, AccessibleProgress, LiveRegion } from '@/components/ui/accessibility';
import { WCAGInput, WCAGSelect, WCAGTextarea, WCAGCheckbox } from '@/components/ui/wcag-form';
import { AccessibilityChecker } from '@/components/ui/accessibility-checker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';

export default function AccessibilityDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    message: '',
    newsletter: false,
    terms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const countryOptions = [
    { value: 'ng', label: 'Nigeria' },
    { value: 'gh', label: 'Ghana' },
    { value: 'ke', label: 'Kenya' },
    { value: 'za', label: 'South Africa' },
    { value: 'eg', label: 'Egypt' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required for account creation';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage('Please correct the errors below');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    
    // Simulate form submission with progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsSubmitting(false);
    setSubmitMessage('Form submitted successfully! Thank you for your feedback.');
    setProgress(0);
  };

  const simulateProgressUpdate = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <AccessibleHeading level={1}>
              WCAG AAA Accessibility Demo
            </AccessibleHeading>
            <p className="text-aaa-large text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This page demonstrates comprehensive WCAG AAA compliance features including 
              enhanced color contrast, keyboard navigation, screen reader support, and 
              accessible form controls.
            </p>
          </div>

          <Tabs defaultValue="forms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="forms" 
                className="text-aaa-normal font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Accessible Forms
              </TabsTrigger>
              <TabsTrigger 
                value="components" 
                className="text-aaa-normal font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                UI Components
              </TabsTrigger>
              <TabsTrigger 
                value="checker" 
                className="text-aaa-normal font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Accessibility Audit
              </TabsTrigger>
            </TabsList>

            {/* Accessible Forms Tab */}
            <TabsContent value="forms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <AccessibleHeading level={2} className="mb-0">
                      WCAG AAA Enhanced Form
                    </AccessibleHeading>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <WCAGInput
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      error={errors.name}
                      description="Enter your first and last name as they appear on your ID"
                      required
                      placeholder="John Doe"
                    />

                    <WCAGInput
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      error={errors.email}
                      description="We'll use this to send you important account updates"
                      required
                      placeholder="john@example.com"
                    />

                    <WCAGSelect
                      label="Country of Residence"
                      value={formData.country}
                      onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                      options={countryOptions}
                      error={errors.country}
                      description="Select the country where you currently reside"
                      required
                      placeholder="Choose your country"
                    />

                    <WCAGTextarea
                      label="Message or Feedback"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      error={errors.message}
                      description="Share your thoughts, suggestions, or questions with us"
                      characterLimit={500}
                      required
                      placeholder="Tell us what you think about our accessibility features..."
                      rows={4}
                    />

                    <WCAGCheckbox
                      label="Subscribe to newsletter updates"
                      checked={formData.newsletter}
                      onChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
                      description="Receive monthly updates about new features and improvements"
                    />

                    <WCAGCheckbox
                      label="I accept the terms and conditions"
                      checked={formData.terms}
                      onChange={(checked) => setFormData(prev => ({ ...prev, terms: checked }))}
                      error={errors.terms}
                      required
                      description="Please review our terms of service and privacy policy"
                    />

                    <div className="flex gap-4">
                      <AccessibleButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                      </AccessibleButton>

                      <AccessibleButton
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => {
                          setFormData({
                            name: '',
                            email: '',
                            country: '',
                            message: '',
                            newsletter: false,
                            terms: false
                          });
                          setErrors({});
                          setSubmitMessage('');
                        }}
                      >
                        Reset Form
                      </AccessibleButton>
                    </div>

                    {submitMessage && (
                      <StatusMessage 
                        type={Object.keys(errors).length > 0 ? 'error' : 'success'}
                      >
                        {submitMessage}
                      </StatusMessage>
                    )}

                    {isSubmitting && (
                      <AccessibleProgress 
                        value={progress} 
                        label="Form submission progress"
                        showValue={true}
                      />
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UI Components Tab */}
            <TabsContent value="components" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <AccessibleHeading level={2} className="mb-0">
                      Accessible UI Components
                    </AccessibleHeading>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Headings Hierarchy */}
                  <div className="space-y-4">
                    <AccessibleHeading level={3}>
                      Heading Hierarchy Example
                    </AccessibleHeading>
                    <AccessibleHeading level={4}>
                      This is a level 4 heading
                    </AccessibleHeading>
                    <AccessibleHeading level={5}>
                      This is a level 5 heading
                    </AccessibleHeading>
                    <AccessibleHeading level={6}>
                      This is a level 6 heading
                    </AccessibleHeading>
                  </div>

                  {/* Button Variants */}
                  <div className="space-y-4">
                    <AccessibleHeading level={3}>
                      Button Variants
                    </AccessibleHeading>
                    <div className="flex flex-wrap gap-4">
                      <AccessibleButton variant="primary">
                        Primary Action
                      </AccessibleButton>
                      <AccessibleButton variant="secondary">
                        Secondary Action
                      </AccessibleButton>
                      <AccessibleButton variant="destructive">
                        Delete Action
                      </AccessibleButton>
                      <AccessibleButton variant="ghost">
                        Ghost Button
                      </AccessibleButton>
                      <AccessibleButton variant="primary" disabled>
                        Disabled Button
                      </AccessibleButton>
                    </div>
                  </div>

                  {/* Status Messages */}
                  <div className="space-y-4">
                    <AccessibleHeading level={3}>
                      Status Messages
                    </AccessibleHeading>
                    <div className="space-y-4">
                      <StatusMessage type="success">
                        Your account has been successfully verified and activated.
                      </StatusMessage>
                      <StatusMessage type="warning">
                        Your session will expire in 5 minutes. Please save your work.
                      </StatusMessage>
                      <StatusMessage type="error">
                        Unable to process payment. Please check your card details.
                      </StatusMessage>
                      <StatusMessage type="info">
                        New security features have been added to protect your account.
                      </StatusMessage>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="space-y-4">
                    <AccessibleHeading level={3}>
                      Progress Indicators
                    </AccessibleHeading>
                    <div className="space-y-4">
                      <AccessibleProgress 
                        value={25} 
                        label="Profile completion"
                        showValue={true}
                      />
                      <AccessibleProgress 
                        value={75} 
                        label="Document verification"
                        showValue={true}
                      />
                      <AccessibleProgress 
                        value={100} 
                        label="Account setup"
                        showValue={true}
                      />
                      <div className="flex gap-4">
                        <AccessibleButton 
                          variant="ghost"
                          onClick={simulateProgressUpdate}
                        >
                          Simulate Progress
                        </AccessibleButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessibility Checker Tab */}
            <TabsContent value="checker" className="space-y-6">
              <AccessibilityChecker />
            </TabsContent>
          </Tabs>

          {/* Live Region for Dynamic Updates */}
          <LiveRegion politeness="polite">
            {submitMessage && `Form status: ${submitMessage}`}
          </LiveRegion>
        </div>
      </main>

      <BottomNavigation currentPage="accessibility-demo" />
    </div>
  );
}