import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database, RefreshCw, Users, Store, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function DemoDataSeeder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const seedDataMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest("POST", "/api/seed-demo-data", { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Demo Data Created",
        description: "Sample financial data has been added to your account",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Create Demo Data",
        description: "There was an error creating sample data",
        variant: "destructive",
      });
    },
  });

  const roleOptions = [
    {
      role: "consumer",
      title: "Consumer Profile",
      description: "Personal wallet with savings, basic crypto holdings, and simple transactions",
      icon: Users,
      color: "bg-blue-100 text-blue-700"
    },
    {
      role: "merchant",
      title: "Merchant Profile", 
      description: "Business wallet with payment processing, investments, and credit facilities",
      icon: Store,
      color: "bg-green-100 text-green-700"
    },
    {
      role: "agent",
      title: "Agent Profile",
      description: "Agent wallet with commission tracking, float management, and multiple investments",
      icon: Handshake,
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Demo Data Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-600">
          Generate realistic sample data to explore different wallet features and user profiles.
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.role}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                disabled={seedDataMutation.isPending}
                onClick={() => seedDataMutation.mutate(option.role)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-neutral-600">{option.description}</p>
                  </div>
                  {seedDataMutation.isPending && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg">
          <p className="font-medium mb-1">What gets created:</p>
          <ul className="space-y-1">
            <li>• Multiple wallet types (Primary, Savings, Crypto, Investment)</li>
            <li>• Sample cryptocurrency holdings (BTC, ETH, USDC)</li>
            <li>• Investment products with realistic returns</li>
            <li>• Credit facilities (for merchants and agents)</li>
            <li>• Transaction history relevant to each role</li>
            <li>• Role-specific business data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}