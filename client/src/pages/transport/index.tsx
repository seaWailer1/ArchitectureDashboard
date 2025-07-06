import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, MapPin, Clock, Users, Truck, Bike, Star, Navigation } from "lucide-react";

export default function TransportIndex() {
  const [, navigate] = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const transportServices = [
    {
      id: 'ride',
      name: 'Book Ride',
      icon: Car,
      color: 'bg-blue-100 text-blue-800',
      description: 'Car rides & taxi services',
      estimatedTime: '3-8 mins',
      basePrice: 'From ₦500',
      popular: true
    },
    {
      id: 'delivery',
      name: 'Package Delivery',
      icon: Truck,
      color: 'bg-green-100 text-green-800',
      description: 'Send packages & documents',
      estimatedTime: '15-45 mins',
      basePrice: 'From ₦300',
      popular: false
    },
    {
      id: 'bike',
      name: 'Bike Ride',
      icon: Bike,
      color: 'bg-orange-100 text-orange-800',
      description: 'Quick motorcycle rides',
      estimatedTime: '2-5 mins',
      basePrice: 'From ₦200',
      popular: true
    }
  ];

  const vehicleTypes = [
    {
      id: 'economy',
      name: 'AfriRide Economy',
      description: 'Affordable rides for everyday trips',
      capacity: '1-4 passengers',
      estimatedPrice: '₦500-800',
      estimatedTime: '5-8 mins',
      icon: '🚗',
      popular: true
    },
    {
      id: 'comfort',
      name: 'AfriRide Comfort',
      description: 'More space and comfort',
      capacity: '1-4 passengers',
      estimatedPrice: '₦800-1200',
      estimatedTime: '3-6 mins',
      icon: '🚙',
      popular: false
    },
    {
      id: 'xl',
      name: 'AfriRide XL',
      description: 'Bigger cars for groups',
      capacity: '1-6 passengers',
      estimatedPrice: '₦1200-1800',
      estimatedTime: '5-10 mins',
      icon: '🚐',
      popular: false
    },
    {
      id: 'premium',
      name: 'AfriRide Premium',
      description: 'Luxury cars and professional drivers',
      capacity: '1-4 passengers',
      estimatedPrice: '₦2000-3500',
      estimatedTime: '3-8 mins',
      icon: '🚘',
      popular: false
    }
  ];

  const recentTrips = [
    {
      id: 1,
      from: 'Victoria Island',
      to: 'Lekki Phase 1',
      date: '2 hours ago',
      amount: 1250,
      type: 'economy',
      status: 'completed'
    },
    {
      id: 2,
      from: 'Ikeja',
      to: 'VI',
      date: '1 day ago',
      amount: 2100,
      type: 'comfort',
      status: 'completed'
    },
    {
      id: 3,
      from: 'Surulere',
      to: 'Ikeja',
      date: '2 days ago',
      amount: 950,
      type: 'economy',
      status: 'completed'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    navigate(`/transport/booking?service=${serviceId}`);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    navigate(`/transport/booking?service=ride&vehicle=${vehicleId}`);
  };

  const handleRepeatTrip = (tripId: number) => {
    const trip = recentTrips.find(t => t.id === tripId);
    if (trip) {
      navigate(`/transport/booking?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&vehicle=${trip.type}`);
    }
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
            <h1 className="font-bold text-lg">Transport</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Book rides & delivery</p>
          </div>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Book */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={() => navigate('/transport/booking')}
              className="w-full h-16 text-lg flex items-center space-x-3"
            >
              <MapPin className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Where to?</div>
                <div className="text-sm opacity-80">Enter your destination</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Transport Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transport Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transportServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{service.name}</h3>
                          {service.popular && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{service.estimatedTime}</span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">
                            {service.basePrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleTypes.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleVehicleSelect(vehicle.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
                      {vehicle.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{vehicle.name}</h3>
                        {vehicle.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {vehicle.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{vehicle.capacity}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{vehicle.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{vehicle.estimatedPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{trip.from} → {trip.to}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {trip.date} • ₦{trip.amount}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRepeatTrip(trip.id)}
                  >
                    Repeat
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 flex items-center space-x-2"
            onClick={() => navigate('/transport/schedule')}
          >
            <Clock className="w-4 h-4" />
            <span>Schedule Ride</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-12 flex items-center space-x-2"
            onClick={() => navigate('/transport/history')}
          >
            <MapPin className="w-4 h-4" />
            <span>Trip History</span>
          </Button>
        </div>
      </div>
    </div>
  );
}