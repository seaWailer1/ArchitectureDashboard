import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  FaShoppingBag, 
  FaSearch, 
  FaFilter, 
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaMapMarkerAlt,
  FaTruck,
  FaCreditCard,
  FaChartLine,
  FaClock
} from "react-icons/fa";
import ProductDetail from "./product-detail";
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
  seller: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    verified: boolean;
    location: string;
  };
  rating: number;
  reviews: number;
  imageUrl?: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  shippingFee: number;
  deliveryTime: string;
  specifications: Record<string, string>;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  }>;
  tags: string[];
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    validUntil: string;
  };
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
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { id: "all", name: "All Categories", icon: "🛍️" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👗" },
    { id: "home", name: "Home & Garden", icon: "🏠" },
    { id: "beauty", name: "Beauty & Health", icon: "💄" },
    { id: "sports", name: "Sports & Outdoors", icon: "⚽" },
    { id: "books", name: "Books & Media", icon: "📚" }
  ];

  const sortOptions = [
    { id: "popular", name: "Most Popular" },
    { id: "price_low", name: "Price: Low to High" },
    { id: "price_high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
    { id: "newest", name: "Newest First" }
  ];

  const mockProducts: Product[] = [
    {
      id: "PROD_001",
      name: "Wireless Bluetooth Headphones",
      description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.",
      price: 89.99,
      originalPrice: 129.99,
      category: "electronics",
      seller: {
        id: "SELL_001",
        name: "TechStore Africa",
        rating: 4.8,
        totalSales: 2847,
        verified: true,
        location: "Lagos, Nigeria"
      },
      rating: 4.5,
      reviews: 128,
      images: ["/images/headphones-1.jpg", "/images/headphones-2.jpg"],
      inStock: true,
      stockQuantity: 47,
      shippingFee: 5.99,
      deliveryTime: "2-3 days",
      specifications: {
        "Battery Life": "30 hours",
        "Connectivity": "Bluetooth 5.0",
        "Weight": "250g",
        "Warranty": "2 years"
      },
      variants: [
        { id: "VAR_001", name: "Black", price: 89.99, inStock: true },
        { id: "VAR_002", name: "White", price: 94.99, inStock: true },
        { id: "VAR_003", name: "Blue", price: 89.99, inStock: false }
      ],
      tags: ["wireless", "bluetooth", "noise-cancelling", "premium"],
      discount: {
        type: 'percentage',
        value: 30,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
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
      seller: "Home Decor FaPlus",
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

  const filteredAndSortedProducts = mockProducts
    .filter(product => {
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.id).getTime() - new Date(a.id).getTime();
        default:
          return b.reviews - a.reviews; // popularity by review count
      }
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
      <FaStar 
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

  if (showProductDetail && selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => {
          setShowProductDetail(false);
          setSelectedProduct(null);
        }}
        onAddToCart={(product, variant) => {
          addToCart(product);
          setShowProductDetail(false);
          setSelectedProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">AfriMarket</h2>
        <p className="text-neutral-600">Discover amazing products from African sellers</p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* FaSearch and Filters */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="FaSearch products, brands, or sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={showCart} onOpenChange={setShowCart}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <FaShoppingCart className="w-4 h-4 mr-2" />
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

            {/* Quick Category Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0 text-xs"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">
                {filteredAndSortedProducts.length} products found
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trending/Featured Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <FaStar className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Trending Now</h3>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {["Wireless Earbuds", "African Prints", "Skincare", "Home Decor"].map(trend => (
                  <Badge key={trend} variant="outline" className="flex-shrink-0 cursor-pointer hover:bg-accent/10">
                    <FaChartLine className="w-3 h-3 mr-1" />
                    {trend}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAndSortedProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-neutral-100 rounded-lg mb-3 flex items-center justify-center relative">
                    <FaShoppingBag className="w-12 h-12 text-neutral-400" />
                    {product.discount && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                        -{product.discount.value}{product.discount.type === 'percentage' ? '%' : '$'}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle favorite
                      }}
                    >
                      <FaHeart className="w-4 h-4" />
                    </Button>
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
                      <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                      {product.seller.name}
                    </span>
                    <span className="flex items-center">
                      <FaTruck className="w-3 h-3 mr-1" />
                      {product.deliveryTime}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductDetail(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product)}
                    >
                      <FaShoppingCart className="w-3 h-3 mr-1" />
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
                  <FaShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                  <p className="text-neutral-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-3 p-2 border rounded">
                        <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                          <FaShoppingBag className="w-6 h-6 text-neutral-400" />
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
                            <FaMinus className="w-3 h-3" />
                          </Button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          >
                            <FaPlus className="w-3 h-3" />
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
                  <FaShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
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
                <FaHeart className="w-5 h-5" />
                <span>Favorite Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FaHeart className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600">No favorites yet</p>
                <p className="text-sm text-neutral-500">FaHeart products to save them here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}