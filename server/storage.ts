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
}

export const storage = new DatabaseStorage();
