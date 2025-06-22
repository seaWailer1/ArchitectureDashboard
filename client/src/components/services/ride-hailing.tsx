import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Car, 
  MapPin, 
  Navigation, 
  Clock,
  DollarSign,
  Star,
  Phone,
  Shield,
  Users,
  Timer,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RideType {
  id: string;
  name: string;
  description: string;
  icon: any;
  basePrice: number;
  pricePerKm: number;
  capacity: number;
  eta: string;
  features: string[];
  vehicleTypes: string[];
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  vehicleModel: string;
  plateNumber: string;
  photoUrl?: string;
}

interface Ride {
  id: string;
  type: string;
  from: string;
  to: string;
  driver?: Driver;
  status: 'requesting' | 'accepted' | 'pickup' | 'in_progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: string;
  requestedAt: string;
  completedAt?: string;
}

export default function RideHailing() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRideType, setSelectedRideType] = useState<RideType | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [showRideDialog, setShowRideDialog] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rideTypes: RideType[] = [
    {
      id: "economy",
      name: "AfriRide Economy",
      description: "Affordable rides for everyday travel",
      icon: Car,
      basePrice: 2.50,
      pricePerKm: 0.85,
      capacity: 4,
      eta: "3-5 min",
      features: ["AC", "Safety verified"],
      vehicleTypes: ["Sedan", "Hatchback"]
    },
    {
      id: "comfort",
      name: "AfriRide Comfort", 
      description: "Premium vehicles with extra comfort",
      icon: Car,
      basePrice: 3.50,
      pricePerKm: 1.20,
      capacity: 4,
      eta: "5-8 min",
      features: ["Premium AC", "Leather seats", "Phone charger", "Water"],
      vehicleTypes: ["SUV", "Premium Sedan"]
    },
    {
      id: "share",
      name: "AfriRide Share",
      description: "Share your ride and split the cost",
      icon: Users,
      basePrice: 1.50,
      pricePerKm: 0.60,
      capacity: 2,
      eta: "8-12 min", 
      features: ["Shared ride", "Eco-friendly", "Meet new people"],
      vehicleTypes: ["Sedan", "Hatchback"]
    },
    {
      id: "moto",
      name: "AfriMoto",
      description: "Quick motorcycle rides for short trips",
      icon: Navigation,
      basePrice: 1.00,
      pricePerKm: 0.45,
      capacity: 1,
      eta: "2-4 min",
      features: ["Helmet provided", "Beat traffic", "Express delivery"],
      vehicleTypes: ["Motorcycle", "Scooter"]
    },
    {
      id: "xl",
      name: "AfriRide XL",
      description: "Extra space for groups and luggage",
      icon: Car,
      basePrice: 4.00,
      pricePerKm: 1.50,
      capacity: 6,
      eta: "6-10 min",
      features: ["6 seats", "Large trunk", "Family friendly"],
      vehicleTypes: ["Van", "Large SUV"]
    },
    {
      id: "luxury",
      name: "AfriRide Luxury",
      description: "Premium luxury experience",
      icon: Car,
      basePrice: 8.00,
      pricePerKm: 2.50,
      capacity: 4,
      eta: "8-15 min",
      features: ["Luxury vehicle", "Professional driver", "Refreshments", "Wi-Fi"],
      vehicleTypes: ["Mercedes", "BMW", "Audi"]
    }
  ];

  const mockDriver: Driver = {
    id: "DRV_001",
    name: "Kwame Asante",
    rating: 4.8,
    totalRides: 1247,
    vehicleModel: "Toyota Corolla 2020",
    plateNumber: "LAG-123-ABC"
  };

  const { data: rideHistory = [] } = useQuery<Ride[]>({
    queryKey: ["/api/rides/history"],
  });

  const requestRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      await apiRequest("POST", "/api/rides/request", rideData);
    },
    onSuccess: (data: any) => {
      setCurrentRide({
        id: Date.now().toString(),
        type: selectedRideType?.name || "Economy",
        from: pickupLocation,
        to: destination,
        status: 'requesting',
        fare: estimatedFare || 0,
        distance: 8.5,
        duration: "18 min",
        requestedAt: new Date().toISOString()
      });
      setShowRideDialog(true);
      toast({
        title: "Ride Requested",
        description: "Looking for nearby drivers...",
      });
      
      // Simulate ride acceptance after 3 seconds
      setTimeout(() => {
        setCurrentRide(prev => prev ? {
          ...prev,
          status: 'accepted',
          driver: mockDriver
        } : null);
        toast({
          title: "Ride Accepted",
          description: "Your driver is on the way!",
        });
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Failed to request ride",
        variant: "destructive",
      });
    },
  });

  const cancelRideMutation = useMutation({
    mutationFn: async (rideId: string) => {
      await apiRequest("POST", `/api/rides/${rideId}/cancel`);
    },
    onSuccess: () => {
      setCurrentRide(null);
      setShowRideDialog(false);
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been cancelled",
      });
    }
  });

  useEffect(() => {
    if (pickupLocation && destination && selectedRideType) {
      // Simulate fare calculation
      const distance = Math.random() * 15 + 2; // 2-17 km
      const fare = selectedRideType.basePrice + (distance * selectedRideType.pricePerKm);
      setEstimatedFare(fare);
    } else {
      setEstimatedFare(null);
    }
  }, [pickupLocation, destination, selectedRideType]);

  const handleRequestRide = () => {
    if (!pickupLocation || !destination || !selectedRideType) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all ride details",
        variant: "destructive",
      });
      return;
    }

    requestRideMutation.mutate({
      rideTypeId: selectedRideType.id,
      pickupLocation,
      destination,
      estimatedFare
    });
  };

  const simulateRideProgress = () => {
    if (!currentRide) return;

    const statuses: Array<Ride['status']> = ['pickup', 'in_progress', 'completed'];
    const currentIndex = statuses.indexOf(currentRide.status as any);
    
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      setCurrentRide(prev => prev ? { ...prev, status: nextStatus } : null);
      
      const messages = {
        pickup: "Driver has arrived at pickup location",
        in_progress: "Ride in progress",
        completed: "Ride completed successfully"
      };
      
      toast({
        title: "Ride Update",
        description: messages[nextStatus],
      });

      if (nextStatus === 'completed') {
        setTimeout(() => {
          setCurrentRide(null);
          setShowRideDialog(false);
          queryClient.invalidateQueries({ queryKey: ["/api/rides/history"] });
        }, 2000);
      }
    }
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
      case 'in_progress': return 'bg-blue/10 text-blue';
      case 'accepted': case 'pickup': return 'bg-accent/10 text-accent';
      case 'requesting': return 'bg-neutral-100 text-neutral-600';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'requesting': return 'Finding drivers...';
      case 'accepted': return 'Driver assigned';
      case 'pickup': return 'Driver arriving';
      case 'in_progress': return 'En route';
      case 'completed': return 'Trip completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">AfriRide</h2>
        <p className="text-neutral-600">Safe, reliable rides across Africa</p>
      </div>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book">Book Ride</TabsTrigger>
          <TabsTrigger value="history">Trip History</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          {/* Location Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Where to?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Destination</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ride Types */}
          {pickupLocation && destination && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Ride</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rideTypes.map((rideType) => {
                    const Icon = rideType.icon;
                    const isSelected = selectedRideType?.id === rideType.id;
                    return (
                      <Button
                        key={rideType.id}
                        variant={isSelected ? "default" : "outline"}
                        className="w-full h-auto p-4 justify-start"
                        onClick={() => setSelectedRideType(rideType)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6" />
                            <div className="text-left">
                              <p className="font-medium">{rideType.name}</p>
                              <p className="text-xs text-neutral-600">{rideType.description}</p>
                              <div className="flex items-center space-x-2 text-xs text-neutral-500">
                                <span className="flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {rideType.capacity}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {rideType.eta}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatCurrency(rideType.basePrice + (8.5 * rideType.pricePerKm))}
                            </p>
                            <p className="text-xs text-neutral-500">{rideType.eta}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fare Estimate */}
          {estimatedFare && selectedRideType && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Estimated Fare</span>
                  <span className="text-xl font-bold">{formatCurrency(estimatedFare)}</span>
                </div>
                <div className="text-sm text-neutral-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Base fare:</span>
                    <span>{formatCurrency(selectedRideType.basePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance (8.5 km):</span>
                    <span>{formatCurrency(8.5 * selectedRideType.pricePerKm)}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleRequestRide}
                  disabled={requestRideMutation.isPending}
                  className="w-full mt-4"
                >
                  {requestRideMutation.isPending ? "Requesting..." : "Request Ride"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Ride Dialog */}
          <Dialog open={showRideDialog} onOpenChange={setShowRideDialog}>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Your Ride</DialogTitle>
              </DialogHeader>
              {currentRide && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge className={`mb-2 ${getStatusColor(currentRide.status)}`}>
                      {getStatusMessage(currentRide.status)}
                    </Badge>
                    <p className="text-sm text-neutral-600">
                      {currentRide.from} → {currentRide.to}
                    </p>
                  </div>

                  {currentRide.driver && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                            <Car className="w-6 h-6 text-neutral-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{currentRide.driver.name}</p>
                            <div className="flex items-center space-x-1">
                              {renderStars(currentRide.driver.rating)}
                              <span className="text-xs text-neutral-600">
                                ({currentRide.driver.totalRides} trips)
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600">
                              {currentRide.driver.vehicleModel} • {currentRide.driver.plateNumber}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-neutral-600">Distance</p>
                      <p className="font-bold">{currentRide.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Duration</p>
                      <p className="font-bold">{currentRide.duration}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {currentRide.status === 'requesting' ? (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => cancelRideMutation.mutate(currentRide.id)}
                      >
                        Cancel Request
                      </Button>
                    ) : currentRide.status !== 'completed' && currentRide.status !== 'cancelled' ? (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={simulateRideProgress}
                        >
                          <Timer className="w-4 h-4 mr-2" />
                          Simulate Progress
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => cancelRideMutation.mutate(currentRide.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : null}
                  </div>

                  {currentRide.status === 'completed' && (
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="font-medium text-success">Trip Completed!</p>
                      <p className="text-sm text-neutral-600">Total: {formatCurrency(currentRide.fare)}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              {rideHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No trips yet</p>
                  <p className="text-sm text-neutral-500">Your ride history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rideHistory.map((ride) => (
                    <div key={ride.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{ride.from}</p>
                          <p className="text-sm text-neutral-600">to {ride.to}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(ride.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(ride.status)}>
                            {ride.status}
                          </Badge>
                          <p className="font-bold mt-1">{formatCurrency(ride.fare)}</p>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-600 flex items-center justify-between">
                        <span>{ride.distance} km • {ride.duration}</span>
                        <span>{ride.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Safety Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                  <Shield className="w-6 h-6 text-success" />
                  <div>
                    <p className="font-medium">Driver Background Checks</p>
                    <p className="text-sm text-neutral-600">All drivers verified and screened</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue" />
                  <div>
                    <p className="font-medium">Real-time Tracking</p>
                    <p className="text-sm text-neutral-600">Share your trip with family and friends</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                  <Phone className="w-6 h-6 text-accent" />
                  <div>
                    <p className="font-medium">24/7 Support</p>
                    <p className="text-sm text-neutral-600">Emergency support available anytime</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Emergency Contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}