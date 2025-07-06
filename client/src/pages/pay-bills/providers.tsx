import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Star, Zap, Tv, Wifi, Droplets, Car, Building } from "lucide-react";

export default function PayBillsProviders() {
  const [, navigate] = useLocation();
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCategory(urlParams.get('category') || '');
  }, []);

  const categoryInfo = {
    electricity: {
      name: 'Electricity',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-800',
      providers: [
        { id: 'ibedc', name: 'Ibadan Electricity Distribution Company', code: 'IBEDC', popular: true, fee: 'Free' },
        { id: 'ekedc', name: 'Eko Electricity Distribution Company', code: 'EKEDC', popular: true, fee: 'Free' },
        { id: 'aedc', name: 'Abuja Electricity Distribution Company', code: 'AEDC', popular: false, fee: 'Free' },
        { id: 'phed', name: 'Port Harcourt Electricity Distribution', code: 'PHED', popular: false, fee: 'Free' },
        { id: 'kedco', name: 'Kano Electricity Distribution Company', code: 'KEDCO', popular: false, fee: 'Free' },
        { id: 'yedc', name: 'Yola Electricity Distribution Company', code: 'YEDC', popular: false, fee: 'Free' }
      ]
    },
    'cable-tv': {
      name: 'Cable TV',
      icon: Tv,
      color: 'bg-blue-100 text-blue-800',
      providers: [
        { id: 'dstv', name: 'DStv', code: 'DSTV', popular: true, fee: 'Free' },
        { id: 'gotv', name: 'GOtv', code: 'GOTV', popular: true, fee: 'Free' },
        { id: 'startimes', name: 'StarTimes', code: 'StarTimes', popular: false, fee: 'Free' },
        { id: 'mytv', name: 'MyTV', code: 'MyTV', popular: false, fee: 'Free' }
      ]
    },
    internet: {
      name: 'Internet',
      icon: Wifi,
      color: 'bg-green-100 text-green-800',
      providers: [
        { id: 'spectranet', name: 'Spectranet', code: 'Spectranet', popular: true, fee: 'Free' },
        { id: 'smile', name: 'Smile Communications', code: 'Smile', popular: false, fee: 'Free' },
        { id: 'swift', name: 'Swift Networks', code: 'Swift', popular: false, fee: 'Free' },
        { id: 'ipnx', name: 'IPNX Nigeria', code: 'IPNX', popular: false, fee: 'Free' }
      ]
    },
    water: {
      name: 'Water',
      icon: Droplets,
      color: 'bg-blue-100 text-blue-600',
      providers: [
        { id: 'lagoswater', name: 'Lagos Water Corporation', code: 'LWC', popular: true, fee: 'Free' },
        { id: 'abujawater', name: 'Abuja Water Board', code: 'AWB', popular: false, fee: 'Free' }
      ]
    },
    transport: {
      name: 'Transport',
      icon: Car,
      color: 'bg-purple-100 text-purple-800',
      providers: [
        { id: 'cowry', name: 'Cowry Card', code: 'Cowry', popular: true, fee: 'Free' },
        { id: 'lagbus', name: 'Lagos Bus Service', code: 'LagBus', popular: false, fee: 'Free' }
      ]
    },
    government: {
      name: 'Government',
      icon: Building,
      color: 'bg-gray-100 text-gray-800',
      providers: [
        { id: 'firs', name: 'Federal Inland Revenue Service', code: 'FIRS', popular: true, fee: 'Free' },
        { id: 'lasrra', name: 'Lagos State Resident Registration Agency', code: 'LASRRA', popular: false, fee: 'Free' },
        { id: 'vin', name: 'Vehicle Inspection Office', code: 'VIO', popular: false, fee: 'Free' }
      ]
    }
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo];
  const IconComponent = currentCategory?.icon || Zap;

  const filteredProviders = currentCategory?.providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleProviderSelect = (providerId: string) => {
    navigate(`/pay-bills/account?category=${category}&provider=${providerId}`);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Category not found</p>
          <Button onClick={() => navigate('/pay-bills')} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/pay-bills')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">{currentCategory.name} Bills</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select your service provider</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Category Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentCategory.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">{currentCategory.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentCategory.providers.length} providers available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Providers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="search">Search by name or code</Label>
              <Input
                id="search"
                placeholder="Enter provider name or code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Providers List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentCategory.color}`}>
                      <IconComponent className="w-6 h-6" />
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
                        Code: {provider.code}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs text-green-600">
                      {provider.fee}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProviders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No providers found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}