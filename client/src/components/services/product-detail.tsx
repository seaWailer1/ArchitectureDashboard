import { useState } from "react";
import { FaFaFaArrowLeft, FaFaFaStar, FaFaFaHeart, FaShareAlt, FaFaFaShoppingCart, FaFaFaTruck, FaFaFaShield, FaCommentDots, FaFaFaPlus, FaFaFaMinus, FaFaFaCheck, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductDetailProps {
  product: any;
  onBack: () => void;
  onAddToCart: (product: any, variant?: any) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const currentPrice = selectedVariant?.price || product.price;
  const isInStock = selectedVariant?.inStock !== false && product.inStock;

  const renderFaFaStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaFaStar 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} 
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
    onAddToCart(product, selectedVariant);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <FaFaArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="font-bold text-lg flex-1">{product.name}</h2>
        <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
          <FaFaHeart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button variant="outline" size="sm">
          <FaShareAlt className="w-4 h-4" />
        </Button>
      </div>

      {/* Product Images */}
      <Card>
        <CardContent className="p-4">
          <div className="aspect-square bg-neutral-100 rounded-lg mb-3 flex items-center justify-center">
            <FaFaShoppingCart className="w-16 h-16 text-neutral-400" />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 rounded border-2 ${selectedImage === index ? 'border-primary' : 'border-neutral-200'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="w-full h-full bg-neutral-100 rounded flex items-center justify-center">
                    <FaFaShoppingCart className="w-4 h-4 text-neutral-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price and Discount */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-2xl font-bold">{formatCurrency(currentPrice)}</span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-lg text-neutral-500 line-through ml-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discount && (
              <Badge className="bg-red-100 text-red-700">
                -{product.discount.value}{product.discount.type === 'percentage' ? '%' : ' USD'} OFF
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            {renderFaFaStars(product.rating)}
            <span className="text-sm text-neutral-600">({product.reviews} reviews)</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={isInStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
              {isInStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </Badge>
            {product.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seller Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <FaFaShoppingCart className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{product.seller.name}</span>
                  {product.seller.verified && (
                    <FaFaCheck className="w-4 h-4 text-success" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  {renderFaFaStars(product.seller.rating)}
                  <span>({product.seller.totalSales} sales)</span>
                </div>
                <div className="flex items-center text-xs text-neutral-500">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                  {product.seller.location}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <FaCommentDots className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Select Variant</h4>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                  size="sm"
                  disabled={!variant.inStock}
                  onClick={() => setSelectedVariant(variant)}
                  className="text-xs"
                >
                  {variant.name}
                  {!variant.inStock && <span className="ml-1">(Out)</span>}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quantity and Add to Cart */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <FaFaMinus className="w-3 h-3" />
              </Button>
              <span className="mx-3 font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <FaFaPlus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(currentPrice * quantity)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{formatCurrency(product.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency((currentPrice * quantity) + product.shippingFee)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="w-full"
          >
            <FaFaShoppingCart className="w-4 h-4 mr-2" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FaFaTruck className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Delivery Information</p>
              <p className="text-sm text-neutral-600">Expected delivery: {product.deliveryTime}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaFaShield className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium">Buyer Protection</p>
              <p className="text-sm text-neutral-600">Full refund if item not as described</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-700">{product.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs">
          <Card>
            <CardContent className="p-4">
              {product.specifications ? (
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-neutral-100 last:border-0">
                      <span className="text-sm font-medium">{key}</span>
                      <span className="text-sm text-neutral-600">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No specifications available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-6">
                <FaFaStar className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">No reviews yet</p>
                <p className="text-sm text-neutral-500">Be the first to review this product</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}