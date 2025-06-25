import { Request, Response } from 'express';
import { storage } from './storage.js';

// Multi-Currency Support for African Markets
// Handles currency conversion, exchange rates, and local currency support

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  decimals: number;
  isActive: boolean;
}

interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  bid: number;
  ask: number;
  lastUpdated: string;
  source: string;
}

interface CurrencyConversion {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
}

// Supported African currencies
const AFRICAN_CURRENCIES: Currency[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria', decimals: 2, isActive: true },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', country: 'Ghana', decimals: 2, isActive: true },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya', decimals: 2, isActive: true },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', country: 'Uganda', decimals: 0, isActive: true },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', country: 'Tanzania', decimals: 0, isActive: true },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', decimals: 2, isActive: true },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'Egypt', decimals: 2, isActive: true },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', country: 'Morocco', decimals: 2, isActive: true },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'Ethiopia', decimals: 2, isActive: true },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', country: 'West Africa', decimals: 0, isActive: true },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', country: 'Central Africa', decimals: 0, isActive: true },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', country: 'Botswana', decimals: 2, isActive: true },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', country: 'Mozambique', decimals: 2, isActive: true },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', country: 'Zambia', decimals: 2, isActive: true },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', country: 'Rwanda', decimals: 0, isActive: true },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'International', decimals: 2, isActive: true },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'International', decimals: 2, isActive: true }
];

// Get supported currencies
export async function getSupportedCurrencies(req: Request, res: Response) {
  try {
    const { country } = req.query;
    
    let currencies = AFRICAN_CURRENCIES.filter(currency => currency.isActive);
    
    if (country) {
      currencies = currencies.filter(currency => 
        currency.country.toLowerCase() === (country as string).toLowerCase() ||
        currency.country === 'International'
      );
    }
    
    res.json({
      currencies,
      totalSupported: currencies.length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get currencies error:', error);
    res.status(500).json({ error: 'Failed to get supported currencies' });
  }
}

// Get current exchange rates
export async function getExchangeRates(req: Request, res: Response) {
  try {
    const { from, to } = req.query;
    
    if (from && to) {
      // Get specific exchange rate
      const rate = await getExchangeRate(from as string, to as string);
      if (!rate) {
        return res.status(404).json({ error: 'Exchange rate not found' });
      }
      res.json(rate);
    } else {
      // Get all exchange rates (limited to USD base for demo)
      const baseRates = await getAllExchangeRates('USD');
      res.json({
        baseCurrency: 'USD',
        rates: baseRates,
        lastUpdated: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Get exchange rates error:', error);
    res.status(500).json({ error: 'Failed to get exchange rates' });
  }
}

// Convert currency amounts
export async function convertCurrency(req: Request, res: Response) {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({ error: 'Amount, from currency, and to currency required' });
    }
    
    const conversion = await performCurrencyConversion(
      parseFloat(amount),
      fromCurrency,
      toCurrency
    );
    
    res.json(conversion);
    
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
}

// Process multi-currency transaction
export async function processMultiCurrencyTransaction(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { 
      recipientId, 
      amount, 
      fromCurrency, 
      toCurrency, 
      acceptRate,
      pin 
    } = req.body;
    
    // Validate PIN
    const isValidPin = await validateUserPin(userId, pin);
    if (!isValidPin) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }
    
    // Get current exchange rate
    const currentRate = await getExchangeRate(fromCurrency, toCurrency);
    if (!currentRate) {
      return res.status(400).json({ error: 'Exchange rate not available' });
    }
    
    // Verify user accepted the rate (rate protection)
    if (Math.abs(currentRate.rate - acceptRate) > 0.01) {
      return res.status(400).json({ 
        error: 'Exchange rate changed',
        newRate: currentRate.rate,
        requireConfirmation: true
      });
    }
    
    // Perform conversion
    const conversion = await performCurrencyConversion(
      parseFloat(amount),
      fromCurrency,
      toCurrency
    );
    
    // Check sender balance
    const senderWallets = await storage.getUserWallets(userId);
    const senderWallet = senderWallets.find(w => 
      w.walletType === 'primary' && w.currency === fromCurrency
    );
    
    if (!senderWallet) {
      return res.status(400).json({ 
        error: `No ${fromCurrency} wallet found` 
      });
    }
    
    const senderBalance = parseFloat(senderWallet.balance);
    if (senderBalance < conversion.totalCost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Check recipient wallet
    const recipientWallets = await storage.getUserWallets(recipientId);
    const recipientWallet = recipientWallets.find(w => 
      w.walletType === 'primary' && w.currency === toCurrency
    );
    
    if (!recipientWallet) {
      return res.status(400).json({ 
        error: `Recipient has no ${toCurrency} wallet` 
      });
    }
    
    // Process transaction
    const transactionRef = `FX${Date.now()}`;
    
    // Update sender balance
    await storage.updateWalletBalance(
      senderWallet.id,
      (senderBalance - conversion.totalCost).toString()
    );
    
    // Update recipient balance
    const recipientBalance = parseFloat(recipientWallet.balance);
    await storage.updateWalletBalance(
      recipientWallet.id,
      (recipientBalance + conversion.toAmount).toString()
    );
    
    // Create transaction records
    await storage.createTransaction({
      fromWalletId: senderWallet.id,
      toWalletId: recipientWallet.id,
      amount: amount.toString(),
      type: 'send',
      status: 'completed',
      description: `Cross-currency transfer (${fromCurrency} to ${toCurrency})`,
      reference: transactionRef,
      metadata: {
        currencyConversion: conversion,
        exchangeRate: currentRate,
        originalAmount: amount,
        convertedAmount: conversion.toAmount
      }
    });
    
    res.json({
      success: true,
      transactionId: transactionRef,
      conversion,
      exchangeRate: currentRate,
      processedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Multi-currency transaction error:', error);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
}

// Get user's multi-currency balances
export async function getMultiCurrencyBalances(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const wallets = await storage.getUserWallets(userId);
    const rates = await getAllExchangeRates('USD');
    
    const balances = wallets.map(wallet => {
      const currency = AFRICAN_CURRENCIES.find(c => c.code === wallet.currency);
      const rate = rates.find(r => r.toCurrency === wallet.currency);
      const balance = parseFloat(wallet.balance);
      
      return {
        walletId: wallet.id,
        currency: wallet.currency,
        currencyInfo: currency,
        balance,
        formattedBalance: formatCurrency(balance, wallet.currency),
        usdValue: rate ? balance / rate.rate : balance,
        walletType: wallet.walletType
      };
    });
    
    const totalUsdValue = balances.reduce((sum, b) => sum + (b.usdValue || 0), 0);
    
    res.json({
      balances,
      totalUsdValue,
      supportedCurrencies: AFRICAN_CURRENCIES.filter(c => c.isActive).length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get multi-currency balances error:', error);
    res.status(500).json({ error: 'Failed to get balances' });
  }
}

// Helper functions

async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRate | null> {
  // Demo exchange rates - in production, integrate with real exchange rate APIs
  const demoRates: Record<string, Record<string, number>> = {
    'USD': {
      'NGN': 1480.00,
      'GHS': 12.10,
      'KES': 129.50,
      'UGX': 3720.00,
      'TZS': 2380.00,
      'ZAR': 18.20,
      'EGP': 48.90,
      'MAD': 9.85,
      'ETB': 120.50,
      'XOF': 590.00,
      'XAF': 590.00,
      'BWP': 13.40,
      'MZN': 63.80,
      'ZMW': 26.50,
      'RWF': 1320.00,
      'EUR': 0.85
    }
  };
  
  if (fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      rate: 1.0,
      bid: 1.0,
      ask: 1.0,
      lastUpdated: new Date().toISOString(),
      source: 'internal'
    };
  }
  
  let rate = 1.0;
  
  if (fromCurrency === 'USD' && demoRates.USD[toCurrency]) {
    rate = demoRates.USD[toCurrency];
  } else if (toCurrency === 'USD' && demoRates.USD[fromCurrency]) {
    rate = 1 / demoRates.USD[fromCurrency];
  } else if (demoRates.USD[fromCurrency] && demoRates.USD[toCurrency]) {
    // Cross-currency via USD
    rate = demoRates.USD[toCurrency] / demoRates.USD[fromCurrency];
  } else {
    return null;
  }
  
  // Add bid/ask spread (0.5%)
  const spread = 0.005;
  
  return {
    fromCurrency,
    toCurrency,
    rate,
    bid: rate * (1 - spread),
    ask: rate * (1 + spread),
    lastUpdated: new Date().toISOString(),
    source: 'demo_rates'
  };
}

async function getAllExchangeRates(baseCurrency: string): Promise<ExchangeRate[]> {
  const rates: ExchangeRate[] = [];
  
  for (const currency of AFRICAN_CURRENCIES) {
    if (currency.code !== baseCurrency && currency.isActive) {
      const rate = await getExchangeRate(baseCurrency, currency.code);
      if (rate) {
        rates.push(rate);
      }
    }
  }
  
  return rates;
}

async function performCurrencyConversion(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<CurrencyConversion> {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  
  if (!exchangeRate) {
    throw new Error('Exchange rate not available');
  }
  
  // Use ask rate for conversions (less favorable to user, more realistic)
  const rate = exchangeRate.ask;
  const convertedAmount = amount * rate;
  
  // Calculate conversion fee (0.25% of converted amount, minimum $0.50 equivalent)
  const feeRate = 0.0025;
  let fee = convertedAmount * feeRate;
  
  // Minimum fee equivalent to $0.50 USD
  const minFeeUsd = 0.50;
  const minFeeRate = await getExchangeRate('USD', toCurrency);
  const minFee = minFeeRate ? minFeeUsd * minFeeRate.rate : 0;
  
  fee = Math.max(fee, minFee);
  
  const totalCost = amount + (fee / rate); // Convert fee back to source currency
  
  return {
    fromAmount: amount,
    fromCurrency,
    toAmount: convertedAmount,
    toCurrency,
    exchangeRate: rate,
    fee,
    totalCost
  };
}

function formatCurrency(amount: number, currencyCode: string): string {
  const currency = AFRICAN_CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;
  
  const decimals = currency.decimals;
  const formatted = amount.toFixed(decimals);
  
  return `${currency.symbol}${formatted}`;
}

async function validateUserPin(userId: string, pin: string): Promise<boolean> {
  // Simplified PIN validation for demo
  return pin === '1234';
}