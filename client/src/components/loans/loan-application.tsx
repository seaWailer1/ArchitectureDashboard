import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCreditCard, Calculator, FaFileAlt, Shield } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function LoanApplication() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loanMutation = useMutation({
    mutationFn: async (loanData: any) => {
      await apiRequest("POST", "/api/loans/apply", loanData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted for review",
      });
      setAmount("");
      setDuration("");
      setPurpose("");
    },
    onError: () => {
      toast({
        title: "Application Failed",
        description: "Failed to submit loan application",
        variant: "destructive",
      });
    },
  });

  const calculateLoan = () => {
    if (!amount || !duration) return null;
    
    const principal = parseFloat(amount);
    const months = parseInt(duration);
    const annualRate = 0.15; // 15% annual interest rate
    const monthlyRate = annualRate / 12;
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  };

  const handleSubmit = () => {
    if (!amount || !duration || !purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const calculation = calculateLoan();
    if (!calculation) return;

    loanMutation.mutate({
      amount: parseFloat(amount),
      duration: parseInt(duration),
      purpose,
      monthlyPayment: parseFloat(calculation.monthlyPayment),
      interestRate: 15.0
    });
  };

  const loanCalculation = calculateLoan();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaCreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Micro Loan Application</h2>
        <p className="text-neutral-600">Get quick access to affordable credit</p>
      </div>

      {/* Loan Features */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Shield className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-semibold text-neutral-900">Secure</p>
            <p className="text-xs text-neutral-600">Bank-level security</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Calculator className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="font-semibold text-neutral-900">15% APR</p>
            <p className="text-xs text-neutral-600">Competitive rates</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaFileAlt className="w-5 h-5 mr-2" />
            Loan Application
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-900">Loan Amount (USD)</label>
            <Input
              type="number"
              placeholder="Enter amount (50 - 5,000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-900">Duration</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-900">Purpose</label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business Investment</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="home">Home Improvement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loan Calculator */}
          {amount && duration && loanCalculation && (
            <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-neutral-900">Loan Calculation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Payment:</span>
                  <span className="font-semibold">${loanCalculation.monthlyPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest:</span>
                  <span className="font-semibold text-accent">${loanCalculation.totalInterest}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payment:</span>
                  <span className="font-semibold">${loanCalculation.totalPayment}</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSubmit}
            disabled={loanMutation.isPending || !amount || !duration || !purpose}
            className="w-full"
          >
            {loanMutation.isPending ? "Submitting..." : "Apply for Loan"}
          </Button>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Badge className="bg-success/10 text-success">✓</Badge>
              <span className="text-sm">Verified AfriPay account</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-success/10 text-success">✓</Badge>
              <span className="text-sm">Completed KYC verification</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-accent/10 text-accent">!</Badge>
              <span className="text-sm">Minimum 3 months transaction history</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-accent/10 text-accent">!</Badge>
              <span className="text-sm">Credit score evaluation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}