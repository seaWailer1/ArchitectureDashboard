import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  FaShoppingCart, 
  Utensils, 
  FaBox, 
  Pill, 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar,
  FaTruck,
  FaBicycle,
  FaCar,
  FaSearch,
  FaFilter,
  FaPlus,
  FaMinus,
  FaHeart,
  FaShoppingBag,
  FaLocationArrow,
  FaPhone,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser,
  FaDollarSign,
  FaCamera,
  FaComment,
  ThumbsUp
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Store {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  totalReviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  tags: string[];
}

interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrls: string[];
  rating: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isHalal: boolean;
  preparationTime?: number;
  stock: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  customizations?: any;
  specialInstructions?: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  estimatedTime: string;
  price: number;
  vehicleType: string;
}

export default function IntegratedDeliveryHub() {
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showTracking, setShowTracking] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deliveryCategories = [
    { id: "food", name: "Food & Restaurants", icon: Utensils, color: "bg-orange-500" },
    { id: "grocery", name: "Groceries & Supermarkets", icon: FaShoppingCart, color: "bg-green-500" },
    { id: "pharmacy", name: "Pharmacy & Health", icon: Pill, color: "bg-blue-500" },
    { id: "retail", name: "Retail & Shopping", icon: FaBox, color: "bg-purple-500" },
  ];

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "motorbike",
      name: "Express Delivery",
      description: "Fast delivery with motorbike",
      icon: FaBicycle,
      estimatedTime: "20-35 min",
      price: 2.50,
      vehicleType: "motorbike"
    },
    {
      id: "bicycle",
      name: "Eco Delivery",
      description: "Environment-friendly bicycle delivery",
      icon: FaBicycle,
      estimatedTime: "35-50 min",
      price: 1.50,
      vehicleType: "bicycle"
    },
    {
      id: "car",
      name: "Premium Delivery",
      description: "Secure car delivery for larger orders",
      icon: FaCar,
      estimatedTime: "25-40 min",
      price: 4.00,
      vehicleType: "car"
    }
  ];

  // Simulated data for demonstration
  const mockStores: Store[] = [
    {
      id: 1,
      name: "Mama's Kitchen",
      category: "food",
      description: "Authentic African cuisine with home-style cooking",
      imageUrl: "/api/placeholder/300/200",
      rating: 4.8,
      totalReviews: 142,
      deliveryTime: "25-40 min",
      deliveryFee: 2.50,
      minimumOrder: 15.00,
      isOpen: true,
      tags: ["African", "Halal", "Vegetarian"]
    },
    {
      id: 2,
      name: "Fresh Market",
      category: "grocery",
      description: "Fresh produce and daily essentials",
      imageUrl: "/api/placeholder/300/200",
      rating: 4.6,
      totalReviews: 89,
      deliveryTime: "30-45 min",
      deliveryFee: 3.00,
      minimumOrder: 25.00,
      isOpen: true,
      tags: ["Fresh", "Organic", "Local"]
    },
    {
      id: 3,
      name: "HealthCare Pharmacy",
      category: "pharmacy",
      description: "Prescription drugs and health products",
      imageUrl: "/api/placeholder/300/200",
      rating: 4.9,
      totalReviews: 76,
      deliveryTime: "15-30 min",
      deliveryFee: 1.50,
      minimumOrder: 10.00,
      isOpen: true,
      tags: ["Prescription", "OTC", "Health"]
    },
    {
      id: 4,
      name: "Tech Electronics",
      category: "retail",
      description: "Latest electronics and gadgets",
      imageUrl: "/api/placeholder/300/200",
      rating: 4.7,
      totalReviews: 156,
      deliveryTime: "45-60 min",
      deliveryFee: 5.00,
      minimumOrder: 50.00,
      isOpen: true,
      tags: ["Electronics", "Gadgets", "Tech"]
    }
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      storeId: 1,
      name: "Jollof Rice with Chicken",
      description: "Perfectly seasoned jollof rice with grilled chicken",
      price: 12.50,
      originalPrice: 15.00,
      imageUrls: ["/api/placeholder/200/200"],
      rating: 4.9,
      isVegetarian: false,
      isVegan: false,
      isHalal: true,
      preparationTime: 20,
      stock: 15,
      category: "Main Course"
    },
    {
      id: 2,
      storeId: 1,
      name: "Vegetarian Plantain",
      description: "Sweet fried plantains with vegetables",
      price: 8.00,
      imageUrls: ["/api/placeholder/200/200"],
      rating: 4.6,
      isVegetarian: true,
      isVegan: true,
      isHalal: true,
      preparationTime: 15,
      stock: 25,
      category: "Vegetarian"
    },
    {
      id: 3,
      storeId: 2,
      name: "Fresh Tomatoes (1kg)",
      description: "Locally sourced fresh tomatoes",
      price: 3.50,
      imageUrls: ["/api/placeholder/200/200"],
      rating: 4.4,
      isVegetarian: true,
      isVegan: true,
      isHalal: true,
      stock: 50,
      category: "Vegetables"
    },
    {
      id: 4,
      storeId: 3,
      name: "Paracetamol 500mg",
      description: "Pain relief tablets, pack of 20",
      price: 5.00,
      imageUrls: ["/api/placeholder/200/200"],
      rating: 4.8,
      isVegetarian: true,
      isVegan: true,
      isHalal: true,
      stock: 100,
      category: "Pain Relief"
    }
  ];

  const { data: stores = mockStores } = useQuery({
    queryKey: ["/api/stores", selectedCategory],
  });

  const { data: products = mockProducts } = useQuery({
    queryKey: ["/api/products", selectedStore?.id],
    enabled: !!selectedStore,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        id: Date.now(),
        orderNumber: `ORD-${Date.now()}`,
        status: "confirmed",
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
        ...orderData
      };
    },
    onSuccess: (data) => {
      setActiveOrder(data);
      setShowCheckout(false);
      setShowTracking(true);
      setCart([]);
      toast({
        title: "Order Placed Successfully",
        description: `Order ${data.orderNumber} is being prepared`,
      });

      // Simulate order status updates
      setTimeout(() => {
        setActiveOrder(prev => ({ ...prev, status: "preparing" }));
        toast({ title: "Order Update", description: "Your order is being prepared" });
      }, 5000);

      setTimeout(() => {
        setActiveOrder(prev => ({ ...prev, status: "ready" }));
        toast({ title: "Order Update", description: "Your order is ready for pickup" });
      }, 15000);

      setTimeout(() => {
        setActiveOrder(prev => ({ ...prev, status: "picked_up" }));
        toast({ title: "Order Update", description: "Driver has picked up your order" });
      }, 20000);
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalWithDelivery = () => {
    const subtotal = getCartTotal();
    const deliveryFee = selectedDeliveryOption?.price || 0;
    return subtotal + deliveryFee;
  };

  const filteredStores = stores.filter(store => {
    const matchesCategory = store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlaceOrder = () => {
    if (!selectedDeliveryOption || !deliveryAddress || cart.length === 0) {
      toast({
        title: "Incomplete Order",
        description: "Please select delivery option and address",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      storeId: selectedStore?.id,
      items: cart,
      deliveryOption: selectedDeliveryOption,
      deliveryAddress,
      total: getTotalWithDelivery()
    });
  };

  const renderStoreCard = (store: Store) => (
    <Card 
      key={store.id} 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedStore(store)}
    >
      <div className="relative">
        <img 
          src={store.imageUrl} 
          alt={store.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <Badge className={store.isOpen ? "bg-green-500" : "bg-red-500"}>
            {store.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{store.name}</h3>
          <Button variant="ghost" size="sm">
            <FaHeart className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-neutral-600 mb-3">{store.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
          <div className="flex items-center">
            <FaStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span>{store.rating} ({store.totalReviews})</span>
          </div>
          <div className="flex items-center">
            <FaClock className="w-4 h-4 mr-1" />
            <span>{store.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Delivery: ${store.deliveryFee}</span>
          <span>Min: ${store.minimumOrder}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {store.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <img 
            src={product.imageUrls[0]} 
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">{product.name}</h4>
              <div className="text-right">
                <span className="font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through ml-2">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-neutral-600 mb-2">{product.description}</p>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                <FaStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm">{product.rating}</span>
              </div>
              {product.preparationTime && (
                <div className="flex items-center">
                  <FaClock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{product.preparationTime} min</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {product.isVegetarian && <Badge variant="outline" className="text-xs">Vegetarian</Badge>}
                {product.isVegan && <Badge variant="outline" className="text-xs">Vegan</Badge>}
                {product.isHalal && <Badge variant="outline" className="text-xs">Halal</Badge>}
              </div>
              
              <Button 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                size="sm"
              >
                <FaPlus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">AfriDeliver</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={() => setShowCart(true)}
              >
                <FaShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="ml-1 bg-red-500">{cart.length}</Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* FaSearch */}
          <div className="mt-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="FaSearch restaurants, stores, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {deliveryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-center">{category.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Store Selection */}
          {!selectedStore ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {deliveryCategories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="space-y-4">
                {filteredStores.map(renderStoreCard)}
              </div>
            </div>
          ) : (
            /* Store Menu */
            <div>
              <div className="flex items-center mb-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedStore(null)}
                >
                  ← Back
                </Button>
                <h2 className="text-lg font-semibold ml-2">{selectedStore.name}</h2>
              </div>
              
              <div className="space-y-4">
                {products.filter(p => p.storeId === selectedStore.id).map(renderProductCard)}
              </div>
            </div>
          )}
        </div>

        {/* Cart Modal */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Your Cart</DialogTitle>
            </DialogHeader>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <FaShoppingBag className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-neutral-600">${item.product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <FaMinus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <FaPlus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Checkout Modal */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Address</label>
                <Input
                  placeholder="Enter your delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              {/* Delivery Options */}
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Option</label>
                <div className="space-y-2">
                  {deliveryOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.id}
                        variant={selectedDeliveryOption?.id === option.id ? "default" : "outline"}
                        className="w-full h-auto p-4 justify-start"
                        onClick={() => setSelectedDeliveryOption(option)}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <div className="text-left flex-1">
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm opacity-80">{option.description}</div>
                          <div className="text-sm">{option.estimatedTime} • ${option.price}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>${selectedDeliveryOption?.price?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${getTotalWithDelivery().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={handlePlaceOrder}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Tracking Modal */}
        <Dialog open={showTracking} onOpenChange={setShowTracking}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Track Your Order</DialogTitle>
            </DialogHeader>
            
            {activeOrder && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-semibold">Order {activeOrder.orderNumber}</h3>
                  <Badge className="mt-2">{activeOrder.status}</Badge>
                </div>

                {/* Order Status Progress */}
                <div className="space-y-3">
                  {["confirmed", "preparing", "ready", "picked_up", "delivered"].map((status, index) => (
                    <div key={status} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        activeOrder.status === status ? "bg-primary" :
                        ["confirmed", "preparing", "ready", "picked_up"].indexOf(activeOrder.status) > index
                          ? "bg-green-500" : "bg-neutral-300"
                      }`} />
                      <span className={`text-sm ${
                        activeOrder.status === status ? "font-semibold" : ""
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>

                {activeOrder.status === "picked_up" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaUser className="w-5 h-5" />
                      <span className="font-medium">Your Driver</span>
                    </div>
                    <p className="text-sm">Samuel Okafor</p>
                    <p className="text-sm text-neutral-600">Honda CG125 • LAG-456-XYZ</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <FaPhone className="w-4 h-4 mr-2" />
                      Call Driver
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}