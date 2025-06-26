import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  FaBolt, 
  Smartphone, 
  Wifi, 
  FaCar, 
  Home,
  CreditCard,
  Receipt,
  Calendar,
  Clock,
  Check
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BillService {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  description: string;
  fee: number;
}

interface BillPayment {
  id: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  accountNumber: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  reference: string;
}

export default function BillPayments() {
  const [selectedService, setSelectedService] = useState<BillService | null>(null);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [autoRenewal, setAutoRenewal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const billServices: BillService[] = [
    {
      id: "electricity",
      name: "Electricity",
      category: "utilities",
      icon: FaBolt,
      color: "bg-yellow-100 text-yellow-600",
      description: "Pay electricity bills",
      fee: 0.5
    },
    {
      id: "water",
      name: "Water",
      category: "utilities", 
      icon: Home,
      color: "bg-blue-100 text-blue-600",
      description: "Pay water bills",
      fee: 0.5
    },
    {
      id: "internet",
      name: "Internet",
      category: "telecom",
      icon: Wifi,
      color: "bg-purple-100 text-purple-600",
      description: "Internet subscriptions",
      fee: 1.0
    },
    {
      id: "mobile",
      name: "Mobile Airtime",
      category: "telecom",
      icon: Smartphone,
      color: "bg-green-100 text-green-600",
      description: "Mobile airtime top-up",
      fee: 0.25
    },
    {
      id: "cable",
      name: "Cable TV",
      category: "entertainment",
      icon: Receipt,
      color: "bg-red-100 text-red-600",
      description: "Cable TV subscriptions",
      fee: 1.0
    },
    {
      id: "insurance",
      name: "Insurance",
      category: "financial",
      icon: CreditCard,
      color: "bg-indigo-100 text-indigo-600",
      description: "Insurance premiums",
      fee: 2.0
    }
  ];

  const { data: recentPayments = [] } = useQuery<BillPayment[]>({
    queryKey: ["/api/bills/payments"],
  });

  const payBillMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      await apiRequest("POST", "/api/bills/pay", paymentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills/payments"] });
      toast({
        title: "Payment Successful",
        description: "Your bill payment has been processed",
      });
      setAmount("");
      setAccountNumber("");
      setPhoneNumber("");
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to process bill payment",
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    if (!selectedService || !amount) {
      toast({
        title: "Invalid Payment",
        description: "Please select a service and enter amount",
        variant: "destructive",
      });
      return;
    }

    const identifier = selectedService.category === 'telecom' ? phoneNumber : accountNumber;
    if (!identifier) {
      toast({
        title: "Missing Information",
        description: `Please enter ${selectedService.category === 'telecom' ? 'phone number' : 'account number'}`,
        variant: "destructive",
      });
      return;
    }

    payBillMutation.mutate({
      serviceId: selectedService.id,
      amount: parseFloat(amount),
      identifier,
      autoRenewal
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'pending': return 'bg-accent/10 text-accent';
      case 'failed': return 'bg-destructive/10 text-destructive';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'failed': return <FaBolt className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaBolt className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Bill Payments</h2>
        <p className="text-neutral-600">Pay all your bills in one place</p>
      </div>

      <Tabs defaultValue="pay" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pay">Pay Bills</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="pay" className="space-y-4">
          {/* Service Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Service</h3>
            <div className="grid grid-cols-2 gap-3">
              {billServices.map((service) => {
                const Icon = service.icon;
                return (
                  <Button
                    key={service.id}
                    variant={selectedService?.id === service.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col space-y-2 text-left"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-neutral-600">{service.description}</p>
                      <p className="text-xs text-neutral-500">Fee: {formatCurrency(service.fee)}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Payment Form */}
          {selectedService && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <selectedService.icon className="w-5 h-5" />
                  <span>Pay {selectedService.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {selectedService.category === 'telecom' ? (
                  <div>
                    <label className="text-sm font-medium mb-1 block">FaPhone Number</label>
                    <Input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Account Number</label>
                    <Input
                      type="text"
                      placeholder="Enter account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={autoRenewal}
                    onCheckedChange={setAutoRenewal}
                  />
                  <span className="text-sm">Set up auto-renewal</span>
                </div>

                {amount && (
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Amount</span>
                      <span>{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Service Fee</span>
                      <span>{formatCurrency(selectedService.fee)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(parseFloat(amount) + selectedService.fee)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={payBillMutation.isPending}
                  className="w-full"
                >
                  {payBillMutation.isPending ? "Processing..." : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No payment history yet</p>
                  <p className="text-sm text-neutral-500">Your bill payments will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.serviceName}</p>
                        <p className="text-sm text-neutral-600">{payment.accountNumber}</p>
                        <p className="text-xs text-neutral-500">
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(payment.amount)}</p>
                        <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </Badge>
                        <p className="text-xs text-neutral-500">#{payment.reference}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Scheduled Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600">No scheduled payments</p>
                <p className="text-sm text-neutral-500 mb-4">Set up auto-renewal to schedule payments</p>
                <Button variant="outline">
                  Set Up Auto-Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}