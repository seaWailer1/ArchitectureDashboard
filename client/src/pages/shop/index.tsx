import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ShoppingBag, Star, Truck, MapPin, Filter } from "lucide-react";

export default function ShopIndex() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: 'all', name: 'All Items', count: 1247 },
    { id: 'fashion', name: 'Fashion', count: 342 },
    { id: 'electronics', name: 'Electronics', count: 156 },
    { id: 'beauty', name: 'Beauty', count: 89 },
    { id: 'home', name: 'Home & Garden', count: 234 },
    { id: 'food', name: 'Food & Drinks', count: 167 },
    { id: 'books', name: 'Books', count: 78 },
    { id: 'sports', name: 'Sports', count: 123 },
    { id: 'crafts', name: 'Crafts', count: 58 }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Adire Print Dress',
      price: 12500,
      originalPrice: 15000,
      image: '👗',
      seller: 'Bukola Fashion',
      location: 'Lagos, Nigeria',
      rating: 4.8,
      reviews: 234,
      discount: 17,
      fastDelivery: true
    },
    {
      id: 2,
      name: 'Ankara Laptop Bag',
      price: 8500,
      image: '💼',
      seller: 'Afro Tech Accessories',
      location: 'Abuja, Nigeria',
      rating: 4.9,
      reviews: 156,
      fastDelivery: true
    },
    {
      id: 3,
      name: 'Shea Butter Face Cream',
      price: 3500,
      image: '🧴',
      seller: 'Natural Beauty Co',
      location: 'Kumasi, Ghana',
      rating: 4.7,
      reviews: 89,
      organic: true
    },
    {
      id: 4,
      name: 'Kente Table Runner',
      price: 15000,
      image: '🎨',
      seller: 'Ghana Textiles',
      location: 'Accra, Ghana',
      rating: 4.9,
      reviews: 67,
      handmade: true
    },
    {
      id: 5,
      name: 'African Coffee Beans',
      price: 4500,
      image: '☕',
      seller: 'Ethiopian Highlands',
      location: 'Addis Ababa, Ethiopia',
      rating: 4.8,
      reviews: 123,
      organic: true
    },
    {
      id: 6,
      name: 'Wooden Sculpture',
      price: 25000,
      image: '🗿',
      seller: 'Kenyan Artisans',
      location: 'Nairobi, Kenya',
      rating: 4.9,
      reviews: 45,
      handmade: true
    }
  ];

  const handleProductSelect = (productId: number) => {
    navigate(`/shop/product?id=${productId}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For demo purposes, we'll show all products for any category
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/services')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">AfriMart</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">African marketplace</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/shop/cart')}>
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products, sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleProductSelect(product.id)}
                >
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                      {product.image}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-medium line-clamp-2">{product.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {product.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ₦{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="font-semibold text-green-600">
                            ₦{product.price.toLocaleString()}
                          </span>
                          {product.discount && (
                            <Badge variant="destructive" className="text-xs">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium">{product.seller}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{product.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>
                        
                        <div className="flex space-x-1">
                          {product.fastDelivery && (
                            <Badge variant="secondary" className="text-xs">
                              <Truck className="w-3 h-3 mr-1" />
                              Fast
                            </Badge>
                          )}
                          {product.organic && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Organic
                            </Badge>
                          )}
                          {product.handmade && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              Handmade
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
            onClick={() => navigate('/shop/sellers')}
          >
            <MapPin className="w-4 h-4" />
            <span>Local Sellers</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-12 flex items-center space-x-2"
            onClick={() => navigate('/shop/deals')}
          >
            <Star className="w-4 h-4" />
            <span>Daily Deals</span>
          </Button>
        </div>
      </div>
    </div>
  );
}