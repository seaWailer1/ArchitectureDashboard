import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  Star, 
  Heart,
  Filter,
  Grid3X3,
  List,
  Plus,
  Minus,
  Package,
  Truck,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ProductDetail from "./product-detail";

interface ShopProps {
  onBack: () => void;
}

export default function Shop({ onBack }: ShopProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();

  // Mock products data
  const categories = [
    { id: 'all', name: 'All Categories', count: 250 },
    { id: 'electronics', name: 'Electronics', count: 45 },
    { id: 'fashion', name: 'Fashion', count: 78 },
    { id: 'home', name: 'Home & Garden', count: 32 },
    { id: 'food', name: 'Food & Drinks', count: 56 },
    { id: 'health', name: 'Health & Beauty', count: 39 },
  ];

  const products = [
    {
      id: 1,
      name: 'African Print Dress',
      description: 'Beautiful traditional African print dress made from high-quality ankara fabric.',
      price: 45.99,
      originalPrice: 59.99,
      category: 'fashion',
      rating: 4.5,
      reviews: 123,
      inStock: true,
      stockQuantity: 15,
      tags: ['trending', 'handmade'],
      seller: {
        name: 'Adunni Fashion',
        rating: 4.8,
        totalSales: 1250,
        location: 'Lagos, Nigeria',
        verified: true
      },
      discount: { type: 'percentage', value: 23 },
      deliveryTime: '2-3 days',
      shippingFee: 5.99,
      variants: [
        { id: 1, name: 'Small', inStock: true, price: 45.99 },
        { id: 2, name: 'Medium', inStock: true, price: 45.99 },
        { id: 3, name: 'Large', inStock: false, price: 45.99 },
      ]
    },
    {
      id: 2,
      name: 'Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      price: 89.99,
      category: 'electronics',
      rating: 4.3,
      reviews: 456,
      inStock: true,
      stockQuantity: 8,
      tags: ['electronics', 'wireless'],
      seller: {
        name: 'TechHub Africa',
        rating: 4.6,
        totalSales: 890,
        location: 'Accra, Ghana',
        verified: true
      },
      deliveryTime: '1-2 days',
      shippingFee: 3.99,
    },
    {
      id: 3,
      name: 'Organic Shea Butter',
      description: 'Pure organic shea butter sourced directly from Ghana. Perfect for skin care.',
      price: 24.99,
      category: 'health',
      rating: 4.7,
      reviews: 789,
      inStock: true,
      stockQuantity: 25,
      tags: ['organic', 'natural'],
      seller: {
        name: 'Ghana Gold Naturals',
        rating: 4.9,
        totalSales: 2100,
        location: 'Kumasi, Ghana',
        verified: true
      },
      deliveryTime: '3-5 days',
      shippingFee: 4.99,
    },
    {
      id: 4,
      name: 'Jollof Rice Spice Mix',
      description: 'Authentic West African jollof rice seasoning blend for perfect flavor.',
      price: 12.99,
      category: 'food',
      rating: 4.6,
      reviews: 234,
      inStock: true,
      stockQuantity: 50,
      tags: ['spices', 'authentic'],
      seller: {
        name: 'Mama Africa Spices',
        rating: 4.7,
        totalSales: 567,
        location: 'Abuja, Nigeria',
        verified: true
      },
      deliveryTime: '2-4 days',
      shippingFee: 2.99,
    },
    {
      id: 5,
      name: 'Kente Cloth Scarf',
      description: 'Handwoven traditional Kente cloth scarf from skilled artisans.',
      price: 35.99,
      category: 'fashion',
      rating: 4.8,
      reviews: 89,
      inStock: true,
      stockQuantity: 12,
      tags: ['handmade', 'traditional'],
      seller: {
        name: 'Kente Masters',
        rating: 4.9,
        totalSales: 345,
        location: 'Kumasi, Ghana',
        verified: true
      },
      deliveryTime: '5-7 days',
      shippingFee: 6.99,
    },
    {
      id: 6,
      name: 'Solar Power Bank',
      description: 'Portable solar-powered charging bank perfect for off-grid areas.',
      price: 67.99,
      category: 'electronics',
      rating: 4.2,
      reviews: 167,
      inStock: true,
      stockQuantity: 20,
      tags: ['solar', 'portable'],
      seller: {
        name: 'Solar Solutions Africa',
        rating: 4.5,
        totalSales: 432,
        location: 'Nairobi, Kenya',
        verified: true
      },
      deliveryTime: '3-5 days',
      shippingFee: 4.99,
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any, variant?: any) => {
    const cartItem = {
      id: `${product.id}-${variant?.id || 'default'}`,
      product,
      variant,
      quantity: 1,
      price: variant?.price || product.price
    };

    const existingItem = cartItems.find(item => item.id === cartItem.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === cartItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, cartItem]);
    }

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    );
  }

  if (showCart) {
    return (
      <div className="space-y-4">
        {/* Cart Header */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setShowCart(false)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="font-bold text-lg">Shopping Cart</h2>
            <p className="text-sm text-gray-600">{cartItems.length} items</p>
          </div>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some items to get started</p>
              <Button onClick={() => setShowCart(false)}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-600">Size: {item.variant.name}</p>
                      )}
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Cart Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>$5.99</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(getCartTotal() + 5.99)}</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">AfriMart</h2>
          <p className="text-sm text-gray-600">Shop authentic African products</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowCart(true)}
          className="relative"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {filteredProducts.map((product) => (
          <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4" onClick={() => setSelectedProduct(product)}>
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-600">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-1">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <Badge className="bg-red-100 text-red-700 text-xs">
                      -{product.discount.value}% OFF
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Truck className="w-3 h-3" />
                    <span>{product.deliveryTime}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}