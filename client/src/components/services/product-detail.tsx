import { useState } from "react";
import { 
  ArrowLeft, 
  Star, 
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  CheckCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductDetailProps {
  product: any;
  onBack: () => void;
  onAddToCart: (product: any, variant?: any) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedVariant);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={isFavorite ? 'text-red-500' : ''}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <Package className="w-24 h-24 text-gray-400" />
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discount && (
              <Badge className="bg-red-100 text-red-700">
                -{product.discount.value}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Variants */}
        {product.variants && (
          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex space-x-2">
              {product.variants.map((variant: any) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedVariant(variant)}
                  disabled={!variant.inStock}
                  className="relative"
                >
                  {variant.name}
                  {!variant.inStock && (
                    <span className="absolute inset-0 bg-gray-200 opacity-50 rounded"></span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <h3 className="font-medium mb-2">Quantity</h3>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Seller Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{product.seller.name}</h4>
                  {product.seller.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    {renderStars(product.seller.rating)}
                  </div>
                  <span>• {product.seller.totalSales} sales</span>
                </div>
                <p className="text-sm text-gray-600">{product.seller.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Delivery</span>
                </div>
                <span className="text-sm">{product.deliveryTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Shipping Fee</span>
                </div>
                <span className="text-sm">{formatCurrency(product.shippingFee)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {product.tags && (
              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Reviews coming soon</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add to Cart Button */}
        <div className="sticky bottom-4 bg-white p-4 border-t">
          <Button 
            onClick={handleAddToCart}
            className="w-full"
            disabled={selectedVariant && !selectedVariant.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart • {formatCurrency((selectedVariant?.price || product.price) * quantity)}
          </Button>
        </div>
      </div>
    </div>
  );
}