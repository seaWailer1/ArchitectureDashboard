import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Package, 
  MapPin, 
  Clock, 
  DollarSign,
  Truck,
  User,
  Phone,
  Camera,
  CheckCircle,
  AlertCircle,
  Star,
  Navigation,
  Shield,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DeliveryType {
  id: string;
  name: string;
  description: string;
  icon: any;
  basePrice: number;
  pricePerKm: number;
  pricePerKg: number;
  maxWeight: number;
  eta: string;
  vehicleType: string;
}

interface Delivery {
  id: string;
  type: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  packageDescription: string;
  weight: number;
  value: number;
  courier?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType: string;
    plateNumber: string;
  };
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  cost: number;
  distance: number;
  estimatedDelivery: string;
  createdAt: string;
  proofOfDelivery?: {
    signature?: string;
    photo?: string;
    otp?: string;
    timestamp: string;
  };
}

export default function DeliveryService() {
  const [senderDetails, setSenderDetails] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [recipientDetails, setRecipientDetails] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [packageDetails, setPackageDetails] = useState({
    description: "",
    weight: "",
    value: "",
    fragile: false,
    urgent: false
  });
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<DeliveryType | null>(null);
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deliveryTypes: DeliveryType[] = [
    {
      id: "motorbike",
      name: "Motorbike Delivery",
      description: "Fast delivery for small packages",
      icon: Navigation,
      basePrice: 2.00,
      pricePerKm: 0.50,
      pricePerKg: 0.25,
      maxWeight: 20,
      eta: "30-60 min",
      vehicleType: "Motorbike"
    },
    {
      id: "bicycle",
      name: "Bicycle Delivery",
      description: "Eco-friendly delivery for light items",
      icon: Navigation,
      basePrice: 1.50,
      pricePerKm: 0.30,
      pricePerKg: 0.20,
      maxWeight: 10,
      eta: "45-90 min",
      vehicleType: "Bicycle"
    },
    {
      id: "car",
      name: "Car Delivery",
      description: "Secure delivery for larger packages",
      icon: Car,
      basePrice: 3.50,
      pricePerKm: 0.80,
      pricePerKg: 0.30,
      maxWeight: 50,
      eta: "60-120 min",
      vehicleType: "Car"
    },
    {
      id: "van",
      name: "Van Delivery",
      description: "Bulk delivery for multiple items",
      icon: Truck,
      basePrice: 5.00,
      pricePerKm: 1.20,
      pricePerKg: 0.40,
      maxWeight: 200,
      eta: "90-180 min",
      vehicleType: "Van"
    }
  ];

  const { data: deliveryHistory = [] } = useQuery<Delivery[]>({
    queryKey: ["/api/delivery/history"],
  });

  const createDeliveryMutation = useMutation({
    mutationFn: async (deliveryData: any) => {
      await apiRequest("POST", "/api/delivery/create", deliveryData);
    },
    onSuccess: (data: any) => {
      setCurrentDelivery({
        id: Date.now().toString(),
        type: selectedDeliveryType?.name || "Standard",
        ...senderDetails,
        senderName: senderDetails.name,
        senderPhone: senderDetails.phone,
        senderAddress: senderDetails.address,
        ...recipientDetails,
        recipientName: recipientDetails.name,
        recipientPhone: recipientDetails.phone,
        recipientAddress: recipientDetails.address,
        packageDescription: packageDetails.description,
        weight: parseFloat(packageDetails.weight),
        value: parseFloat(packageDetails.value),
        status: 'pending',
        cost: estimatedCost || 0,
        distance: 8.5,
        estimatedDelivery: selectedDeliveryType?.eta || "60 min",
        createdAt: new Date().toISOString()
      });
      setShowTrackingDialog(true);
      toast({
        title: "Delivery Requested",
        description: "Finding nearby couriers...",
      });

      // Simulate courier assignment
      setTimeout(() => {
        setCurrentDelivery(prev => prev ? {
          ...prev,
          status: 'assigned',
          courier: {
            id: "COU_001",
            name: "Samuel Okafor",
            phone: "+234 801 234 5678",
            rating: 4.7,
            vehicleType: selectedDeliveryType?.vehicleType || "Motorbike",
            plateNumber: "LAG-456-XYZ"
          }
        } : null);
        toast({
          title: "Courier Assigned",
          description: "Your courier is heading to pickup location",
        });
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Failed to create delivery request",
        variant: "destructive",
      });
    },
  });

  const calculateCost = () => {
    if (!selectedDeliveryType || !packageDetails.weight) return;
    
    const weight = parseFloat(packageDetails.weight);
    const distance = 8.5; // Mock distance
    
    let cost = selectedDeliveryType.basePrice + 
               (distance * selectedDeliveryType.pricePerKm) + 
               (weight * selectedDeliveryType.pricePerKg);
    
    if (packageDetails.urgent) cost *= 1.5;
    if (packageDetails.fragile) cost += 2.00;
    
    setEstimatedCost(cost);
  };

  const handleCreateDelivery = () => {
    if (!senderDetails.name || !recipientDetails.name || !packageDetails.description || !selectedDeliveryType) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createDeliveryMutation.mutate({
      deliveryTypeId: selectedDeliveryType.id,
      senderDetails,
      recipientDetails,
      packageDetails,
      estimatedCost
    });
  };

  const simulateDeliveryProgress = () => {
    if (!currentDelivery) return;

    const statuses: Array<Delivery['status']> = ['picked_up', 'in_transit', 'delivered'];
    const currentIndex = statuses.indexOf(currentDelivery.status as any);
    
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      setCurrentDelivery(prev => prev ? { ...prev, status: nextStatus } : null);
      
      const messages = {
        picked_up: "Package picked up from sender",
        in_transit: "Package is on the way",
        delivered: "Package delivered successfully"
      };
      
      toast({
        title: "Delivery Update",
        description: messages[nextStatus],
      });

      if (nextStatus === 'delivered') {
        setCurrentDelivery(prev => prev ? {
          ...prev,
          proofOfDelivery: {
            signature: "Digital signature captured",
            photo: "Delivery photo taken",
            otp: "123456",
            timestamp: new Date().toISOString()
          }
        } : null);
        
        setTimeout(() => {
          setCurrentDelivery(null);
          setShowTrackingDialog(false);
          queryClient.invalidateQueries({ queryKey: ["/api/delivery/history"] });
        }, 3000);
      }
    }
  };

  // Calculate cost when relevant fields change
  useEffect(() => {
    calculateCost();
  }, [selectedDeliveryType, packageDetails.weight, packageDetails.urgent, packageDetails.fragile]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'in_transit': return 'bg-blue/10 text-blue';
      case 'picked_up': return 'bg-accent/10 text-accent';
      case 'assigned': return 'bg-purple/10 text-purple';
      case 'pending': return 'bg-neutral-100 text-neutral-600';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Finding courier...';
      case 'assigned': return 'Courier assigned';
      case 'picked_up': return 'Package picked up';
      case 'in_transit': return 'On the way';
      case 'delivered': return 'Delivered';
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
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">AfriDeliver</h2>
        <p className="text-neutral-600">Fast, reliable package delivery across Africa</p>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send Package</TabsTrigger>
          <TabsTrigger value="track">Track Delivery</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          {/* Sender Details */}
          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Your name"
                value={senderDetails.name}
                onChange={(e) => setSenderDetails({...senderDetails, name: e.target.value})}
              />
              <Input
                placeholder="Your phone number"
                value={senderDetails.phone}
                onChange={(e) => setSenderDetails({...senderDetails, phone: e.target.value})}
              />
              <Textarea
                placeholder="Pickup address"
                value={senderDetails.address}
                onChange={(e) => setSenderDetails({...senderDetails, address: e.target.value})}
              />
            </CardContent>
          </Card>

          {/* Recipient Details */}
          <Card>
            <CardHeader>
              <CardTitle>Recipient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Recipient name"
                value={recipientDetails.name}
                onChange={(e) => setRecipientDetails({...recipientDetails, name: e.target.value})}
              />
              <Input
                placeholder="Recipient phone number"
                value={recipientDetails.phone}
                onChange={(e) => setRecipientDetails({...recipientDetails, phone: e.target.value})}
              />
              <Textarea
                placeholder="Delivery address"
                value={recipientDetails.address}
                onChange={(e) => setRecipientDetails({...recipientDetails, address: e.target.value})}
              />
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Package description (required for courier)"
                value={packageDetails.description}
                onChange={(e) => setPackageDetails({...packageDetails, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  value={packageDetails.weight}
                  onChange={(e) => setPackageDetails({...packageDetails, weight: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Declared value ($)"
                  value={packageDetails.value}
                  onChange={(e) => setPackageDetails({...packageDetails, value: e.target.value})}
                />
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={packageDetails.fragile}
                    onChange={(e) => setPackageDetails({...packageDetails, fragile: e.target.checked})}
                  />
                  <span className="text-sm">Fragile (+$2)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={packageDetails.urgent}
                    onChange={(e) => setPackageDetails({...packageDetails, urgent: e.target.checked})}
                  />
                  <span className="text-sm">Urgent (+50%)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Types */}
          {packageDetails.weight && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Delivery Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliveryTypes
                    .filter(type => !packageDetails.weight || parseFloat(packageDetails.weight) <= type.maxWeight)
                    .map((deliveryType) => {
                    const Icon = deliveryType.icon;
                    const isSelected = selectedDeliveryType?.id === deliveryType.id;
                    return (
                      <Button
                        key={deliveryType.id}
                        variant={isSelected ? "default" : "outline"}
                        className="w-full h-auto p-4 justify-start"
                        onClick={() => setSelectedDeliveryType(deliveryType)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6" />
                            <div className="text-left">
                              <p className="font-medium">{deliveryType.name}</p>
                              <p className="text-xs text-neutral-600">{deliveryType.description}</p>
                              <p className="text-xs text-neutral-500">Max: {deliveryType.maxWeight}kg</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{deliveryType.eta}</p>
                            <p className="text-xs text-neutral-500">{deliveryType.vehicleType}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Estimate */}
          {estimatedCost && selectedDeliveryType && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Estimated Cost</span>
                  <span className="text-xl font-bold">{formatCurrency(estimatedCost)}</span>
                </div>
                <div className="text-sm text-neutral-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Base fare:</span>
                    <span>{formatCurrency(selectedDeliveryType.basePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance (8.5 km):</span>
                    <span>{formatCurrency(8.5 * selectedDeliveryType.pricePerKm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight ({packageDetails.weight} kg):</span>
                    <span>{formatCurrency(parseFloat(packageDetails.weight) * selectedDeliveryType.pricePerKg)}</span>
                  </div>
                  {packageDetails.fragile && (
                    <div className="flex justify-between">
                      <span>Fragile handling:</span>
                      <span>{formatCurrency(2.00)}</span>
                    </div>
                  )}
                  {packageDetails.urgent && (
                    <div className="flex justify-between">
                      <span>Urgent delivery (50%):</span>
                      <span>{formatCurrency((estimatedCost / 1.5) * 0.5)}</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleCreateDelivery}
                  disabled={createDeliveryMutation.isPending}
                  className="w-full mt-4"
                >
                  {createDeliveryMutation.isPending ? "Creating..." : "Book Delivery"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Delivery Dialog */}
          <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Track Your Delivery</DialogTitle>
              </DialogHeader>
              {currentDelivery && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge className={`mb-2 ${getStatusColor(currentDelivery.status)}`}>
                      {getStatusMessage(currentDelivery.status)}
                    </Badge>
                    <p className="text-sm text-neutral-600">
                      Delivery ID: #{currentDelivery.id}
                    </p>
                  </div>

                  {currentDelivery.courier && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-neutral-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{currentDelivery.courier.name}</p>
                            <div className="flex items-center space-x-1">
                              {renderStars(currentDelivery.courier.rating)}
                              <span className="text-xs text-neutral-600">
                                ({currentDelivery.courier.rating})
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600">
                              {currentDelivery.courier.vehicleType} • {currentDelivery.courier.plateNumber}
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
                      <p className="font-bold">{currentDelivery.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">ETA</p>
                      <p className="font-bold">{currentDelivery.estimatedDelivery}</p>
                    </div>
                  </div>

                  {currentDelivery.status !== 'delivered' && currentDelivery.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={simulateDeliveryProgress}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Simulate Progress
                    </Button>
                  )}

                  {currentDelivery.status === 'delivered' && currentDelivery.proofOfDelivery && (
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="font-medium text-success">Package Delivered!</p>
                      <p className="text-sm text-neutral-600">OTP: {currentDelivery.proofOfDelivery.otp}</p>
                      <p className="text-xs text-neutral-500">
                        Delivered at {new Date(currentDelivery.proofOfDelivery.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="track" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Track Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Enter delivery ID" />
                <Button className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Track Package
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
            </CardHeader>
            <CardContent>
              {deliveryHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No deliveries yet</p>
                  <p className="text-sm text-neutral-500">Your delivery history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deliveryHistory.map((delivery) => (
                    <div key={delivery.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">To: {delivery.recipientName}</p>
                          <p className="text-sm text-neutral-600">{delivery.packageDescription}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(delivery.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status}
                          </Badge>
                          <p className="font-bold mt-1">{formatCurrency(delivery.cost)}</p>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-600">
                        ID: #{delivery.id} • {delivery.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}