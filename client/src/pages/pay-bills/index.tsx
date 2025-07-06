import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Tv, Wifi, Droplets, Car, Building, Clock } from "lucide-react";

export default function PayBillsIndex() {
  const [, navigate] = useLocation();

  const billCategories = [
    {
      id: 'electricity',
      name: 'Electricity',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Pay power bills',
      providers: ['IBEDC', 'EKEDC', 'AEDC', 'PHED'],
      popular: true
    },
    {
      id: 'cable-tv',
      name: 'Cable TV',
      icon: Tv,
      color: 'bg-blue-100 text-blue-800',
      description: 'Cable & satellite TV',
      providers: ['DSTV', 'GOTV', 'StarTimes'],
      popular: true
    },
    {
      id: 'internet',
      name: 'Internet',
      icon: Wifi,
      color: 'bg-green-100 text-green-800',
      description: 'Internet subscriptions',
      providers: ['Spectranet', 'Smile', 'Swift'],
      popular: false
    },
    {
      id: 'water',
      name: 'Water',
      icon: Droplets,
      color: 'bg-blue-100 text-blue-600',
      description: 'Water utility bills',
      providers: ['Lagos Water', 'Abuja Water'],
      popular: false
    },
    {
      id: 'transport',
      name: 'Transport',
      icon: Car,
      color: 'bg-purple-100 text-purple-800',
      description: 'Transport cards & tolls',
      providers: ['Cowry Card', 'LagBus'],
      popular: false
    },
    {
      id: 'government',
      name: 'Government',
      icon: Building,
      color: 'bg-gray-100 text-gray-800',
      description: 'Taxes & fees',
      providers: ['FIRS', 'LASRRA', 'VIN'],
      popular: false
    }
  ];

  const recentBills = [
    {
      id: 1,
      category: 'electricity',
      provider: 'IBEDC',
      accountNumber: '1234567890',
      amount: 8500,
      dueDate: '2024-07-15',
      status: 'due'
    },
    {
      id: 2,
      category: 'cable-tv',
      provider: 'DSTV',
      accountNumber: '0987654321',
      amount: 4200,
      dueDate: '2024-07-20',
      status: 'upcoming'
    },
    {
      id: 3,
      category: 'internet',
      provider: 'Spectranet',
      accountNumber: '5555666677',
      amount: 15000,
      dueDate: '2024-07-25',
      status: 'upcoming'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/pay-bills/providers?category=${categoryId}`);
  };

  const handleQuickPay = (billId: number) => {
    const bill = recentBills.find(b => b.id === billId);
    if (bill) {
      navigate(`/pay-bills/confirm?provider=${bill.provider}&account=${bill.accountNumber}&amount=${bill.amount}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'due': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/services')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Pay Bills</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pay utilities & services</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Recent Bills - Quick Pay */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Bills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBills.map((bill) => {
                const daysUntilDue = getDaysUntilDue(bill.dueDate);
                const category = billCategories.find(c => c.id === bill.category);
                const IconComponent = category?.icon || Zap;
                
                return (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{bill.provider}</p>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status === 'due' ? 'Due Now' : `${daysUntilDue} days`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {bill.accountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{bill.amount.toLocaleString()}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={() => handleQuickPay(bill.id)}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bill Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bill Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {billCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="relative p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                        Popular
                      </Badge>
                    )}
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {category.providers.length} providers
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 flex items-center justify-between"
                onClick={() => navigate('/pay-bills/search')}
              >
                <span>Search by Account Number</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-12 flex items-center justify-between"
                onClick={() => navigate('/pay-bills/history')}
              >
                <span>Payment History</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}