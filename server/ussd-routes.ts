import { Request, Response } from 'express';
import { storage } from './storage.js';

// USSD Banking Integration for African Markets
// Supports basic banking operations via USSD codes

interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  text: string;
  serviceCode: string;
}

interface USSDResponse {
  response: string;
  continueSession: boolean;
}

// Main USSD handler for different service codes
export async function handleUSSDRequest(req: Request, res: Response) {
  try {
    const { sessionId, phoneNumber, text, serviceCode } = req.body as USSDSession;
    
    console.log(`USSD Request: ${serviceCode} from ${phoneNumber}, text: "${text}"`);
    
    let response: USSDResponse;
    
    switch (serviceCode) {
      case '*544#':
        response = await handleMainMenu(text, phoneNumber);
        break;
      case '*544*1#':
        response = await handleBalanceInquiry(phoneNumber);
        break;
      case '*544*2#':
        response = await handleSendMoney(text, phoneNumber);
        break;
      case '*544*3#':
        response = await handleBuyAirtime(text, phoneNumber);
        break;
      case '*544*4#':
        response = await handleTransactionHistory(phoneNumber);
        break;
      default:
        response = {
          response: "CON Welcome to AfriPay\n1. Main Menu\n2. Get Help\n3. About",
          continueSession: true
        };
    }
    
    // Track USSD usage for analytics
    await storage.logSecurityEvent({
      userId: `ussd-${phoneNumber}`,
      eventType: 'ussd_interaction',
      severity: 'low',
      details: {
        serviceCode,
        text,
        phoneNumber,
        response: response.response.substring(0, 100)
      },
      ipAddress: req.ip || 'unknown',
      userAgent: 'USSD Gateway'
    });
    
    res.set('Content-Type', 'text/plain');
    res.send(response.response);
    
  } catch (error) {
    console.error('USSD Error:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END Service temporarily unavailable. Please try again later.');
  }
}

// Main USSD menu handler
async function handleMainMenu(text: string, phoneNumber: string): Promise<USSDResponse> {
  const inputs = text.split('*').filter(Boolean);
  
  if (inputs.length === 0) {
    return {
      response: `CON Welcome to AfriPay
1. Check Balance
2. Send Money
3. Buy Airtime
4. Transaction History
5. Account Settings
6. Get Help`,
      continueSession: true
    };
  }
  
  const choice = inputs[0];
  
  switch (choice) {
    case '1':
      return await handleBalanceInquiry(phoneNumber);
    case '2':
      return await handleSendMoney(inputs.slice(1).join('*'), phoneNumber);
    case '3':
      return await handleBuyAirtime(inputs.slice(1).join('*'), phoneNumber);
    case '4':
      return await handleTransactionHistory(phoneNumber);
    case '5':
      return await handleAccountSettings(inputs.slice(1).join('*'), phoneNumber);
    case '6':
      return {
        response: `END AfriPay Help
Call: +233-XXX-XXXX
WhatsApp: +233-XXX-XXXX
Email: support@afripay.com

Visit: www.afripay.com/help`,
        continueSession: false
      };
    default:
      return {
        response: 'CON Invalid option. Please try again.\n1. Check Balance\n2. Send Money\n3. Buy Airtime',
        continueSession: true
      };
  }
}

// Balance inquiry handler
async function handleBalanceInquiry(phoneNumber: string): Promise<USSDResponse> {
  try {
    // Find user by phone number
    const user = await findUserByPhone(phoneNumber);
    if (!user) {
      return {
        response: `END You don't have an AfriPay account.
Download the app to register:
- Android: bit.ly/afripay-android
- iOS: bit.ly/afripay-ios`,
        continueSession: false
      };
    }
    
    const wallets = await storage.getUserWallets(user.id);
    const primaryWallet = wallets.find(w => w.walletType === 'primary');
    
    if (!primaryWallet) {
      return {
        response: 'END No wallet found. Please contact support.',
        continueSession: false
      };
    }
    
    const balance = parseFloat(primaryWallet.balance);
    const pendingBalance = parseFloat(primaryWallet.pendingBalance || '0');
    
    return {
      response: `END Your AfriPay Balance:
Available: ${primaryWallet.currency} ${balance.toFixed(2)}
Pending: ${primaryWallet.currency} ${pendingBalance.toFixed(2)}

Last updated: ${new Date().toLocaleString()}`,
      continueSession: false
    };
    
  } catch (error) {
    console.error('Balance inquiry error:', error);
    return {
      response: 'END Service temporarily unavailable. Please try again.',
      continueSession: false
    };
  }
}

// Send money handler
async function handleSendMoney(text: string, phoneNumber: string): Promise<USSDResponse> {
  const inputs = text.split('*').filter(Boolean);
  
  // Step 1: Ask for recipient phone number
  if (inputs.length === 0) {
    return {
      response: 'CON Enter recipient phone number:',
      continueSession: true
    };
  }
  
  // Step 2: Ask for amount
  if (inputs.length === 1) {
    const recipientPhone = inputs[0];
    
    // Validate phone number format
    if (!/^\+?[0-9]{10,15}$/.test(recipientPhone)) {
      return {
        response: 'CON Invalid phone number format.\nEnter recipient phone number:',
        continueSession: true
      };
    }
    
    return {
      response: `CON Send money to ${recipientPhone}
Enter amount (minimum 1.00):`,
      continueSession: true
    };
  }
  
  // Step 3: Ask for PIN confirmation
  if (inputs.length === 2) {
    const recipientPhone = inputs[0];
    const amount = parseFloat(inputs[1]);
    
    if (isNaN(amount) || amount < 1) {
      return {
        response: 'CON Invalid amount.\nEnter amount (minimum 1.00):',
        continueSession: true
      };
    }
    
    return {
      response: `CON Confirm transaction:
To: ${recipientPhone}
Amount: ${amount.toFixed(2)}

Enter your 4-digit PIN:`,
      continueSession: true
    };
  }
  
  // Step 4: Process transaction
  if (inputs.length === 3) {
    const recipientPhone = inputs[0];
    const amount = parseFloat(inputs[1]);
    const pin = inputs[2];
    
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return {
        response: 'CON Invalid PIN format.\nEnter your 4-digit PIN:',
        continueSession: true
      };
    }
    
    try {
      const user = await findUserByPhone(phoneNumber);
      if (!user) {
        return {
          response: 'END Account not found. Please register first.',
          continueSession: false
        };
      }
      
      const recipient = await findUserByPhone(recipientPhone);
      if (!recipient) {
        return {
          response: 'END Recipient not found. They need to register first.',
          continueSession: false
        };
      }
      
      // Simulate PIN validation (in production, this would be properly hashed)
      const isValidPin = await validateUserPin(user.id, pin);
      if (!isValidPin) {
        return {
          response: 'END Invalid PIN. Transaction cancelled.',
          continueSession: false
        };
      }
      
      // Process the transaction
      const transactionId = await processSendMoney(user.id, recipient.id, amount);
      
      return {
        response: `END Transaction successful!
Amount: ${amount.toFixed(2)}
To: ${recipientPhone}
Reference: ${transactionId}
Fee: 0.50

Thank you for using AfriPay!`,
        continueSession: false
      };
      
    } catch (error) {
      console.error('Send money error:', error);
      return {
        response: 'END Transaction failed. Please try again or contact support.',
        continueSession: false
      };
    }
  }
  
  return {
    response: 'END Invalid input. Please try again.',
    continueSession: false
  };
}

// Buy airtime handler
async function handleBuyAirtime(text: string, phoneNumber: string): Promise<USSDResponse> {
  const inputs = text.split('*').filter(Boolean);
  
  if (inputs.length === 0) {
    return {
      response: `CON Buy Airtime
1. For my number (${phoneNumber})
2. For another number`,
      continueSession: true
    };
  }
  
  if (inputs.length === 1) {
    const choice = inputs[0];
    
    if (choice === '1') {
      return {
        response: `CON Buy airtime for ${phoneNumber}
Enter amount (minimum 1.00):`,
        continueSession: true
      };
    } else if (choice === '2') {
      return {
        response: 'CON Enter phone number:',
        continueSession: true
      };
    } else {
      return {
        response: 'CON Invalid option.\n1. For my number\n2. For another number',
        continueSession: true
      };
    }
  }
  
  // Handle amount input for own number
  if (inputs.length === 2 && inputs[0] === '1') {
    const amount = parseFloat(inputs[1]);
    
    if (isNaN(amount) || amount < 1) {
      return {
        response: 'CON Invalid amount.\nEnter amount (minimum 1.00):',
        continueSession: true
      };
    }
    
    return {
      response: `CON Confirm airtime purchase:
Number: ${phoneNumber}
Amount: ${amount.toFixed(2)}

Enter your 4-digit PIN:`,
      continueSession: true
    };
  }
  
  // Handle phone number input for other number
  if (inputs.length === 2 && inputs[0] === '2') {
    const targetPhone = inputs[1];
    
    if (!/^\+?[0-9]{10,15}$/.test(targetPhone)) {
      return {
        response: 'CON Invalid phone number.\nEnter phone number:',
        continueSession: true
      };
    }
    
    return {
      response: `CON Buy airtime for ${targetPhone}
Enter amount (minimum 1.00):`,
      continueSession: true
    };
  }
  
  return {
    response: 'END Invalid input. Please try again.',
    continueSession: false
  };
}

// Transaction history handler
async function handleTransactionHistory(phoneNumber: string): Promise<USSDResponse> {
  try {
    const user = await findUserByPhone(phoneNumber);
    if (!user) {
      return {
        response: 'END Account not found. Please register first.',
        continueSession: false
      };
    }
    
    const wallets = await storage.getUserWallets(user.id);
    const primaryWallet = wallets.find(w => w.walletType === 'primary');
    
    if (!primaryWallet) {
      return {
        response: 'END No wallet found.',
        continueSession: false
      };
    }
    
    const transactions = await storage.getTransactionsByWalletId(primaryWallet.id, 5);
    
    if (transactions.length === 0) {
      return {
        response: 'END No recent transactions found.',
        continueSession: false
      };
    }
    
    let response = 'END Recent Transactions:\n';
    transactions.forEach((tx, index) => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      const type = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);
      response += `${index + 1}. ${type}: ${tx.amount} (${date})\n`;
    });
    
    return {
      response,
      continueSession: false
    };
    
  } catch (error) {
    console.error('Transaction history error:', error);
    return {
      response: 'END Service temporarily unavailable.',
      continueSession: false
    };
  }
}

// Account settings handler
async function handleAccountSettings(text: string, phoneNumber: string): Promise<USSDResponse> {
  const inputs = text.split('*').filter(Boolean);
  
  if (inputs.length === 0) {
    return {
      response: `CON Account Settings
1. Change PIN
2. Check Account Info
3. Language Settings
4. Back to Main Menu`,
      continueSession: true
    };
  }
  
  const choice = inputs[0];
  
  switch (choice) {
    case '1':
      return {
        response: 'END PIN change is only available in the mobile app for security reasons.',
        continueSession: false
      };
    case '2':
      return await handleAccountInfo(phoneNumber);
    case '3':
      return {
        response: `CON Language Settings
1. English
2. Français
3. العربية
4. Kiswahili`,
        continueSession: true
      };
    case '4':
      return await handleMainMenu('', phoneNumber);
    default:
      return {
        response: 'CON Invalid option.\n1. Change PIN\n2. Check Account Info\n3. Language Settings',
        continueSession: true
      };
  }
}

// Account info handler
async function handleAccountInfo(phoneNumber: string): Promise<USSDResponse> {
  try {
    const user = await findUserByPhone(phoneNumber);
    if (!user) {
      return {
        response: 'END Account not found.',
        continueSession: false
      };
    }
    
    return {
      response: `END Account Information:
Name: ${user.firstName} ${user.lastName}
Phone: ${phoneNumber}
Role: ${user.currentRole}
KYC Status: ${user.kycStatus}
Account Since: ${new Date(user.createdAt).toLocaleDateString()}`,
      continueSession: false
    };
    
  } catch (error) {
    console.error('Account info error:', error);
    return {
      response: 'END Service temporarily unavailable.',
      continueSession: false
    };
  }
}

// Helper functions
async function findUserByPhone(phoneNumber: string) {
  // This is a simplified lookup - in production you'd have proper phone number indexing
  // For now, we'll use the demo users
  const demoPhones = {
    '+233241234567': 'consumer-001',
    '+233241234568': 'merchant-001', 
    '+233241234569': 'agent-001'
  };
  
  const userId = demoPhones[phoneNumber as keyof typeof demoPhones];
  if (userId) {
    return await storage.getUser(userId);
  }
  
  return null;
}

async function validateUserPin(userId: string, pin: string): Promise<boolean> {
  // Simplified PIN validation - in production this would be properly hashed
  // For demo purposes, accept '1234' as valid PIN
  return pin === '1234';
}

async function processSendMoney(senderId: string, recipientId: string, amount: number): Promise<string> {
  // Get sender and recipient wallets
  const senderWallets = await storage.getUserWallets(senderId);
  const recipientWallets = await storage.getUserWallets(recipientId);
  
  const senderWallet = senderWallets.find(w => w.walletType === 'primary');
  const recipientWallet = recipientWallets.find(w => w.walletType === 'primary');
  
  if (!senderWallet || !recipientWallet) {
    throw new Error('Wallet not found');
  }
  
  const senderBalance = parseFloat(senderWallet.balance);
  const fee = 0.50; // Fixed fee for demo
  const totalDeduction = amount + fee;
  
  if (senderBalance < totalDeduction) {
    throw new Error('Insufficient balance');
  }
  
  // Update balances
  await storage.updateWalletBalance(
    senderWallet.id, 
    (senderBalance - totalDeduction).toString()
  );
  
  const recipientBalance = parseFloat(recipientWallet.balance);
  await storage.updateWalletBalance(
    recipientWallet.id, 
    (recipientBalance + amount).toString()
  );
  
  // Create transaction records
  const transactionId = `USSD${Date.now()}`;
  
  await storage.createTransaction({
    fromWalletId: senderWallet.id,
    toWalletId: recipientWallet.id,
    amount: amount.toString(),
    type: 'send',
    status: 'completed',
    description: `USSD Money Transfer`,
    reference: transactionId,
    metadata: { channel: 'ussd', fee: fee.toString() }
  });
  
  return transactionId;
}