import { Request, Response } from 'express';
import { storage } from './storage.js';

// Agent Network Management System
// Handles cash-in/cash-out operations and agent management

interface Agent {
  id: string;
  userId: string;
  agentCode: string;
  businessName: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    region: string;
  };
  services: string[];
  cashBalance: number;
  floatBalance: number;
  commission: {
    cashIn: number;
    cashOut: number;
    billPayment: number;
  };
  status: 'active' | 'inactive' | 'suspended';
  workingHours: {
    open: string;
    close: string;
    days: string[];
  };
  rating: number;
  totalTransactions: number;
  verificationLevel: 'basic' | 'verified' | 'premium';
}

interface CashTransaction {
  id: string;
  agentId: string;
  customerId: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  commission: number;
  customerPhone: string;
  agentCode: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  metadata?: any;
}

// Get nearby agents for cash-in/cash-out
export async function getNearbyAgents(req: Request, res: Response) {
  try {
    const { latitude, longitude, radius = 5, service } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    // Get agents from database (simplified for demo)
    const agents = await getAgentsInRadius(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      parseFloat(radius as string),
      service as string
    );

    // Filter active agents with sufficient float
    const availableAgents = agents.filter(agent => 
      agent.status === 'active' && 
      agent.floatBalance > 1000 && // Minimum float balance
      isAgentWorkingNow(agent.workingHours)
    );

    // Sort by distance and rating
    availableAgents.sort((a, b) => {
      const distanceA = calculateDistance(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        a.location.latitude,
        a.location.longitude
      );
      const distanceB = calculateDistance(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        b.location.latitude,
        b.location.longitude
      );
      
      // Primary sort by distance, secondary by rating
      if (Math.abs(distanceA - distanceB) < 0.5) {
        return b.rating - a.rating;
      }
      return distanceA - distanceB;
    });

    const agentsWithDistance = availableAgents.map(agent => ({
      ...agent,
      distance: calculateDistance(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        agent.location.latitude,
        agent.location.longitude
      )
    }));

    res.json({
      agents: agentsWithDistance.slice(0, 20), // Limit to 20 nearest
      searchRadius: radius,
      totalFound: agentsWithDistance.length
    });

  } catch (error) {
    console.error('Get nearby agents error:', error);
    res.status(500).json({ error: 'Failed to get nearby agents' });
  }
}

// Initiate cash-in transaction
export async function initiateCashIn(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { agentCode, amount, customerPhone } = req.body;

    // Validate input
    if (!agentCode || !amount || !customerPhone) {
      return res.status(400).json({ error: 'Agent code, amount, and phone number required' });
    }

    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount < 10) {
      return res.status(400).json({ error: 'Minimum cash-in amount is 10.00' });
    }

    // Find agent
    const agent = await findAgentByCode(agentCode);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (agent.status !== 'active') {
      return res.status(400).json({ error: 'Agent is not currently active' });
    }

    // Check agent float balance
    if (agent.floatBalance < transactionAmount) {
      return res.status(400).json({ error: 'Agent has insufficient float balance' });
    }

    // Create cash-in transaction
    const transaction = await createCashTransaction({
      agentId: agent.id,
      customerId: userId,
      type: 'cash_in',
      amount: transactionAmount,
      commission: calculateCommission(transactionAmount, 'cash_in'),
      customerPhone,
      agentCode,
      reference: generateTransactionReference(),
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    // Send confirmation to agent (in production, this would be via SMS/push notification)
    await notifyAgent(agent.id, 'cash_in_request', {
      transactionId: transaction.id,
      customerPhone,
      amount: transactionAmount,
      commission: transaction.commission
    });

    res.json({
      success: true,
      transactionId: transaction.id,
      reference: transaction.reference,
      amount: transactionAmount,
      commission: transaction.commission,
      agent: {
        name: agent.businessName,
        code: agent.agentCode,
        location: agent.location
      },
      estimatedCompletion: new Date(Date.now() + 10 * 60000).toISOString() // 10 minutes
    });

  } catch (error) {
    console.error('Initiate cash-in error:', error);
    res.status(500).json({ error: 'Failed to initiate cash-in transaction' });
  }
}

// Initiate cash-out transaction
export async function initiateCashOut(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { agentCode, amount, pin } = req.body;

    // Validate input
    if (!agentCode || !amount || !pin) {
      return res.status(400).json({ error: 'Agent code, amount, and PIN required' });
    }

    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount < 10) {
      return res.status(400).json({ error: 'Minimum cash-out amount is 10.00' });
    }

    // Validate user PIN
    const isValidPin = await validateUserPin(userId, pin);
    if (!isValidPin) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }

    // Check user balance
    const wallets = await storage.getUserWallets(userId);
    const primaryWallet = wallets.find(w => w.walletType === 'primary');
    
    if (!primaryWallet) {
      return res.status(400).json({ error: 'Wallet not found' });
    }

    const userBalance = parseFloat(primaryWallet.balance);
    const commission = calculateCommission(transactionAmount, 'cash_out');
    const totalDeduction = transactionAmount + commission;

    if (userBalance < totalDeduction) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Find agent
    const agent = await findAgentByCode(agentCode);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (agent.status !== 'active') {
      return res.status(400).json({ error: 'Agent is not currently active' });
    }

    // Check agent cash balance
    if (agent.cashBalance < transactionAmount) {
      return res.status(400).json({ error: 'Agent has insufficient cash' });
    }

    // Create cash-out transaction
    const transaction = await createCashTransaction({
      agentId: agent.id,
      customerId: userId,
      type: 'cash_out',
      amount: transactionAmount,
      commission,
      customerPhone: primaryWallet.userId, // Simplified
      agentCode,
      reference: generateTransactionReference(),
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    // Send confirmation to agent
    await notifyAgent(agent.id, 'cash_out_request', {
      transactionId: transaction.id,
      customerId: userId,
      amount: transactionAmount,
      commission
    });

    res.json({
      success: true,
      transactionId: transaction.id,
      reference: transaction.reference,
      amount: transactionAmount,
      commission,
      totalDeduction,
      agent: {
        name: agent.businessName,
        code: agent.agentCode,
        location: agent.location
      },
      estimatedCompletion: new Date(Date.now() + 10 * 60000).toISOString()
    });

  } catch (error) {
    console.error('Initiate cash-out error:', error);
    res.status(500).json({ error: 'Failed to initiate cash-out transaction' });
  }
}

// Agent confirms cash transaction
export async function confirmCashTransaction(req: Request, res: Response) {
  try {
    const agentUserId = req.session?.user?.id;
    if (!agentUserId) {
      return res.status(401).json({ error: 'Agent not authenticated' });
    }

    const { transactionId, pin, action } = req.body;

    if (!transactionId || !pin || !action) {
      return res.status(400).json({ error: 'Transaction ID, PIN, and action required' });
    }

    // Validate agent PIN
    const isValidPin = await validateUserPin(agentUserId, pin);
    if (!isValidPin) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }

    // Find transaction
    const transaction = await findCashTransaction(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction is no longer pending' });
    }

    // Verify agent ownership
    const agent = await findAgentByUserId(agentUserId);
    if (!agent || agent.id !== transaction.agentId) {
      return res.status(403).json({ error: 'Unauthorized agent access' });
    }

    let result;
    if (action === 'confirm') {
      result = await processCashTransaction(transaction);
    } else if (action === 'cancel') {
      result = await cancelCashTransaction(transaction);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    res.json(result);

  } catch (error) {
    console.error('Confirm cash transaction error:', error);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
}

// Get agent dashboard data
export async function getAgentDashboard(req: Request, res: Response) {
  try {
    const agentUserId = req.session?.user?.id;
    if (!agentUserId) {
      return res.status(401).json({ error: 'Agent not authenticated' });
    }

    const agent = await findAgentByUserId(agentUserId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    // Get today's transactions
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = await getAgentTransactions(agent.id, today);
    
    // Calculate today's metrics
    const todayMetrics = {
      totalTransactions: todayTransactions.length,
      totalVolume: todayTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      totalCommission: todayTransactions.reduce((sum, tx) => sum + tx.commission, 0),
      cashInCount: todayTransactions.filter(tx => tx.type === 'cash_in').length,
      cashOutCount: todayTransactions.filter(tx => tx.type === 'cash_out').length
    };

    // Get pending transactions
    const pendingTransactions = await getPendingAgentTransactions(agent.id);

    res.json({
      agent: {
        id: agent.id,
        agentCode: agent.agentCode,
        businessName: agent.businessName,
        status: agent.status,
        rating: agent.rating,
        verificationLevel: agent.verificationLevel
      },
      balances: {
        cash: agent.cashBalance,
        float: agent.floatBalance
      },
      todayMetrics,
      pendingTransactions,
      recentTransactions: todayTransactions.slice(-10),
      workingHours: agent.workingHours,
      commission: agent.commission
    });

  } catch (error) {
    console.error('Get agent dashboard error:', error);
    res.status(500).json({ error: 'Failed to get agent dashboard' });
  }
}

// Helper functions

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function isAgentWorkingNow(workingHours: any): boolean {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5);
  
  return workingHours.days.includes(currentDay) &&
         currentTime >= workingHours.open &&
         currentTime <= workingHours.close;
}

function calculateCommission(amount: number, type: 'cash_in' | 'cash_out'): number {
  // Simplified commission structure
  const rates = {
    cash_in: 0.01, // 1%
    cash_out: 0.015 // 1.5%
  };
  
  return Math.round(amount * rates[type] * 100) / 100;
}

function generateTransactionReference(): string {
  return `AGT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

async function validateUserPin(userId: string, pin: string): Promise<boolean> {
  // Simplified PIN validation - in production this would be properly hashed
  return pin === '1234';
}

async function getAgentsInRadius(lat: number, lon: number, radius: number, service?: string): Promise<Agent[]> {
  // Demo agents data - in production this would come from database
  const demoAgents: Agent[] = [
    {
      id: 'agent-001',
      userId: 'agent-001',
      agentCode: 'AGT001',
      businessName: 'Kwame Mobile Money',
      location: {
        latitude: lat + 0.01,
        longitude: lon + 0.01,
        address: '123 Market Street',
        city: 'Accra',
        region: 'Greater Accra'
      },
      services: ['cash_in', 'cash_out', 'bill_payment'],
      cashBalance: 5000,
      floatBalance: 10000,
      commission: { cashIn: 0.01, cashOut: 0.015, billPayment: 0.005 },
      status: 'active',
      workingHours: {
        open: '08:00',
        close: '18:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      rating: 4.8,
      totalTransactions: 1250,
      verificationLevel: 'verified'
    },
    {
      id: 'agent-002',
      userId: 'agent-002',
      agentCode: 'AGT002',
      businessName: 'Ama Express Services',
      location: {
        latitude: lat - 0.005,
        longitude: lon + 0.015,
        address: '45 Station Road',
        city: 'Accra',
        region: 'Greater Accra'
      },
      services: ['cash_in', 'cash_out'],
      cashBalance: 3000,
      floatBalance: 8000,
      commission: { cashIn: 0.01, cashOut: 0.015, billPayment: 0.005 },
      status: 'active',
      workingHours: {
        open: '07:00',
        close: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      rating: 4.6,
      totalTransactions: 890,
      verificationLevel: 'verified'
    }
  ];

  return demoAgents.filter(agent => 
    !service || agent.services.includes(service)
  );
}

async function findAgentByCode(agentCode: string): Promise<Agent | null> {
  const agents = await getAgentsInRadius(0, 0, 1000); // Get all agents
  return agents.find(agent => agent.agentCode === agentCode) || null;
}

async function findAgentByUserId(userId: string): Promise<Agent | null> {
  const agents = await getAgentsInRadius(0, 0, 1000); // Get all agents
  return agents.find(agent => agent.userId === userId) || null;
}

async function createCashTransaction(transaction: Omit<CashTransaction, 'id'>): Promise<CashTransaction> {
  const newTransaction: CashTransaction = {
    id: generateTransactionReference(),
    ...transaction
  };
  
  // In production, save to database
  // For demo, just return the transaction
  return newTransaction;
}

async function findCashTransaction(transactionId: string): Promise<CashTransaction | null> {
  // Demo implementation - in production, query from database
  return null;
}

async function processCashTransaction(transaction: CashTransaction) {
  // Implementation for processing confirmed transaction
  return { success: true, message: 'Transaction processed successfully' };
}

async function cancelCashTransaction(transaction: CashTransaction) {
  // Implementation for cancelling transaction
  return { success: true, message: 'Transaction cancelled successfully' };
}

async function notifyAgent(agentId: string, type: string, data: any) {
  // Implementation for notifying agent via SMS/push notification
  console.log(`Notifying agent ${agentId} about ${type}:`, data);
}

async function getAgentTransactions(agentId: string, date: string): Promise<CashTransaction[]> {
  // Demo implementation - in production, query from database
  return [];
}

async function getPendingAgentTransactions(agentId: string): Promise<CashTransaction[]> {
  // Demo implementation - in production, query from database
  return [];
}