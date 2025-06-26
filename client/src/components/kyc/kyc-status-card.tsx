import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/i18n";
import { UserProfile } from "@/types";

export default function KYCStatusCard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const updateVerificationMutation = useMutation({
    mutationFn: async ({ field, status }: { field: string; status: boolean }) => {
      await apiRequest("PUT", "/api/kyc/verification", { field, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Verification status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    },
  });

  const verificationSteps = [
    {
      id: "phoneVerified",
      label: t('phoneVerification'),
      completed: user?.phoneVerified || false,
      current: !user?.phoneVerified,
    },
    {
      id: "documentsVerified",
      label: t('identityDocuments'),
      completed: user?.documentsVerified || false,
      current: user?.phoneVerified && !user?.documentsVerified,
    },
    {
      id: "biometricVerified",
      label: t('biometricVerification'),
      completed: user?.biometricVerified || false,
      current: user?.documentsVerified && !user?.biometricVerified,
    },
  ];

  const handleContinueKYC = (field: string) => {
    // In a real app, this would open the appropriate verification flow
    updateVerificationMutation.mutate({ field, status: true });
  };

  const getKYCStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success';
      case 'in_progress':
        return 'bg-accent/10 text-accent';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <section className="mb-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-accent/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-neutral-900">{t('accountVerification')}</h3>
          <Badge className={getKYCStatusColor(user?.kycStatus)}>
            {user?.kycStatus === 'in_progress' ? t('inProgress') : user?.kycStatus || 'Pending'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {verificationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-success' 
                    : step.current 
                      ? 'bg-accent' 
                      : 'bg-neutral-200'
                }`}>
                  {step.completed ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : step.current ? (
                    <Clock className="w-3 h-3 text-white" />
                  ) : (
                    <span className="text-neutral-600 text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${
                  step.completed ? 'text-neutral-900' : 'text-neutral-600'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {step.completed ? (
                <Check className="w-4 h-4 text-success" />
              ) : step.current ? (
                <Button 
                  size="sm"
                  variant="ghost"
                  className="text-accent text-sm font-medium p-0 h-auto"
                  onClick={() => handleContinueKYC(step.id)}
                  disabled={updateVerificationMutation.isPending}
                >
                  {t('continue')}
                </Button>
              ) : (
                <span className="text-xs text-neutral-600">Pending</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
