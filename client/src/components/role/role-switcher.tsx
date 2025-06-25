import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Store, Handshake } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { UserProfile } from "@/types";

export default function RoleSwitcher() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest("PUT", "/api/user/role", { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Role switched successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to switch role",
        variant: "destructive",
      });
    },
  });

  const roles = [
    { 
      id: "consumer", 
      label: t('consumer'), 
      icon: User 
    },
    { 
      id: "merchant", 
      label: t('merchant'), 
      icon: Store 
    },
    { 
      id: "agent", 
      label: t('agent'), 
      icon: Handshake 
    },
  ];

  const handleRoleSwitch = (roleId: string) => {
    if (roleId !== user?.currentRole) {
      switchRoleMutation.mutate(roleId);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = role.id === user?.currentRole;
            
            return (
              <Button
                key={role.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "text-neutral-600 hover:bg-white"
                )}
                onClick={() => handleRoleSwitch(role.id)}
                disabled={switchRoleMutation.isPending}
              >
                <Icon className="w-3 h-3 mr-2" />
                {role.label}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
