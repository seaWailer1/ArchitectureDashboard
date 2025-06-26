import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Navigation, 
  MapPin, 
  Clock, 
  DollarSign,
  FaPhone,
  MessageSquare,
  FaCamera,
  FaCheckCircle,
  FaExclamationCircle,
  Package,
  Truck,
  Bike,
  Car,
  User,
  Star,
  Battery,
  Wifi,
  Volume2,
  Settings,
  BarChart3,
  Calendar,
  Target,
  TrendingUp
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: any[];
  totalAmount: number;
  deliveryFee: number;
  status: string;
  estimatedTime: number;
  distance: number;
  specialInstructions?: string;
  paymentMethod: string;
  storeInfo: {
    name: string;
    phone: string;
    preparationTime: number;
  };
}

interface DriverStats {
  totalDeliveries: number;
  rating: number;
  earnings: {
    today: number;
    week: number;
    month: number;
  };
  completionRate: number;
  onlineTime: number;
}

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 6.5244, lng: 3.3792 }); // Lagos coordinates
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock driver stats
  const driverStats: DriverStats = {
    totalDeliveries: 247,
    rating: 4.8,
    earnings: {
      today: 45.80,
      week: 312.50,
      month: 1248.90
    },
    completionRate: 98.5,
    onlineTime: 6.5 // hours today
  };

  // Mock available orders
  const mockOrders: DeliveryOrder[] = [
    {
      id: 1,
      orderNumber: "ORD-001",
      customerName: "Amina Hassan",
      customerPhone: "+234 801 234 5678",
      pickupAddress: "Mama's Kitchen, Victoria Island, Lagos",
      deliveryAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
      items: [
        { name: "Jollof Rice with Chicken", quantity: 2 },
        { name: "Plantain", quantity: 1 }
      ],
      totalAmount: 33.00,
      deliveryFee: 4.50,
      status: "ready_for_pickup",
      estimatedTime: 25,
      distance: 8.5,
      specialInstructions: "Call when you arrive. Gate number 15B",
      paymentMethod: "digital_wallet",
      storeInfo: {
        name: "Mama's Kitchen",
        phone: "+234 901 234 5678",
        preparationTime: 5
      }
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      customerName: "David Okoro",
      customerPhone: "+234 802 345 6789",
      pickupAddress: "Fresh Market, Ikeja, Lagos",
      deliveryAddress: "23 Allen Avenue, Ikeja, Lagos",
      items: [
        { name: "Fresh Tomatoes", quantity: 2 },
        { name: "Onions", quantity: 1 },
        { name: "Peppers", quantity: 3 }
      ],
      totalAmount: 18.50,
      deliveryFee: 2.50,
      status: "preparing",
      estimatedTime: 35,
      distance: 4.2,
      paymentMethod: "cash",
      storeInfo: {
        name: "Fresh Market",
        phone: "+234 902 345 6789",
        preparationTime: 15
      }
    }
  ];

  const [availableOrders, setAvailableOrders] = useState(mockOrders);

  const { data: orders = availableOrders } = useQuery({
    queryKey: ["/api/driver/orders", isOnline],
    enabled: isOnline,
  });

  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: (_, orderId) => {
      const order = availableOrders.find(o => o.id === orderId);
      if (order) {
        setActiveDelivery({ ...order, status: "heading_to_pickup" });
        setAvailableOrders(prev => prev.filter(o => o.id !== orderId));
        toast({
          title: "Order Accepted",
          description: "Navigate to pickup location",
        });
      }
    },
  });

  const updateDeliveryStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: (_, { status }) => {
      if (activeDelivery) {
        setActiveDelivery(prev => prev ? { ...prev, status } : null);
        
        const statusMessages = {
          arrived_at_pickup: "You've arrived at pickup location",
          picked_up: "Order picked up successfully",
          heading_to_delivery: "Heading to delivery location",
          arrived_at_delivery: "You've arrived at delivery location",
          delivered: "Order delivered successfully"
        };

        toast({
          title: "Status Updated",
          description: statusMessages[status] || `Status updated to ${status}`,
        });

        if (status === "delivered") {
          setTimeout(() => {
            setActiveDelivery(null);
            queryClient.invalidateQueries({ queryKey: ["/api/driver/orders"] });
          }, 2000);
        }
      }
    },
  });

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast({
      title: isOnline ? "Going Offline" : "Going Online",
      description: isOnline ? "You'll stop receiving new orders" : "You're now available for orders",
    });
  };

  const handleAcceptOrder = (orderId: number) => {
    acceptOrderMutation.mutate(orderId);
  };

  const handleStatusUpdate = (status: string) => {
    if (activeDelivery) {
      updateDeliveryStatusMutation.mutate({ orderId: activeDelivery.id, status });
    }
  };

  const renderOrderCard = (order: DeliveryOrder) => (
    <Card key={order.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">{order.orderNumber}</h3>
            <p className="text-sm text-neutral-600">{order.customerName}</p>
          </div>
          <Badge className={
            order.status === "ready_for_pickup" ? "bg-green-500" :
            order.status === "preparing" ? "bg-yellow-500" : "bg-blue-500"
          }>
            {order.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-xs text-neutral-600">{order.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Delivery</p>
              <p className="text-xs text-neutral-600">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{order.estimatedTime} min</span>
            </div>
            <div className="flex items-center">
              <Navigation className="w-4 h-4 mr-1" />
              <span>{order.distance} km</span>
            </div>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="font-semibold">${order.deliveryFee}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleAcceptOrder(order.id)}
            disabled={acceptOrderMutation.isPending}
          >
            {acceptOrderMutation.isPending ? "Accepting..." : "Accept"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setActiveDelivery(order);
              setShowDeliveryDetails(true);
            }}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderActiveDelivery = () => {
    if (!activeDelivery) return null;

    const getNextAction = () => {
      switch (activeDelivery.status) {
        case "heading_to_pickup":
          return { text: "Arrived at Pickup", action: () => handleStatusUpdate("arrived_at_pickup") };
        case "arrived_at_pickup":
          return { text: "Picked Up", action: () => handleStatusUpdate("picked_up") };
        case "picked_up":
          return { text: "Head to Delivery", action: () => handleStatusUpdate("heading_to_delivery") };
        case "heading_to_delivery":
          return { text: "Arrived at Delivery", action: () => handleStatusUpdate("arrived_at_delivery") };
        case "arrived_at_delivery":
          return { text: "Mark as Delivered", action: () => handleStatusUpdate("delivered") };
        default:
          return null;
      }
    };

    const nextAction = getNextAction();

    return (
      <Card className="mb-6 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Delivery</span>
            <Badge className="bg-primary">{activeDelivery.status.replace("_", " ")}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">{activeDelivery.orderNumber}</h4>
              <p className="text-sm text-neutral-600">{activeDelivery.customerName}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pickup: {activeDelivery.storeInfo.name}</p>
                  <p className="text-xs text-neutral-600">{activeDelivery.pickupAddress}</p>
                </div>
                <Button variant="outline" size="sm">
                  <FaPhone className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Delivery to {activeDelivery.customerName}</p>
                  <p className="text-xs text-neutral-600">{activeDelivery.deliveryAddress}</p>
                </div>
                <Button variant="outline" size="sm">
                  <FaPhone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {activeDelivery.specialInstructions && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm"><strong>Special Instructions:</strong></p>
                <p className="text-sm">{activeDelivery.specialInstructions}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span>Delivery Fee: <strong>${activeDelivery.deliveryFee}</strong></span>
              <span>Payment: <strong>{activeDelivery.paymentMethod}</strong></span>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>

            {nextAction && (
              <Button 
                className="w-full" 
                onClick={nextAction.action}
                disabled={updateDeliveryStatusMutation.isPending}
              >
                {updateDeliveryStatusMutation.isPending ? "Updating..." : nextAction.text}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Driver Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Volume2 className="w-4 h-4" />
            </div>
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Status</p>
              <p className="font-semibold">{isOnline ? "Online" : "Offline"}</p>
            </div>
            <Switch
              checked={isOnline}
              onCheckedChange={toggleOnlineStatus}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="p-4">
            {/* Earnings Summary */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">${driverStats.earnings.today}</p>
                    <p className="text-xs text-neutral-600">Today</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{driverStats.totalDeliveries}</p>
                    <p className="text-xs text-neutral-600">Total Deliveries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold flex items-center justify-center">
                      {driverStats.rating}
                      <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    </p>
                    <p className="text-xs text-neutral-600">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Delivery */}
            {activeDelivery && renderActiveDelivery()}

            {/* Available Orders */}
            {isOnline && !activeDelivery && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Available Orders</h2>
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                      <p className="text-neutral-600">No orders available</p>
                      <p className="text-sm text-neutral-500">New orders will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map(renderOrderCard)}
                  </div>
                )}
              </div>
            )}

            {!isOnline && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                  <p className="text-neutral-600">You're currently offline</p>
                  <p className="text-sm text-neutral-500">Go online to start receiving orders</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="earnings" className="p-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Today</span>
                      <span className="font-semibold">${driverStats.earnings.today}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Week</span>
                      <span className="font-semibold">${driverStats.earnings.week}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-semibold">${driverStats.earnings.month}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-semibold">{driverStats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Online Time Today</span>
                      <span className="font-semibold">{driverStats.onlineTime}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-semibold flex items-center">
                        {driverStats.rating}
                        <Star className="w-4 h-4 text-yellow-400 ml-1" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                    <p className="text-neutral-600">Detailed analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Push Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sound Alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Auto-Accept Orders</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> Motorbike</p>
                    <p><strong>Model:</strong> Honda CG125</p>
                    <p><strong>Plate:</strong> LAG-456-XYZ</p>
                    <Button variant="outline" className="w-full mt-4">
                      Update Vehicle Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        <Dialog open={showDeliveryDetails} onOpenChange={setShowDeliveryDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            
            {activeDelivery && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">{activeDelivery.orderNumber}</h4>
                  <p className="text-sm text-neutral-600">{activeDelivery.customerName}</p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Items:</h5>
                  {activeDelivery.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span>${activeDelivery.totalAmount}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Your Earning:</span>
                    <span>${activeDelivery.deliveryFee}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}