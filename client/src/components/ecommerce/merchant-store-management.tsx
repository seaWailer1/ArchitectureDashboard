import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Store, 
  Package, 
  Plus, 
  Edit3, 
  Eye, 
  BarChart3,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  ShoppingCart,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings,
  Image,
  Save,
  X,
  Check,
  AlertCircle,
  Truck,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface StoreData {
  id?: number;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  businessHours: any;
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  preparationTime: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  tags: string[];
}

interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minStock: number;
  unit: string;
  weight?: number;
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isHalal: boolean;
  preparationTime?: number;
  tags: string[];
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmount: number;
  orderType: string;
  createdAt: string;
  items: any[];
}

export default function MerchantStoreManagement() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showStoreEditor, setShowStoreEditor] = useState(false);
  const [showProductEditor, setShowProductEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [storeData, setStoreData] = useState<StoreData>({
    name: "",
    description: "",
    category: "restaurant",
    address: "",
    phone: "",
    email: "",
    businessHours: {
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "21:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: false },
      sunday: { open: "10:00", close: "20:00", closed: false }
    },
    deliveryRadius: 5,
    minimumOrderAmount: 15,
    deliveryFee: 2.50,
    freeDeliveryThreshold: 50,
    preparationTime: 30,
    isActive: true,
    isFeatured: false,
    tags: []
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockStore = {
    id: 1,
    name: "Mama's Kitchen",
    description: "Authentic African cuisine with home-style cooking",
    category: "restaurant",
    address: "15 Victoria Island, Lagos, Nigeria",
    phone: "+234 901 234 5678",
    email: "orders@mamaskitchen.ng",
    rating: 4.8,
    totalReviews: 142,
    totalOrders: 1847,
    isActive: true,
    businessHours: {
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "21:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: false },
      sunday: { open: "10:00", close: "20:00", closed: false }
    },
    tags: ["African", "Halal", "Vegetarian"]
  };

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Jollof Rice with Chicken",
      description: "Perfectly seasoned jollof rice with grilled chicken",
      category: "Main Course",
      price: 12.50,
      originalPrice: 15.00,
      stock: 25,
      minStock: 5,
      unit: "plate",
      imageUrls: ["/api/placeholder/200/200"],
      isActive: true,
      isFeatured: true,
      isVegetarian: false,
      isVegan: false,
      isHalal: true,
      preparationTime: 20,
      tags: ["popular", "spicy"]
    },
    {
      id: 2,
      name: "Vegetarian Plantain",
      description: "Sweet fried plantains with vegetables",
      category: "Vegetarian",
      price: 8.00,
      stock: 30,
      minStock: 10,
      unit: "plate",
      imageUrls: ["/api/placeholder/200/200"],
      isActive: true,
      isFeatured: false,
      isVegetarian: true,
      isVegan: true,
      isHalal: true,
      preparationTime: 15,
      tags: ["healthy", "vegan"]
    }
  ];

  const mockOrders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-001",
      customerName: "Amina Hassan",
      status: "preparing",
      totalAmount: 33.00,
      orderType: "delivery",
      createdAt: "2024-12-23T18:30:00Z",
      items: [
        { name: "Jollof Rice with Chicken", quantity: 2, price: 12.50 },
        { name: "Plantain", quantity: 1, price: 8.00 }
      ]
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      customerName: "David Okoro",
      status: "ready",
      totalAmount: 20.50,
      orderType: "pickup",
      createdAt: "2024-12-23T18:45:00Z",
      items: [
        { name: "Vegetarian Plantain", quantity: 2, price: 8.00 },
        { name: "Fresh Juice", quantity: 1, price: 4.50 }
      ]
    }
  ];

  const { data: store = mockStore } = useQuery({
    queryKey: ["/api/merchant/store"],
  });

  const { data: products = mockProducts } = useQuery({
    queryKey: ["/api/merchant/products"],
  });

  const { data: orders = mockOrders } = useQuery({
    queryKey: ["/api/merchant/orders"],
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (data: StoreData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Store Updated",
        description: "Your store information has been updated successfully",
      });
      setShowStoreEditor(false);
      queryClient.invalidateQueries({ queryKey: ["/api/merchant/store"] });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...product, id: Date.now() };
    },
    onSuccess: () => {
      toast({
        title: "Product Added",
        description: "New product has been added to your store",
      });
      setShowProductEditor(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ["/api/merchant/products"] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { orderId, status };
    },
    onSuccess: (_, { status }) => {
      toast({
        title: "Order Updated",
        description: `Order status changed to ${status}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/merchant/orders"] });
    },
  });

  const handleStoreUpdate = () => {
    updateStoreMutation.mutate(storeData);
  };

  const handleProductSave = () => {
    if (editingProduct) {
      createProductMutation.mutate(editingProduct);
    }
  };

  const openProductEditor = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct({
        name: "",
        description: "",
        category: "Main Course",
        price: 0,
        stock: 0,
        minStock: 5,
        unit: "plate",
        imageUrls: [],
        isActive: true,
        isFeatured: false,
        isVegetarian: false,
        isVegan: false,
        isHalal: false,
        tags: []
      });
    }
    setShowProductEditor(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "confirmed": return "bg-blue-500";
      case "preparing": return "bg-orange-500";
      case "ready": return "bg-green-500";
      case "picked_up": return "bg-purple-500";
      case "delivered": return "bg-green-600";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">$2,847</p>
            <p className="text-sm text-neutral-600">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-neutral-600">Active Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{store.rating}</p>
            <p className="text-sm text-neutral-600">Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-neutral-600">Products</p>
          </CardContent>
        </Card>
      </div>

      {/* Store Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Store Status</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStoreData(store);
                setShowStoreEditor(true);
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Store Active</span>
              <Badge className={store.isActive ? "bg-green-500" : "bg-red-500"}>
                {store.isActive ? "Open" : "Closed"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Orders</span>
              <span className="font-semibold">{store.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Customer Reviews</span>
              <span className="font-semibold">{store.totalReviews}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-neutral-600">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <p className="text-sm font-semibold mt-1">${order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Products</h2>
        <Button onClick={() => openProductEditor()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="space-y-4">
        {products.map(product => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <img 
                  src={product.imageUrls[0] || "/api/placeholder/80/80"} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-neutral-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-neutral-500 line-through">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Stock: {product.stock}</span>
                      {product.preparationTime && (
                        <span>Prep: {product.preparationTime}min</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProductEditor(product)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={product.isActive}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-1 mt-2">
                    {product.isVegetarian && <Badge variant="outline" className="text-xs">Vegetarian</Badge>}
                    {product.isVegan && <Badge variant="outline" className="text-xs">Vegan</Badge>}
                    {product.isHalal && <Badge variant="outline" className="text-xs">Halal</Badge>}
                    {product.isFeatured && <Badge className="text-xs bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      
      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{order.orderNumber}</h4>
                  <p className="text-sm text-neutral-600">{order.customerName}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <p className="font-bold mt-1">${order.totalAmount}</p>
                  <p className="text-xs text-neutral-600">{order.orderType}</p>
                </div>
              </div>

              <div className="mb-3">
                <h5 className="font-medium text-sm mb-1">Items:</h5>
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm text-neutral-600">
                    {item.name} x{item.quantity} - ${item.price}
                  </div>
                ))}
              </div>

              {order.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      status: "confirmed"
                    })}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      status: "cancelled"
                    })}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}

              {order.status === "confirmed" && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatusMutation.mutate({
                    orderId: order.id,
                    status: "preparing"
                  })}
                >
                  Start Preparing
                </Button>
              )}

              {order.status === "preparing" && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatusMutation.mutate({
                    orderId: order.id,
                    status: "ready"
                  })}
                >
                  Mark Ready
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Store Management</h2>
        <p className="text-neutral-600">Manage your store, products, and orders</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="products">
          {renderProducts()}
        </TabsContent>

        <TabsContent value="orders">
          {renderOrders()}
        </TabsContent>
      </Tabs>

      {/* Store Editor Modal */}
      <Dialog open={showStoreEditor} onOpenChange={setShowStoreEditor}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Store Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <Input
                value={storeData.name}
                onChange={(e) => setStoreData({...storeData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={storeData.description}
                onChange={(e) => setStoreData({...storeData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={storeData.category}
                onValueChange={(value) => setStoreData({...storeData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="grocery">Grocery</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Fee ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={storeData.deliveryFee}
                  onChange={(e) => setStoreData({...storeData, deliveryFee: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Order ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={storeData.minimumOrderAmount}
                  onChange={(e) => setStoreData({...storeData, minimumOrderAmount: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Store Active</span>
              <Switch
                checked={storeData.isActive}
                onCheckedChange={(checked) => setStoreData({...storeData, isActive: checked})}
              />
            </div>

            <Button 
              className="w-full"
              onClick={handleStoreUpdate}
              disabled={updateStoreMutation.isPending}
            >
              {updateStoreMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Editor Modal */}
      <Dialog open={showProductEditor} onOpenChange={setShowProductEditor}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <Input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Vegetarian</span>
                  <Switch
                    checked={editingProduct.isVegetarian}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, isVegetarian: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Vegan</span>
                  <Switch
                    checked={editingProduct.isVegan}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, isVegan: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Halal</span>
                  <Switch
                    checked={editingProduct.isHalal}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, isHalal: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Featured</span>
                  <Switch
                    checked={editingProduct.isFeatured}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, isFeatured: checked})}
                  />
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={handleProductSave}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}