import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Package, 
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Calendar,
  Download,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  sales: number;
  rating: number;
  reviews: number;
  createdAt: string;
}

interface Order {
  id: string;
  customerName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export default function MerchantDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data
  const mockProducts: Product[] = [
    {
      id: "PROD_001",
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-cancelling headphones",
      price: 89.99,
      category: "electronics",
      stock: 47,
      status: 'active',
      sales: 23,
      rating: 4.5,
      reviews: 12,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "PROD_002",
      name: "African Print Dress",
      description: "Beautiful traditional dress",
      price: 45.00,
      category: "fashion",
      stock: 0,
      status: 'out_of_stock',
      sales: 18,
      rating: 4.8,
      reviews: 15,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "PROD_003",
      name: "Natural Shea Butter",
      description: "100% pure shea butter from Ghana",
      price: 18.50,
      category: "beauty",
      stock: 156,
      status: 'active',
      sales: 67,
      rating: 4.7,
      reviews: 34,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockOrders: Order[] = [
    {
      id: "ORD_001",
      customerName: "John Doe",
      items: [
        { productId: "PROD_001", productName: "Wireless Headphones", quantity: 1, price: 89.99 }
      ],
      total: 89.99,
      status: 'shipped',
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryAddress: "123 Main St, Lagos, Nigeria"
    },
    {
      id: "ORD_002",
      customerName: "Jane Smith",
      items: [
        { productId: "PROD_003", productName: "Natural Shea Butter", quantity: 2, price: 18.50 }
      ],
      total: 37.00,
      status: 'pending',
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryAddress: "456 Oak Ave, Accra, Ghana"
    }
  ];

  const mockAnalytics: Analytics = {
    totalRevenue: 2547.89,
    totalOrders: 89,
    totalProducts: 23,
    averageOrderValue: 28.63,
    topProducts: [
      { name: "Natural Shea Butter", sales: 67, revenue: 1239.50 },
      { name: "Wireless Headphones", sales: 23, revenue: 2069.77 },
      { name: "African Print Dress", sales: 18, revenue: 810.00 }
    ],
    revenueChart: [
      { date: "2024-12-17", revenue: 245.50, orders: 8 },
      { date: "2024-12-18", revenue: 389.75, orders: 12 },
      { date: "2024-12-19", revenue: 156.25, orders: 5 },
      { date: "2024-12-20", revenue: 445.80, orders: 15 },
      { date: "2024-12-21", revenue: 298.65, orders: 9 },
      { date: "2024-12-22", revenue: 367.42, orders: 11 },
      { date: "2024-12-23", revenue: 644.52, orders: 19 }
    ]
  };

  const { data: products = mockProducts } = useQuery<Product[]>({
    queryKey: ["/api/merchant/products"],
  });

  const { data: orders = mockOrders } = useQuery<Order[]>({
    queryKey: ["/api/merchant/orders"],
  });

  const { data: analytics = mockAnalytics } = useQuery<Analytics>({
    queryKey: ["/api/merchant/analytics", selectedPeriod],
  });

  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      await apiRequest("POST", "/api/merchant/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchant/products"] });
      setShowAddProduct(false);
      setProductForm({ name: "", description: "", price: "", category: "", stock: "" });
      toast({
        title: "Product Added",
        description: "Your product has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addProductMutation.mutate({
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'delivered': return 'bg-success/10 text-success';
      case 'shipped': case 'processing': return 'bg-blue/10 text-blue';
      case 'pending': case 'draft': return 'bg-accent/10 text-accent';
      case 'out_of_stock': case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Merchant Dashboard</h2>
        <p className="text-neutral-600">Manage your store and track performance</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Revenue</p>
                    <p className="text-xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Orders</p>
                    <p className="text-xl font-bold">{analytics.totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Products</p>
                    <p className="text-xl font-bold">{analytics.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Avg Order</p>
                    <p className="text-xl font-bold">{formatCurrency(analytics.averageOrderValue)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-neutral-600">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(order.total)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.sales} sales</p>
                    </div>
                    <p className="font-bold">{formatCurrency(product.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Inventory</h3>
            <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Product name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  />
                  <Input
                    placeholder="Description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    />
                  </div>
                  <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="beauty">Beauty & Health</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddProduct} disabled={addProductMutation.isPending} className="w-full">
                    {addProductMutation.isPending ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-neutral-600">{product.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-600">Stock: {product.stock}</p>
                      <p className="text-sm text-neutral-600">Sales: {product.sales}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(product.rating)}
                        <span className="text-xs text-neutral-600">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Order Management</h3>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-neutral-600">{order.customerName}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-neutral-600">{order.items.length} items</p>
                      <p className="font-bold">{formatCurrency(order.total)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm">
                            Process
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sales Analytics</h3>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end space-x-2">
                {analytics.revenueChart.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${(data.revenue / 700) * 100}%` }}
                    />
                    <p className="text-xs text-neutral-600 mt-2">
                      {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Page Views</span>
                  <span className="font-bold">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Add to Cart Rate</span>
                  <span className="font-bold">23.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>Purchase Rate</span>
                  <span className="font-bold">8.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Return Customer Rate</span>
                  <span className="font-bold">34.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Customers</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>New This Month</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Rating</span>
                  <span className="font-bold">4.6/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Satisfaction</span>
                  <span className="font-bold">92%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}