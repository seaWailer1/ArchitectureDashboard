import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Car, 
  MapPin, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Navigation,
  Star,
  Phone,
  MessageCircle,
  Bike,
  Truck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TransportProps {
  onBack: () => void;
}

export default function Transport({ onBack }: TransportProps) {
  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('now');
  const [customTime, setCustomTime] = useState('');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [rideStatus, setRideStatus] = useState('searching');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Vehicle types
  const vehicleTypes = [
    {
      id: 'economy',
      name: 'Economy',
      icon: Car,
      description: 'Affordable rides for everyday trips',
      capacity: 4,
      estimatedTime: '3-5 min',
      priceMultiplier: 1.0,
      features: ['AC', 'Music']
    },
    {
      id: 'comfort',
      name: 'Comfort',
      icon: Car,
      description: 'More spacious vehicles with premium features',
      capacity: 4,
      estimatedTime: '5-8 min',
      priceMultiplier: 1.3,
      features: ['AC', 'Premium Audio', 'Extra Legroom']
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: Car,
      description: 'High-end vehicles for special occasions',
      capacity: 4,
      estimatedTime: '8-12 min',
      priceMultiplier: 2.0,
      features: ['AC', 'Premium Audio', 'Leather Seats', 'WiFi']
    },
    {
      id: 'bike',
      name: 'Bike',
      icon: Bike,
      description: 'Quick rides for short distances',
      capacity: 1,
      estimatedTime: '2-4 min',
      priceMultiplier: 0.6,
      features: ['Helmet Provided', 'Quick Trips']
    },
    {
      id: 'shared',
      name: 'Shared',
      icon: Users,
      description: 'Share rides with others going your way',
      capacity: 3,
      estimatedTime: '5-10 min',
      priceMultiplier: 0.7,
      features: ['Cost Effective', 'Eco-Friendly']
    },
    {
      id: 'delivery',
      name: 'Delivery',
      icon: Truck,
      description: 'Send packages and documents',
      capacity: 0,
      estimatedTime: '10-15 min',
      priceMultiplier: 0.8,
      features: ['Package Delivery', 'Real-time Tracking']
    }
  ];

  // Mock locations for autocomplete
  const popularLocations = [
    'Victoria Island, Lagos',
    'Ikeja Airport, Lagos',
    'Lekki Phase 1, Lagos',
    'Marina, Lagos',
    'Yaba, Lagos',
    'Surulere, Lagos',
    'Ikoyi, Lagos',
    'Ajah, Lagos',
    'Festac Town, Lagos',
    'Gbagada, Lagos'
  ];

  const baseFare = 8.50;
  const distanceRate = 1.20; // per km
  const timeRate = 0.30; // per minute
  const estimatedDistance = 12; // km
  const estimatedDuration = 25; // minutes

  const calculateFare = (vehicleType: string) => {
    const vehicle = vehicleTypes.find(v => v.id === vehicleType);
    const multiplier = vehicle?.priceMultiplier || 1.0;
    const fare = (baseFare + (estimatedDistance * distanceRate) + (estimatedDuration * timeRate)) * multiplier;
    return fare;
  };

  // Book ride mutation
  const bookRideMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/transport/book', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (data) => {
      setBookingDetails(data);
      setStep(4);
      simulateDriverAssignment();
      toast({
        title: "Ride booked successfully!",
        description: "Finding a driver for you...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message || "Unable to book ride. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Simulate driver assignment and ride progress
  const simulateDriverAssignment = () => {
    setTimeout(() => {
      setDriverInfo({
        name: 'Kwame Asante',
        rating: 4.8,
        totalTrips: 1247,
        vehicle: 'Toyota Corolla - ABC 123 XY',
        plateNumber: 'ABC 123 XY',
        eta: '3 min',
        phone: '+233 244 567 890'
      });
      setRideStatus('driver_assigned');
    }, 3000);

    setTimeout(() => {
      setRideStatus('driver_arriving');
    }, 8000);

    setTimeout(() => {
      setRideStatus('ride_started');
    }, 15000);
  };

  const handleBookRide = () => {
    const selectedVehicleData = vehicleTypes.find(v => v.id === selectedVehicle);
    const fare = calculateFare(selectedVehicle);
    
    const bookingData = {
      pickupLocation,
      dropoffLocation,
      vehicleType: selectedVehicle,
      scheduledTime: scheduledTime === 'now' ? new Date() : new Date(customTime),
      estimatedFare: fare,
      estimatedDistance,
      estimatedDuration,
    };

    bookRideMutation.mutate(bookingData);
  };

  const selectedVehicleData = vehicleTypes.find(v => v.id === selectedVehicle);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Transport</h2>
          <p className="text-sm text-gray-600">Book rides and delivery services</p>
        </div>
      </div>

      {/* Step 1: Set Locations */}
      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Where to?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Pickup Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                  <Input
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Drop-off Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-red-500" />
                  <Input
                    placeholder="Enter destination"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Popular Locations */}
              <div>
                <Label className="text-sm text-gray-600">Popular Locations</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {popularLocations.slice(0, 4).map((location) => (
                    <Button
                      key={location}
                      variant="ghost"
                      size="sm"
                      className="justify-start h-auto p-2 text-left"
                      onClick={() => {
                        if (!pickupLocation) {
                          setPickupLocation(location);
                        } else if (!dropoffLocation) {
                          setDropoffLocation(location);
                        }
                      }}
                    >
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{location}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!pickupLocation || !dropoffLocation}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Select Vehicle and Schedule */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose Vehicle</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Navigation className="w-4 h-4" />
                <span>{estimatedDistance} km • {estimatedDuration} min</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {vehicleTypes.map((vehicle) => {
                  const Icon = vehicle.icon;
                  const fare = calculateFare(vehicle.id);
                  
                  return (
                    <div
                      key={vehicle.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedVehicle === vehicle.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-8 h-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{vehicle.name}</h4>
                            <p className="text-sm text-gray-600">{vehicle.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {vehicle.capacity > 0 ? `${vehicle.capacity} seats` : 'Delivery'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {vehicle.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${fare.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{vehicle.estimatedTime}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {vehicle.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <Label>Schedule</Label>
                <Select value={scheduledTime} onValueChange={setScheduledTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Leave Now</SelectItem>
                    <SelectItem value="schedule">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {scheduledTime === 'schedule' && (
                <div>
                  <Label>Pick Time</Label>
                  <Input
                    type="datetime-local"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="mt-2"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1"
                  disabled={!selectedVehicle}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-medium">{pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-medium">{dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle</span>
                    <span className="font-medium">{selectedVehicleData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">{estimatedDistance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{estimatedDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schedule</span>
                    <span className="font-medium">
                      {scheduledTime === 'now' ? 'Now' : new Date(customTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-600">Total Fare</span>
                    <span className="font-bold text-lg">${calculateFare(selectedVehicle).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Your driver will arrive in approximately {selectedVehicleData?.estimatedTime}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleBookRide} 
                  className="flex-1"
                  disabled={bookRideMutation.isPending}
                >
                  {bookRideMutation.isPending ? "Booking..." : "Book Ride"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Ride Status */}
      {step === 4 && (
        <div className="space-y-4">
          {rideStatus === 'searching' && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Finding your driver...</h3>
                <p className="text-gray-600">We're matching you with the best available driver</p>
              </CardContent>
            </Card>
          )}

          {rideStatus === 'driver_assigned' && driverInfo && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Driver Found!</h3>
                  <p className="text-gray-600">Your driver is on the way</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">{driverInfo.name.split(' ').map((n: string) => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{driverInfo.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(driverInfo.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{driverInfo.rating} • {driverInfo.totalTrips} trips</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="font-medium">{driverInfo.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ETA</span>
                      <span className="font-medium">{driverInfo.eta}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {rideStatus === 'driver_arriving' && (
            <Card>
              <CardContent className="text-center py-6">
                <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Driver Arriving</h3>
                <p className="text-gray-600">Your driver is almost here!</p>
                <p className="text-sm text-gray-500 mt-2">Look for {driverInfo?.vehicle}</p>
              </CardContent>
            </Card>
          )}

          {rideStatus === 'ride_started' && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <Navigation className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Ride in Progress</h3>
                  <p className="text-gray-600">Enjoy your trip!</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Estimated Arrival</span>
                    <span className="font-medium">{estimatedDuration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Fare</span>
                    <span className="font-bold">${calculateFare(selectedVehicle).toFixed(2)}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Driver
                </Button>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={onBack} className="w-full">
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}