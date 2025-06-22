import {
  users,
  wallets,
  transactions,
  userRoles,
  type User,
  type UpsertUser,
  type Wallet,
  type InsertWallet,
  type Transaction,
  type InsertTransaction,
  type UserRole,
  type InsertUserRole,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Wallet operations
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  getWalletByUserId(userId: string): Promise<Wallet | undefined>;
  updateWalletBalance(walletId: number, balance: string, pendingBalance?: string): Promise<Wallet>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByWalletId(walletId: number, limit?: number): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  
  // User role operations
  createUserRole(userRole: InsertUserRole): Promise<UserRole>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  updateUserCurrentRole(userId: string, role: string): Promise<User>;
  
  // KYC operations
  updateKYCStatus(userId: string, status: string): Promise<User>;
  updateVerificationStatus(userId: string, field: string, status: boolean): Promise<User>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreference[]>;
  upsertUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
  deleteUserPreference(userId: string, category: string, key: string): Promise<void>;
  
  // Security operations
  logSecurityEvent(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(userId: string, limit?: number): Promise<SecurityLog[]>;
  
  // Device management
  registerDevice(device: InsertUserDevice): Promise<UserDevice>;
  getUserDevices(userId: string): Promise<UserDevice[]>;
  updateDeviceStatus(deviceId: string, isActive: boolean): Promise<UserDevice>;
  trustDevice(deviceId: string): Promise<UserDevice>;
  
  // Support system
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getUserSupportTickets(userId: string): Promise<SupportTicket[]>;
  updateTicketStatus(ticketId: number, status: string): Promise<SupportTicket>;
  
  // Account recovery
  createRecoveryToken(recovery: InsertAccountRecovery): Promise<AccountRecovery>;
  getRecoveryToken(token: string): Promise<AccountRecovery | undefined>;
  useRecoveryToken(token: string): Promise<AccountRecovery>;
  
  // Account management
  updateAccountSettings(userId: string, settings: Partial<User>): Promise<User>;
  deactivateAccount(userId: string): Promise<User>;
  reactivateAccount(userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Wallet operations
  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const [wallet] = await db
      .insert(wallets)
      .values(walletData)
      .returning();
    return wallet;
  }

  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.userId, userId), eq(wallets.isActive, true)));
    return wallet;
  }

  async updateWalletBalance(walletId: number, balance: string, pendingBalance?: string): Promise<Wallet> {
    const updateData: any = { balance, updatedAt: new Date() };
    if (pendingBalance !== undefined) {
      updateData.pendingBalance = pendingBalance;
    }
    
    const [wallet] = await db
      .update(wallets)
      .set(updateData)
      .where(eq(wallets.id, walletId))
      .returning();
    return wallet;
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getTransactionsByWalletId(walletId: number, limit: number = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(or(
        eq(transactions.fromWalletId, walletId),
        eq(transactions.toWalletId, walletId)
      ))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction> {
    const [transaction] = await db
      .update(transactions)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return transaction;
  }

  // User role operations
  async createUserRole(userRoleData: InsertUserRole): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values(userRoleData)
      .returning();
    return userRole;
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    return await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.isActive, true)));
  }

  async updateUserCurrentRole(userId: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ currentRole: role as any, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // KYC operations
  async updateKYCStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ kycStatus: status as any, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateVerificationStatus(userId: string, field: string, status: boolean): Promise<User> {
    const updateData: any = { updatedAt: new Date() };
    updateData[field] = status;
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreference[]> {
    return await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
  }

  async upsertUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    const [result] = await db
      .insert(userPreferences)
      .values(preference)
      .onConflictDoUpdate({
        target: [userPreferences.userId, userPreferences.category, userPreferences.key],
        set: {
          value: preference.value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async deleteUserPreference(userId: string, category: string, key: string): Promise<void> {
    await db
      .delete(userPreferences)
      .where(
        and(
          eq(userPreferences.userId, userId),
          eq(userPreferences.category, category),
          eq(userPreferences.key, key)
        )
      );
  }

  // Security operations
  async logSecurityEvent(log: InsertSecurityLog): Promise<SecurityLog> {
    const [result] = await db.insert(securityLogs).values(log).returning();
    return result;
  }

  async getSecurityLogs(userId: string, limit: number = 50): Promise<SecurityLog[]> {
    return await db
      .select()
      .from(securityLogs)
      .where(eq(securityLogs.userId, userId))
      .orderBy(desc(securityLogs.createdAt))
      .limit(limit);
  }

  // Device management
  async registerDevice(device: InsertUserDevice): Promise<UserDevice> {
    const [result] = await db
      .insert(userDevices)
      .values(device)
      .onConflictDoUpdate({
        target: userDevices.deviceId,
        set: {
          lastUsedAt: new Date(),
          deviceName: device.deviceName,
          isActive: true,
        },
      })
      .returning();
    return result;
  }

  async getUserDevices(userId: string): Promise<UserDevice[]> {
    return await db
      .select()
      .from(userDevices)
      .where(eq(userDevices.userId, userId))
      .orderBy(desc(userDevices.lastUsedAt));
  }

  async updateDeviceStatus(deviceId: string, isActive: boolean): Promise<UserDevice> {
    const [result] = await db
      .update(userDevices)
      .set({ isActive })
      .where(eq(userDevices.deviceId, deviceId))
      .returning();
    return result;
  }

  async trustDevice(deviceId: string): Promise<UserDevice> {
    const [result] = await db
      .update(userDevices)
      .set({ isTrusted: true })
      .where(eq(userDevices.deviceId, deviceId))
      .returning();
    return result;
  }

  // Support system
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [result] = await db.insert(supportTickets).values(ticket).returning();
    return result;
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async updateTicketStatus(ticketId: number, status: string): Promise<SupportTicket> {
    const [result] = await db
      .update(supportTickets)
      .set({ status })
      .where(eq(supportTickets.id, ticketId))
      .returning();
    return result;
  }

  // Account recovery
  async createRecoveryToken(recovery: InsertAccountRecovery): Promise<AccountRecovery> {
    const [result] = await db.insert(accountRecovery).values(recovery).returning();
    return result;
  }

  async getRecoveryToken(token: string): Promise<AccountRecovery | undefined> {
    const [result] = await db
      .select()
      .from(accountRecovery)
      .where(eq(accountRecovery.token, token));
    return result;
  }

  async useRecoveryToken(token: string): Promise<AccountRecovery> {
    const [result] = await db
      .update(accountRecovery)
      .set({ usedAt: new Date() })
      .where(eq(accountRecovery.token, token))
      .returning();
    return result;
  }

  // Account management
  async updateAccountSettings(userId: string, settings: Partial<User>): Promise<User> {
    const [result] = await db
      .update(users)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result;
  }

  async deactivateAccount(userId: string): Promise<User> {
    const [result] = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result;
  }

  async reactivateAccount(userId: string): Promise<User> {
    const [result] = await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
