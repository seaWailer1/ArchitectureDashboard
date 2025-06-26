import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FaBox, 
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaEye,
  FaCommentDots,
  FaArrowLeft,
  FaMapMarkerAlt
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  seller: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery?: string;
  deliveryAddress: string;
  trackingNumber?: string;
  paymentMethod: string;
  orderNotes?: string;
}

export default function CustomerOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "ORD_2024_001",
      items: [
        {
          id: "ITEM_001",
          productId: "PROD_001",
          name: "Wireless Bluetooth Headphones",
          price: 89.99,
          quantity: 1,
          seller: "TechStore Africa"
        },
        {
          id: "ITEM_002",
          productId: "PROD_002",
          name: "FaPhone Case",
          price: 15.99,
          quantity: 2,
          seller: "AccessoryHub"
        }
      ],
      total: 121.97,
      status: 'shipped',
      orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryAddress: "123 Main Street, Lagos, Nigeria",
      trackingNumber: "AFR123456789",
      paymentMethod: "AfriPay FaWallet"
    },
    {
      id: "ORD_2024_002",
      items: [
        {
          id: "ITEM_003",
          productId: "PROD_003",
          name: "African Print Dress",
          price: 45.00,
          quantity: 1,
          seller: "Afrocentric Styles"
        }
      ],
      total: 45.00,
      status: 'delivered',
      orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryAddress: "456 Oak Avenue, Accra, Ghana",
      trackingNumber: "AFR987654321",
      paymentMethod: "Virtual Card"
    },
    {
      id: "ORD_2024_003",
      items: [
        {
          id: "ITEM_004",
          productId: "PROD_004",
          name: "Natural Shea Butter",
          price: 18.50,
          quantity: 3,
          seller: "Natural Beauty Co"
        }
      ],
      total: 55.50,
      status: 'processing',
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryAddress: "789 Pine Road, Nairobi, Kenya",
      paymentMethod: "AfriPay FaWallet"
    }
  ];

  const { data: orders = mockOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'shipped': return 'bg-blue/10 text-blue';
      case 'processing': return 'bg-accent/10 text-accent';
      case 'confirmed': return 'bg-purple/10 text-purple';
      case 'pending': return 'bg-neutral-100 text-neutral-600';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <FaCheckCircle className="w-4 h-4" />;
      case 'shipped': return <FaTruck className="w-4 h-4" />;
      case 'processing': case 'confirmed': return <FaBox className="w-4 h-4" />;
      case 'pending': return <FaClock className="w-4 h-4" />;
      default: return <FaBox className="w-4 h-4" />;
    }
  };

  const getOrderProgress = (status: string) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  if (showOrderDetail && selectedOrder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowOrderDetail(false);
              setSelectedOrder(null);
            }}
          >
            <FaArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-bold text-lg">Order Details</h2>
        </div>

        {/* Order Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Order #{selectedOrder.id}</h3>
                <p className="text-sm text-neutral-600">
                  Placed on {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getStatusColor(selectedOrder.status)}>
                {getStatusIcon(selectedOrder.status)}
                <span className="ml-1 capitalize">{selectedOrder.status}</span>
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-600 mb-2">
                <span>Order Progress</span>
                <span>{selectedOrder.status}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getOrderProgress(selectedOrder.status)}%` }}
                />
              </div>
            </div>

            {selectedOrder.trackingNumber && (
              <div className="bg-blue/10 p-3 rounded-lg">
                <p className="text-sm font-medium">Tracking Number</p>
                <p className="font-mono text-lg">{selectedOrder.trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <FaBox className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-neutral-600">Sold by {item.seller}</p>
                    <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-neutral-600">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-neutral-400 mt-1" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-neutral-600">{selectedOrder.deliveryAddress}</p>
                </div>
              </div>
              
              {selectedOrder.estimatedDelivery && (
                <div className="flex items-start space-x-3">
                  <FaTruck className="w-5 h-5 text-neutral-400 mt-1" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-neutral-600">
                      {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <FaBox className="w-5 h-5 text-neutral-400 mt-1" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-neutral-600">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          {selectedOrder.status === 'delivered' && (
            <Button className="flex-1">
              <FaStar className="w-4 h-4 mr-2" />
              Rate & Review
            </Button>
          )}
          <Button variant="outline" className="flex-1">
            <FaCommentDots className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
          {['pending', 'confirmed'].includes(selectedOrder.status) && (
            <Button variant="destructive" className="flex-1">
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaBox className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">My Orders</h2>
        <p className="text-neutral-600">Track and manage your orders</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Order History ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FaBox className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="font-medium mb-2">No active orders</h3>
                <p className="text-neutral-600 text-sm">Your active orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold">Order #{order.id}</h4>
                        <p className="text-sm text-neutral-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="font-bold mt-1">{formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mb-3">
                      <div className="w-full bg-neutral-200 rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${getOrderProgress(order.status)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetail(true);
                        }}
                      >
                        <FaEye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.trackingNumber && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <FaTruck className="w-4 h-4 mr-2" />
                          Track FaBox
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FaCheckCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="font-medium mb-2">No completed orders</h3>
                <p className="text-neutral-600 text-sm">Your completed orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold">Order #{order.id}</h4>
                        <p className="text-sm text-neutral-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="font-bold mt-1">{formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetail(true);
                        }}
                      >
                        <FaEye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <FaStar className="w-4 h-4 mr-2" />
                          Rate & Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="flex-1">
                        Buy Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}