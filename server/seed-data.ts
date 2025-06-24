import { db } from "./db";
import {
  digitalAssets,
  assetHoldings,
  investmentProducts,
  userInvestments,
  creditFacilities,
  tradingPairs,
  transactions,
  userRoles,
  merchants,
  agents,
  wallets,
} from "../shared/schema.js";

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");

    // Check if data already exists
    const existingAssets = await db.select().from(digitalAssets).limit(1);
    if (existingAssets.length > 0) {
      console.log("Sample data already exists, skipping seed");
      return { message: "Sample data already exists" };
    }

    // Seed digital assets
    const assets = await db.insert(digitalAssets).values([
      {
        symbol: "USD",
        name: "US Dollar",
        type: "fiat",
        decimals: 2,
        exchangeRate: "1.00",
        isActive: true,
      },
      {
        symbol: "EUR",
        name: "Euro",
        type: "fiat",
        decimals: 2,
        exchangeRate: "0.85",
        isActive: true,
      },
      {
        symbol: "GBP",
        name: "British Pound",
        type: "fiat",
        decimals: 2,
        exchangeRate: "0.75",
        isActive: true,
      },
      {
        symbol: "NGN",
        name: "Nigerian Naira",
        type: "fiat",
        decimals: 2,
        exchangeRate: "460.00",
        isActive: true,
      },
      {
        symbol: "KES",
        name: "Kenyan Shilling",
        type: "fiat",
        decimals: 2,
        exchangeRate: "150.00",
        isActive: true,
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        type: "cryptocurrency",
        decimals: 8,
        exchangeRate: "42500.00",
        marketCap: "830000000000",
        volume24h: "15000000000",
        priceChange24h: "2.45",
        isActive: true,
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        type: "cryptocurrency",
        decimals: 18,
        exchangeRate: "2800.00",
        marketCap: "340000000000",
        volume24h: "8000000000",
        priceChange24h: "-1.23",
        isActive: true,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        type: "stablecoin",
        decimals: 6,
        exchangeRate: "1.00",
        marketCap: "25000000000",
        volume24h: "2000000000",
        priceChange24h: "0.01",
        isActive: true,
      },
      {
        symbol: "eNAIRA",
        name: "eNaira",
        type: "cbdc",
        decimals: 2,
        exchangeRate: "460.00",
        marketCap: "1000000000",
        volume24h: "50000000",
        priceChange24h: "0.00",
        isActive: true,
      },
    ]).returning();

    // Seed investment products
    const products = await db.insert(investmentProducts).values([
      {
        name: "AfriSave High Yield",
        description: "High-yield savings account with daily interest",
        type: "savings",
        riskLevel: "low",
        expectedReturn: "8.50",
        minimumAmount: "100.00",
        maximumAmount: "50000.00",
        tenure: 12,
        currency: "USD",
        isActive: true,
      },
      {
        name: "AfriGrow Fixed Deposit",
        description: "Fixed deposit with guaranteed returns",
        type: "fixed_deposit",
        riskLevel: "low",
        expectedReturn: "12.00",
        minimumAmount: "500.00",
        maximumAmount: "100000.00",
        tenure: 24,
        currency: "USD",
        isActive: true,
      },
      {
        name: "African Markets Fund",
        description: "Diversified mutual fund across African markets",
        type: "mutual_fund",
        riskLevel: "medium",
        expectedReturn: "15.75",
        minimumAmount: "250.00",
        maximumAmount: "25000.00",
        tenure: 36,
        currency: "USD",
        isActive: true,
      },
      {
        name: "Government Bonds Portfolio",
        description: "Secure government bonds with stable returns",
        type: "bonds",
        riskLevel: "low",
        expectedReturn: "9.25",
        minimumAmount: "1000.00",
        maximumAmount: "75000.00",
        tenure: 60,
        currency: "USD",
        isActive: true,
      },
      {
        name: "Tech Stocks Bundle",
        description: "African technology companies stock portfolio",
        type: "stocks",
        riskLevel: "high",
        expectedReturn: "22.50",
        minimumAmount: "500.00",
        maximumAmount: "30000.00",
        tenure: 24,
        currency: "USD",
        isActive: true,
      },
    ]).returning();

    // Seed trading pairs
    const btcAsset = assets.find(a => a.symbol === "BTC");
    const ethAsset = assets.find(a => a.symbol === "ETH");
    const usdAsset = assets.find(a => a.symbol === "USD");
    const usdcAsset = assets.find(a => a.symbol === "USDC");

    if (btcAsset && ethAsset && usdAsset && usdcAsset) {
      await db.insert(tradingPairs).values([
        {
          baseAssetId: btcAsset.id,
          quoteAssetId: usdAsset.id,
          symbol: "BTC/USD",
          lastPrice: "42500.00",
          volume24h: "850.5",
          priceChange24h: "2.45",
          isActive: true,
        },
        {
          baseAssetId: ethAsset.id,
          quoteAssetId: usdAsset.id,
          symbol: "ETH/USD",
          lastPrice: "2800.00",
          volume24h: "2350.8",
          priceChange24h: "-1.23",
          isActive: true,
        },
        {
          baseAssetId: btcAsset.id,
          quoteAssetId: ethAsset.id,
          symbol: "BTC/ETH",
          lastPrice: "15.18",
          volume24h: "125.2",
          priceChange24h: "3.75",
          isActive: true,
        },
      ]);
    }

    console.log("Database seeded successfully!");
    return {
      assets,
      products,
      message: "Sample data created successfully"
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export async function createUserSampleData(userId: string, role: string) {
  try {
    console.log(`Creating sample data for user ${userId} with role ${role}`);

    // Create multiple wallet types
    const userWallets = await db.insert(wallets).values([
      {
        userId,
        walletType: "primary",
        balance: role === "consumer" ? "1250.75" : role === "merchant" ? "5670.25" : "8900.50",
        currency: "USD",
        dailyLimit: "5000.00",
        monthlyLimit: "50000.00",
        isActive: true,
      },
      {
        userId,
        walletType: "savings",
        balance: role === "consumer" ? "850.00" : role === "merchant" ? "3200.00" : "1500.00",
        currency: "USD",
        dailyLimit: "2000.00",
        monthlyLimit: "20000.00",
        isActive: true,
      },
      {
        userId,
        walletType: "crypto",
        balance: "0.00",
        currency: "USD",
        dailyLimit: "10000.00",
        monthlyLimit: "100000.00",
        isActive: true,
      },
      {
        userId,
        walletType: "investment",
        balance: "0.00",
        currency: "USD",
        dailyLimit: "25000.00",
        monthlyLimit: "250000.00",
        isActive: true,
      },
    ]).returning();

    const primaryWallet = userWallets.find(w => w.walletType === "primary");
    const cryptoWallet = userWallets.find(w => w.walletType === "crypto");
    const investmentWallet = userWallets.find(w => w.walletType === "investment");

    // Get assets for holdings
    const assets = await db.select().from(digitalAssets);
    const btcAsset = assets.find(a => a.symbol === "BTC");
    const ethAsset = assets.find(a => a.symbol === "ETH");
    const usdcAsset = assets.find(a => a.symbol === "USDC");

    // Create crypto holdings for demonstration
    if (cryptoWallet && btcAsset && ethAsset && usdcAsset) {
      await db.insert(assetHoldings).values([
        {
          walletId: cryptoWallet.id,
          assetId: btcAsset.id,
          balance: role === "consumer" ? "0.025" : role === "merchant" ? "0.15" : "0.35",
          averageBuyPrice: "40000.00",
          totalInvested: role === "consumer" ? "1000.00" : role === "merchant" ? "6000.00" : "14000.00",
          lastTransactionAt: new Date(),
        },
        {
          walletId: cryptoWallet.id,
          assetId: ethAsset.id,
          balance: role === "consumer" ? "0.5" : role === "merchant" ? "2.8" : "5.2",
          averageBuyPrice: "2500.00",
          totalInvested: role === "consumer" ? "1250.00" : role === "merchant" ? "7000.00" : "13000.00",
          lastTransactionAt: new Date(),
        },
        {
          walletId: cryptoWallet.id,
          assetId: usdcAsset.id,
          balance: role === "consumer" ? "500.00" : role === "merchant" ? "2500.00" : "5000.00",
          averageBuyPrice: "1.00",
          totalInvested: role === "consumer" ? "500.00" : role === "merchant" ? "2500.00" : "5000.00",
          lastTransactionAt: new Date(),
        },
      ]);
    }

    // Create investment holdings
    const products = await db.select().from(investmentProducts);
    if (investmentWallet && products.length > 0) {
      const investmentData = [];
      
      if (role === "consumer") {
        investmentData.push(
          {
            userId,
            productId: products[0].id, // AfriSave High Yield
            principalAmount: "500.00",
            currentValue: "542.30",
            interestEarned: "42.30",
            status: "active" as const,
            startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
            maturityDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), // 275 days from now
          }
        );
      } else if (role === "merchant") {
        investmentData.push(
          {
            userId,
            productId: products[1].id, // AfriGrow Fixed Deposit
            principalAmount: "2000.00",
            currentValue: "2160.00",
            interestEarned: "160.00",
            status: "active" as const,
            startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
            maturityDate: new Date(Date.now() + 610 * 24 * 60 * 60 * 1000), // 610 days from now
          },
          {
            userId,
            productId: products[2].id, // African Markets Fund
            principalAmount: "1500.00",
            currentValue: "1687.50",
            interestEarned: "187.50",
            status: "active" as const,
            startDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 60 * 1000), // 150 days ago
            maturityDate: new Date(Date.now() + 945 * 24 * 60 * 60 * 1000), // 945 days from now
          }
        );
      } else if (role === "agent") {
        investmentData.push(
          {
            userId,
            productId: products[3].id, // Government Bonds
            principalAmount: "5000.00",
            currentValue: "5385.42",
            interestEarned: "385.42",
            status: "active" as const,
            startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
            maturityDate: new Date(Date.now() + 1620 * 24 * 60 * 60 * 1000), // 1620 days from now
          },
          {
            userId,
            productId: products[4].id, // Tech Stocks
            principalAmount: "3000.00",
            currentValue: "3450.00",
            interestEarned: "450.00",
            status: "active" as const,
            startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
            maturityDate: new Date(Date.now() + 640 * 24 * 60 * 60 * 1000), // 640 days from now
          }
        );
      }

      if (investmentData.length > 0) {
        await db.insert(userInvestments).values(investmentData);
      }
    }

    // Create credit facilities
    if (role !== "consumer") { // Merchants and agents get credit facilities
      const creditData = [];
      
      if (role === "merchant") {
        creditData.push({
          userId,
          type: "credit_line" as const,
          creditLimit: "10000.00",
          availableCredit: "7500.00",
          usedCredit: "2500.00",
          interestRate: "18.50",
          status: "active" as const,
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      } else if (role === "agent") {
        creditData.push(
          {
            userId,
            type: "credit_line" as const,
            creditLimit: "25000.00",
            availableCredit: "20000.00",
            usedCredit: "5000.00",
            interestRate: "15.75",
            status: "active" as const,
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          {
            userId,
            type: "overdraft" as const,
            creditLimit: "5000.00",
            availableCredit: "5000.00",
            usedCredit: "0.00",
            interestRate: "22.00",
            status: "active" as const,
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        );
      }

      if (creditData.length > 0) {
        await db.insert(creditFacilities).values(creditData);
      }
    }

    // Create sample transactions based on role
    if (primaryWallet) {
      const transactionData = [];
      const now = new Date();
      
      if (role === "consumer") {
        transactionData.push(
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "500.00",
            currency: "USD",
            type: "topup" as const,
            status: "completed" as const,
            description: "Mobile money top-up",
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            fromWalletId: primaryWallet.id,
            toWalletId: null,
            amount: "25.00",
            currency: "USD",
            type: "payment" as const,
            status: "completed" as const,
            description: "Coffee purchase",
            merchantId: "merchant_001",
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            fromWalletId: primaryWallet.id,
            toWalletId: null,
            amount: "15.50",
            currency: "USD",
            type: "payment" as const,
            status: "completed" as const,
            description: "Bus fare",
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            fromWalletId: primaryWallet.id,
            toWalletId: null,
            amount: "75.00",
            currency: "USD",
            type: "payment" as const,
            status: "completed" as const,
            description: "Grocery shopping",
            merchantId: "merchant_002",
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "200.00",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Family transfer",
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          }
        );
      } else if (role === "merchant") {
        transactionData.push(
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "125.00",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Customer payment",
            createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "89.50",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Online order payment",
            createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "67.25",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Customer payment",
            createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          },
          {
            fromWalletId: primaryWallet.id,
            toWalletId: null,
            amount: "1200.00",
            currency: "USD",
            type: "payment" as const,
            status: "completed" as const,
            description: "Inventory purchase",
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "234.75",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Bulk order payment",
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          }
        );
      } else if (role === "agent") {
        transactionData.push(
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "25.00",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Cash-in commission",
            createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "15.50",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Cash-out commission",
            createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "45.00",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "Account opening commission",
            createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          },
          {
            fromWalletId: primaryWallet.id,
            toWalletId: null,
            amount: "5000.00",
            currency: "USD",
            type: "payment" as const,
            status: "completed" as const,
            description: "Float restock",
            createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
          {
            fromWalletId: null,
            toWalletId: primaryWallet.id,
            amount: "32.50",
            currency: "USD",
            type: "receive" as const,
            status: "completed" as const,
            description: "KYC verification commission",
            createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
          }
        );
      }

      if (transactionData.length > 0) {
        await db.insert(transactions).values(transactionData);
      }
    }

    // Create role-specific data
    if (role === "merchant") {
      await db.insert(merchants).values([{
        userId,
        businessName: "AfriMart General Store",
        businessType: "retail",
        businessLicense: "BL-2024-001234",
        taxId: "TAX-NGR-567890",
        address: "123 Lagos Street, Victoria Island, Lagos, Nigeria",
        phoneNumber: "+234-801-234-5678",
        businessHours: {
          monday: "08:00-20:00",
          tuesday: "08:00-20:00",
          wednesday: "08:00-20:00",
          thursday: "08:00-20:00",
          friday: "08:00-20:00",
          saturday: "09:00-18:00",
          sunday: "10:00-16:00"
        },
        paymentMethods: ["cash", "card", "mobile_money", "qr_code"],
        qrCodeData: `merchant:${userId}:AfriMart`,
        commissionRate: "2.50",
        isVerified: true,
      }]);
    } else if (role === "agent") {
      await db.insert(agents).values([{
        userId,
        agentCode: `AG${userId.slice(-6).toUpperCase()}`,
        territory: "Lagos Zone A",
        commissionRate: "3.50",
        floatBalance: "15000.00",
        dailyLimit: "50000.00",
        isActive: true,
        supervisorId: null,
      }]);
    }

    // Add role to user_roles
    await db.insert(userRoles).values([{
      userId,
      role: role as "consumer" | "merchant" | "agent",
      isActive: true,
      permissions: {
        wallet: ["view", "transfer", "topup"],
        transactions: ["view", "create"],
        ...(role === "merchant" && {
          merchant: ["dashboard", "qr_generate", "analytics"],
          payments: ["accept", "refund"]
        }),
        ...(role === "agent" && {
          agent: ["dashboard", "cash_in", "cash_out", "kyc_verify"],
          customers: ["onboard", "verify", "support"]
        })
      }
    }]);

    console.log(`Sample data created successfully for ${role} user`);
    return { message: `Sample data created for ${role}` };
  } catch (error) {
    console.error("Error creating user sample data:", error);
    throw error;
  }
}