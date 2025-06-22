import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  MapPin,
  Truck,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  seller: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
  inStock: boolean;
  shippingFee: number;
  deliveryTime: string;
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryAddress: string;
}

export default function ShoppingMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Garden" },
    { id: "beauty", name: "Beauty & Health" },
    { id: "sports", name: "Sports & Outdoors" },
    { id: "books", name: "Books & Media" }
  ];

  const mockProducts: Product[] = [
    {
      id: "PROD_001",
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 89.99,
      originalPrice: 129.99,
      category: "electronics",
      seller: "TechStore Africa",
      rating: 4.5,
      reviews: 128,
      inStock: true,
      shippingFee: 5.99,
      deliveryTime: "2-3 days"
    },
    {
      id: "PROD_002",
      name: "African Print Dress",
      description: "Beautiful traditional African print dress, handmade",
      price: 45.00,
      category: "fashion",
      seller: "Afrocentric Styles",
      rating: 4.8,
      reviews: 67,
      inStock: true,
      shippingFee: 7.50,
      deliveryTime: "3-5 days"
    },
    {
      id: "PROD_003",
      name: "Smartphone - 128GB",
      description: "Latest Android smartphone with dual camera",
      price: 299.99,
      originalPrice: 399.99,
      category: "electronics",
      seller: "Mobile Hub",
      rating: 4.3,
      reviews: 89,
      inStock: true,
      shippingFee: 0,
      deliveryTime: "1-2 days"
    },
    {
      id: "PROD_004",
      name: "Natural Shea Butter",
      description: "100% pure shea butter from Ghana",
      price: 18.50,
      category: "beauty",
      seller: "Natural Beauty Co",
      rating: 4.7,
      reviews: 156,
      inStock: true,
      shippingFee: 4.99,
      deliveryTime: "2-4 days"
    },
    {
      id: "PROD_005",
      name: "Coffee Table Set",
      description: "Modern wooden coffee table with storage",
      price: 189.99,
      category: "home",
      seller: "Home Decor Plus",
      rating: 4.2,
      reviews: 34,
      inStock: false,
      shippingFee: 25.00,
      deliveryTime: "5-7 days"
    },
    {
      id: "PROD_006",
      name: "Running Shoes",
      description: "Professional running shoes for all terrains",
      price: 75.00,
      originalPrice: 95.00,
      category: "sports",
      seller: "SportZone",
      rating: 4.4,
      reviews: 92,
      inStock: true,
      shippingFee: 8.99,
      deliveryTime: "2-3 days"
    }
  ];

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/shopping/orders"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: { productId: string; quantity: number }) => {
      await apiRequest("POST", "/api/shopping/cart", item);
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart",
      });
    }
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      await apiRequest("POST", "/api/shopping/order", orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping/orders"] });
      setCart([]);
      setShowCart(false);
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId: product.id, product, quantity: 1 }]);
    }
    
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartShipping = () => {
    return cart.reduce((total, item) => total + item.product.shippingFee, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    placeOrderMutation.mutate({
      items: cart,
      total: getCartTotal() + getCartShipping(),
      deliveryAddress: "123 Main Street, Lagos, Nigeria"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} 
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'shipped': return 'bg-blue/10 text-blue';
      case 'confirmed': return 'bg-accent/10 text-accent';
      case 'pending': return 'bg-neutral-100 text-neutral-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Shopping Marketplace</h2>
        <p className="text-neutral-600">Discover amazing products from African sellers</p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Dialog open={showCart} onOpenChange={setShowCart}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-neutral-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-neutral-400" />
                  </div>
                  
                  <h3 className="font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-xs text-neutral-600">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through ml-2">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Badge className={product.inStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.seller}
                    </span>
                    <span className="flex items-center">
                      <Truck className="w-3 h-3 mr-1" />
                      {product.deliveryTime}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shopping Cart Dialog */}
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                  <p className="text-neutral-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-3 p-2 border rounded">
                        <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-neutral-600">{formatCurrency(item.product.price)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subtotal</span>
                      <span>{formatCurrency(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Shipping</span>
                      <span>{formatCurrency(getCartShipping())}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(getCartTotal() + getCartShipping())}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={placeOrder}
                    disabled={placeOrderMutation.isPending}
                    className="w-full"
                  >
                    {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No orders yet</p>
                  <p className="text-sm text-neutral-500">Start shopping to see your orders here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-neutral-600">{order.items.length} items</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                        <span className="font-bold">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Favorite Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600">No favorites yet</p>
                <p className="text-sm text-neutral-500">Heart products to save them here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}