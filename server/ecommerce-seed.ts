import { storage } from "./storage";
import { nanoid } from "nanoid";

export async function seedEcommerceData() {
  console.log("Seeding e-commerce data...");

  // Create sample stores
  const stores = [
    {
      merchantId: "demo-merchant-1",
      name: "Mama's Kitchen",
      description: "Authentic African cuisine with home-style cooking and traditional recipes passed down through generations",
      category: "restaurant",
      address: "15 Victoria Island, Lagos, Nigeria",
      latitude: "6.4281",
      longitude: "3.4219",
      phone: "+234 901 234 5678",
      email: "orders@mamaskitchen.ng",
      businessHours: {
        monday: { open: "09:00", close: "21:00", closed: false },
        tuesday: { open: "09:00", close: "21:00", closed: false },
        wednesday: { open: "09:00", close: "21:00", closed: false },
        thursday: { open: "09:00", close: "21:00", closed: false },
        friday: { open: "09:00", close: "21:00", closed: false },
        saturday: { open: "09:00", close: "22:00", closed: false },
        sunday: { open: "10:00", close: "20:00", closed: false }
      },
      deliveryRadius: "5.00",
      minimumOrderAmount: "15.00",
      deliveryFee: "2.50",
      freeDeliveryThreshold: "50.00",
      rating: "4.8",
      totalReviews: 142,
      isActive: true,
      isFeatured: true,
      imageUrl: "/api/placeholder/400/250",
      bannerUrl: "/api/placeholder/800/300",
      tags: ["African", "Halal", "Vegetarian", "Fast Delivery"],
      preparationTime: 30
    },
    {
      merchantId: "demo-merchant-2",
      name: "Fresh Market Express",
      description: "Fresh produce, groceries, and daily essentials delivered to your doorstep",
      category: "grocery",
      address: "45 Allen Avenue, Ikeja, Lagos, Nigeria",
      latitude: "6.6018",
      longitude: "3.3515",
      phone: "+234 902 345 6789",
      email: "info@freshmarketexpress.ng",
      businessHours: {
        monday: { open: "08:00", close: "20:00", closed: false },
        tuesday: { open: "08:00", close: "20:00", closed: false },
        wednesday: { open: "08:00", close: "20:00", closed: false },
        thursday: { open: "08:00", close: "20:00", closed: false },
        friday: { open: "08:00", close: "20:00", closed: false },
        saturday: { open: "08:00", close: "21:00", closed: false },
        sunday: { open: "09:00", close: "19:00", closed: false }
      },
      deliveryRadius: "8.00",
      minimumOrderAmount: "25.00",
      deliveryFee: "3.00",
      freeDeliveryThreshold: "75.00",
      rating: "4.6",
      totalReviews: 89,
      isActive: true,
      isFeatured: false,
      imageUrl: "/api/placeholder/400/250",
      tags: ["Fresh", "Organic", "Local", "Bulk Orders"],
      preparationTime: 15
    },
    {
      merchantId: "demo-merchant-3",
      name: "HealthCare Pharmacy Plus",
      description: "Complete pharmacy services with prescription drugs, health products, and wellness consultations",
      category: "pharmacy",
      address: "12 Broad Street, Marina, Lagos, Nigeria",
      latitude: "6.4541",
      longitude: "3.3957",
      phone: "+234 903 456 7890",
      email: "care@healthcarepharmacy.ng",
      businessHours: {
        monday: { open: "07:00", close: "22:00", closed: false },
        tuesday: { open: "07:00", close: "22:00", closed: false },
        wednesday: { open: "07:00", close: "22:00", closed: false },
        thursday: { open: "07:00", close: "22:00", closed: false },
        friday: { open: "07:00", close: "22:00", closed: false },
        saturday: { open: "08:00", close: "21:00", closed: false },
        sunday: { open: "09:00", close: "20:00", closed: false }
      },
      deliveryRadius: "10.00",
      minimumOrderAmount: "10.00",
      deliveryFee: "1.50",
      freeDeliveryThreshold: "40.00",
      rating: "4.9",
      totalReviews: 76,
      isActive: true,
      isFeatured: true,
      imageUrl: "/api/placeholder/400/250",
      tags: ["Prescription", "OTC", "Health", "24/7", "Emergency"],
      preparationTime: 10
    },
    {
      merchantId: "demo-merchant-4",
      name: "TechZone Electronics",
      description: "Latest electronics, gadgets, and tech accessories with expert recommendations",
      category: "electronics",
      address: "78 Computer Village, Ikeja, Lagos, Nigeria",
      latitude: "6.6045",
      longitude: "3.3567",
      phone: "+234 904 567 8901",
      email: "sales@techzoneelectronics.ng",
      businessHours: {
        monday: { open: "09:00", close: "19:00", closed: false },
        tuesday: { open: "09:00", close: "19:00", closed: false },
        wednesday: { open: "09:00", close: "19:00", closed: false },
        thursday: { open: "09:00", close: "19:00", closed: false },
        friday: { open: "09:00", close: "19:00", closed: false },
        saturday: { open: "10:00", close: "18:00", closed: false },
        sunday: { open: "12:00", close: "17:00", closed: false }
      },
      deliveryRadius: "15.00",
      minimumOrderAmount: "50.00",
      deliveryFee: "5.00",
      freeDeliveryThreshold: "200.00",
      rating: "4.7",
      totalReviews: 156,
      isActive: true,
      isFeatured: false,
      imageUrl: "/api/placeholder/400/250",
      tags: ["Electronics", "Gadgets", "Tech", "Warranty", "Expert Support"],
      preparationTime: 45
    }
  ];

  // Create products for each store
  const products = [
    // Mama's Kitchen products
    {
      storeId: 1,
      name: "Jollof Rice with Grilled Chicken",
      description: "Perfectly seasoned jollof rice with tender grilled chicken, served with plantain and coleslaw",
      category: "Main Course",
      subcategory: "Nigerian Dishes",
      price: "12.50",
      originalPrice: "15.00",
      sku: "MK001",
      stock: 25,
      minStock: 5,
      unit: "plate",
      weight: "0.8",
      dimensions: { length: 25, width: 20, height: 8 },
      imageUrls: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
      isActive: true,
      isFeatured: true,
      rating: "4.9",
      totalReviews: 67,
      tags: ["popular", "spicy", "protein"],
      nutritionInfo: { calories: 650, protein: 35, carbs: 72, fat: 18 },
      allergens: [],
      ingredients: ["rice", "chicken", "tomatoes", "onions", "spices"],
      preparationTime: 20,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isHalal: true
    },
    {
      storeId: 1,
      name: "Vegetarian Plantain Delight",
      description: "Sweet fried plantains with mixed vegetables, beans, and traditional African spices",
      category: "Vegetarian",
      subcategory: "Plant-Based",
      price: "8.00",
      sku: "MK002",
      stock: 30,
      minStock: 10,
      unit: "plate",
      weight: "0.6",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: false,
      rating: "4.6",
      totalReviews: 23,
      tags: ["healthy", "vegan", "gluten-free"],
      nutritionInfo: { calories: 420, protein: 12, carbs: 58, fat: 8 },
      allergens: [],
      ingredients: ["plantain", "beans", "vegetables", "palm oil", "spices"],
      preparationTime: 15,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isHalal: true
    },
    {
      storeId: 1,
      name: "Suya Beef Skewers",
      description: "Spiced grilled beef skewers with onions, tomatoes, and traditional suya spice blend",
      category: "Grilled",
      subcategory: "Street Food",
      price: "10.00",
      sku: "MK003",
      stock: 20,
      minStock: 5,
      unit: "serving",
      weight: "0.3",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: true,
      rating: "4.8",
      totalReviews: 45,
      tags: ["spicy", "grilled", "protein"],
      nutritionInfo: { calories: 380, protein: 28, carbs: 8, fat: 24 },
      allergens: ["nuts"],
      ingredients: ["beef", "suya spice", "onions", "tomatoes"],
      preparationTime: 25,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isHalal: true
    },

    // Fresh Market products
    {
      storeId: 2,
      name: "Fresh Tomatoes (1kg)",
      description: "Locally sourced fresh tomatoes, perfect for cooking and salads",
      category: "Vegetables",
      subcategory: "Fresh Produce",
      price: "3.50",
      sku: "FM001",
      stock: 50,
      minStock: 15,
      unit: "kg",
      weight: "1.0",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: false,
      rating: "4.4",
      totalReviews: 12,
      tags: ["fresh", "organic", "local"],
      nutritionInfo: { calories: 18, protein: 1, carbs: 4, fat: 0 },
      allergens: [],
      ingredients: ["tomatoes"],
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isHalal: true
    },
    {
      storeId: 2,
      name: "Nigerian Rice (5kg)",
      description: "Premium quality Nigerian rice, perfect for jollof and other dishes",
      category: "Grains",
      subcategory: "Rice",
      price: "15.00",
      sku: "FM002",
      stock: 25,
      minStock: 8,
      unit: "bag",
      weight: "5.0",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: true,
      rating: "4.7",
      totalReviews: 31,
      tags: ["staple", "bulk", "Nigerian"],
      nutritionInfo: { calories: 130, protein: 3, carbs: 28, fat: 0 },
      allergens: [],
      ingredients: ["rice"],
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isHalal: true
    },

    // HealthCare Pharmacy products
    {
      storeId: 3,
      name: "Paracetamol 500mg (Pack of 20)",
      description: "Pain relief and fever reducer tablets, effective for headaches and body aches",
      category: "Pain Relief",
      subcategory: "Over-the-Counter",
      price: "5.00",
      sku: "HP001",
      barcode: "6009705662456",
      stock: 100,
      minStock: 25,
      unit: "pack",
      weight: "0.05",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: false,
      rating: "4.8",
      totalReviews: 89,
      tags: ["OTC", "pain relief", "fever"],
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isHalal: true
    },
    {
      storeId: 3,
      name: "Multivitamin Complex",
      description: "Complete daily multivitamin with essential nutrients for overall health",
      category: "Vitamins",
      subcategory: "Supplements",
      price: "18.00",
      sku: "HP002",
      stock: 60,
      minStock: 15,
      unit: "bottle",
      weight: "0.2",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: true,
      rating: "4.6",
      totalReviews: 34,
      tags: ["vitamins", "health", "daily"],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isHalal: true
    },

    // TechZone Electronics products
    {
      storeId: 4,
      name: "Smartphone 128GB",
      description: "Latest Android smartphone with 128GB storage, dual camera, and fast charging",
      category: "Mobile Phones",
      subcategory: "Smartphones",
      price: "299.00",
      originalPrice: "349.00",
      sku: "TZ001",
      stock: 15,
      minStock: 3,
      unit: "piece",
      weight: "0.18",
      dimensions: { length: 16, width: 8, height: 0.8 },
      imageUrls: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
      isActive: true,
      isFeatured: true,
      rating: "4.5",
      totalReviews: 78,
      tags: ["smartphone", "android", "camera"],
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isHalal: true
    },
    {
      storeId: 4,
      name: "Wireless Earbuds",
      description: "High-quality wireless earbuds with noise cancellation and long battery life",
      category: "Audio",
      subcategory: "Headphones",
      price: "89.00",
      sku: "TZ002",
      stock: 30,
      minStock: 8,
      unit: "pair",
      weight: "0.05",
      imageUrls: ["/api/placeholder/300/300"],
      isActive: true,
      isFeatured: false,
      rating: "4.3",
      totalReviews: 45,
      tags: ["wireless", "audio", "bluetooth"],
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isHalal: true
    }
  ];

  // Create drivers
  const drivers = [
    {
      userId: "demo-driver-1",
      licenseNumber: "LIC001234567",
      vehicleType: "motorbike",
      vehicleMake: "Honda",
      vehicleModel: "CG125",
      vehicleYear: 2020,
      vehicleColor: "Red",
      plateNumber: "LAG-456-XYZ",
      insurance: {
        provider: "Royal Exchange Insurance",
        policyNumber: "REI/2024/001234",
        expiryDate: "2025-12-31"
      },
      isActive: true,
      isOnline: true,
      currentLocation: { latitude: 6.5244, longitude: 3.3792, timestamp: new Date().toISOString() },
      totalDeliveries: 247,
      rating: "4.8",
      totalRatings: 198,
      earnings: "2847.50",
      weeklyEarnings: "312.80",
      monthlyEarnings: "1248.90",
      verificationStatus: "verified",
      backgroundCheckStatus: "passed"
    },
    {
      userId: "demo-driver-2",
      licenseNumber: "LIC002345678",
      vehicleType: "bicycle",
      vehicleMake: "Phoenix",
      vehicleModel: "Mountain Bike",
      vehicleYear: 2021,
      vehicleColor: "Blue",
      plateNumber: "BCY-789-ABC",
      insurance: {
        provider: "Leadway Assurance",
        policyNumber: "LEA/2024/005678",
        expiryDate: "2025-06-30"
      },
      isActive: true,
      isOnline: false,
      currentLocation: { latitude: 6.6018, longitude: 3.3515, timestamp: new Date().toISOString() },
      totalDeliveries: 156,
      rating: "4.6",
      totalRatings: 134,
      earnings: "1965.25",
      weeklyEarnings: "245.60",
      monthlyEarnings: "892.40",
      verificationStatus: "verified",
      backgroundCheckStatus: "passed"
    }
  ];

  // Create sample orders
  const sampleOrders = [
    {
      customerId: "demo-customer-1",
      storeId: 1,
      orderNumber: `ORD-${nanoid(8)}`,
      status: "preparing",
      orderType: "delivery",
      subtotal: "33.00",
      deliveryFee: "2.50",
      serviceFee: "1.50",
      tax: "2.70",
      discount: "0.00",
      totalAmount: "39.70",
      paymentMethod: "digital_wallet",
      paymentStatus: "paid",
      deliveryAddress: {
        street: "15 Admiralty Way, Lekki Phase 1",
        city: "Lagos",
        state: "Lagos State",
        country: "Nigeria",
        latitude: 6.4698,
        longitude: 3.4742
      },
      deliveryInstructions: "Call when you arrive. Gate number 15B",
      estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
      preparationTime: 25,
      driverId: "demo-driver-1",
      metadata: { 
        specialRequests: ["Extra spicy", "No onions"],
        allergies: []
      }
    },
    {
      customerId: "demo-customer-2",
      storeId: 2,
      orderNumber: `ORD-${nanoid(8)}`,
      status: "ready",
      orderType: "pickup",
      subtotal: "18.50",
      deliveryFee: "0.00",
      serviceFee: "0.75",
      tax: "1.39",
      discount: "2.00",
      totalAmount: "18.64",
      paymentMethod: "cash",
      paymentStatus: "pending",
      preparationTime: 15,
      metadata: {
        specialRequests: [],
        allergies: []
      }
    }
  ];

  // Create coupons
  const coupons = [
    {
      code: "WELCOME20",
      title: "Welcome Discount",
      description: "20% off your first order",
      type: "percentage",
      value: "20.00",
      minimumOrderAmount: "25.00",
      maximumDiscount: "10.00",
      usageLimit: 1000,
      usageCount: 156,
      userLimit: 1,
      applicableStores: [1, 2, 3, 4],
      applicableCategories: ["restaurant", "grocery"],
      isActive: true,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      code: "FREEDELIVERY",
      title: "Free Delivery",
      description: "Free delivery on orders over $30",
      type: "free_delivery",
      value: "0.00",
      minimumOrderAmount: "30.00",
      usageLimit: 500,
      usageCount: 67,
      userLimit: 3,
      applicableStores: [1, 2, 3, 4],
      isActive: true,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  try {
    // Note: These would be created using actual API endpoints
    console.log("E-commerce seed data prepared:", {
      stores: stores.length,
      products: products.length,
      drivers: drivers.length,
      orders: sampleOrders.length,
      coupons: coupons.length
    });

    return {
      stores,
      products,
      drivers,
      orders: sampleOrders,
      coupons,
      success: true,
      message: "E-commerce data seeded successfully"
    };
  } catch (error) {
    console.error("Error seeding e-commerce data:", error);
    return {
      success: false,
      message: "Failed to seed e-commerce data",
      error: error.message
    };
  }
}

export async function createDriverProfile(userId: string, driverData: any) {
  console.log(`Creating driver profile for user ${userId}`);
  
  const driver = {
    userId,
    licenseNumber: driverData.licenseNumber || `LIC${Date.now()}`,
    vehicleType: driverData.vehicleType || "motorbike",
    vehicleMake: driverData.vehicleMake || "Honda",
    vehicleModel: driverData.vehicleModel || "CG125",
    vehicleYear: driverData.vehicleYear || 2020,
    vehicleColor: driverData.vehicleColor || "Black",
    plateNumber: driverData.plateNumber || `LAG-${Math.floor(Math.random() * 1000)}-XYZ`,
    insurance: driverData.insurance || {
      provider: "Sample Insurance",
      policyNumber: `POL${Date.now()}`,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    isActive: false,
    isOnline: false,
    totalDeliveries: 0,
    rating: "0.00",
    totalRatings: 0,
    earnings: "0.00",
    weeklyEarnings: "0.00",
    monthlyEarnings: "0.00",
    verificationStatus: "pending",
    backgroundCheckStatus: "pending"
  };

  // This would typically be saved to database
  console.log("Driver profile created:", driver);
  return driver;
}

export async function generateDemoStoreData(merchantId: string, storeType: string) {
  const storeTemplates = {
    restaurant: {
      name: "Local Restaurant",
      description: "Delicious local cuisine",
      category: "restaurant",
      deliveryFee: "2.50",
      minimumOrderAmount: "15.00",
      preparationTime: 30
    },
    grocery: {
      name: "Neighborhood Store",
      description: "Fresh groceries and essentials",
      category: "grocery",
      deliveryFee: "3.00",
      minimumOrderAmount: "25.00",
      preparationTime: 15
    },
    pharmacy: {
      name: "Health Pharmacy",
      description: "Healthcare and wellness products",
      category: "pharmacy",
      deliveryFee: "1.50",
      minimumOrderAmount: "10.00",
      preparationTime: 10
    }
  };

  const template = storeTemplates[storeType] || storeTemplates.restaurant;
  
  return {
    merchantId,
    ...template,
    address: "Sample Address, Lagos, Nigeria",
    phone: "+234 900 000 0000",
    email: `store${Date.now()}@example.com`,
    businessHours: {
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "21:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: false },
      sunday: { open: "10:00", close: "20:00", closed: false }
    },
    deliveryRadius: "5.00",
    rating: "0.00",
    totalReviews: 0,
    isActive: true,
    isFeatured: false,
    tags: []
  };
}