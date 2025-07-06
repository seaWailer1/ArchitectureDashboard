import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Star, Zap, Percent } from "lucide-react";

export default function BuyAirtimeIndex() {
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const providers = [
    {
      id: 'mtn',
      name: 'MTN',
      logo: '🟡',
      color: 'bg-yellow-100 text-yellow-800',
      discount: '5% off',
      popular: true
    },
    {
      id: 'airtel',
      name: 'Airtel',
      logo: '🔴',
      color: 'bg-red-100 text-red-800',
      discount: '3% off',
      popular: false
    },
    {
      id: 'glo',
      name: 'Glo',
      logo: '🟢',
      color: 'bg-green-100 text-green-800',
      discount: '2% off',
      popular: false
    },
    {
      id: 'etisalat',
      name: '9mobile',
      logo: '🟣',
      color: 'bg-purple-100 text-purple-800',
      discount: '4% off',
      popular: false
    }
  ];

  const quickAmounts = [
    { amount: 100, bonus: '10MB' },
    { amount: 200, bonus: '25MB' },
    { amount: 500, bonus: '100MB' },
    { amount: 1000, bonus: '500MB' },
    { amount: 2000, bonus: '1GB' },
    { amount: 5000, bonus: '3GB' }
  ];

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    navigate(`/buy-airtime/amount?provider=${providerId}`);
  };

  const handleQuickTopup = (amount: number) => {
    navigate(`/buy-airtime/confirm?amount=${amount}&provider=mtn`);
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
            <h1 className="font-bold text-lg">Buy Airtime</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Top up mobile credit</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Top-up */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Top-up</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Instant top-up for your last used number
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.slice(0, 4).map((item) => (
                <Button
                  key={item.amount}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={() => handleQuickTopup(item.amount)}
                >
                  <span className="font-semibold">₦{item.amount}</span>
                  <span className="text-xs text-green-600">+{item.bonus}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Providers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Select Network</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
                      {provider.logo}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{provider.name}</h3>
                        {provider.popular && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Nigeria's leading network
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${provider.color} text-xs`}>
                      <Percent className="w-3 h-3 mr-1" />
                      {provider.discount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Top-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Top-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    🟡
                  </div>
                  <div>
                    <p className="font-medium">+234 803 123 4567</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">MTN • 2 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦500</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    Repeat
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    🔴
                  </div>
                  <div>
                    <p className="font-medium">+234 805 987 6543</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Airtel • 5 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦1,000</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    Repeat
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}