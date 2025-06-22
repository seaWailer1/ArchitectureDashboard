import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  currentRole: varchar("current_role", { enum: ["consumer", "merchant", "agent"] }).default("consumer"),
  language: varchar("language", { length: 5 }).default("en"),
  kycStatus: varchar("kyc_status", { enum: ["pending", "in_progress", "verified", "rejected"] }).default("pending"),
  phoneVerified: boolean("phone_verified").default(false),
  documentsVerified: boolean("documents_verified").default(false),
  biometricVerified: boolean("biometric_verified").default(false),
  phoneNumber: varchar("phone_number"),
  address: text("address"),
  dateOfBirth: timestamp("date_of_birth"),
  idNumber: varchar("id_number"),
  businessName: varchar("business_name"),
  businessType: varchar("business_type"),
  businessAddress: text("business_address"),
  agentCode: varchar("agent_code"),
  creditScore: integer("credit_score").default(0),
  // Account settings and preferences
  isActive: boolean("is_active").default(true),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  darkMode: boolean("dark_mode").default(false),
  currency: varchar("currency", { length: 3 }).default("USD"),
  timezone: varchar("timezone").default("UTC"),
  lastLoginAt: timestamp("last_login_at"),
  passwordChangedAt: timestamp("password_changed_at"),
  accountLockedAt: timestamp("account_locked_at"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  termsAcceptedAt: timestamp("terms_accepted_at"),
  privacyAcceptedAt: timestamp("privacy_accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences and settings
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(), // security, notifications, privacy, appearance
  key: varchar("key").notNull(),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Security logs for account activities
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // login, logout, password_change, role_switch, etc.
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  deviceInfo: jsonb("device_info"),
  location: jsonb("location"),
  status: varchar("status", { enum: ["success", "failed", "blocked"] }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device management
export const userDevices = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  deviceId: varchar("device_id").unique().notNull(),
  deviceName: varchar("device_name"),
  deviceType: varchar("device_type", { enum: ["mobile", "tablet", "desktop", "unknown"] }),
  os: varchar("os"),
  browser: varchar("browser"),
  isActive: boolean("is_active").default(true),
  isTrusted: boolean("is_trusted").default(false),
  lastUsedAt: timestamp("last_used_at").defaultNow(),
  firstUsedAt: timestamp("first_used_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  ticketNumber: varchar("ticket_number").unique().notNull(),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { enum: ["account", "payment", "technical", "kyc", "general"] }).notNull(),
  priority: varchar("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium"),
  status: varchar("status", { enum: ["open", "pending", "resolved", "closed"] }).default("open"),
  assignedTo: varchar("assigned_to"),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Account recovery
export const accountRecovery = pgTable("account_recovery", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  token: varchar("token").unique().notNull(),
  type: varchar("type", { enum: ["password_reset", "email_verification", "phone_verification", "account_unlock"] }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  pendingBalance: decimal("pending_balance", { precision: 10, scale: 2 }).default("0.00"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromWalletId: integer("from_wallet_id").references(() => wallets.id),
  toWalletId: integer("to_wallet_id").references(() => wallets.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  type: varchar("type", { enum: ["send", "receive", "topup", "withdraw", "payment", "bill_payment", "merchant_payment"] }).notNull(),
  status: varchar("status", { enum: ["pending", "completed", "failed", "cancelled"] }).default("pending"),
  description: text("description"),
  qrCode: text("qr_code"),
  reference: varchar("reference"),
  category: varchar("category"),
  merchantId: varchar("merchant_id"),
  agentId: varchar("agent_id"),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { enum: ["consumer", "merchant", "agent"] }).notNull(),
  isActive: boolean("is_active").default(true),
  permissions: jsonb("permissions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mini-apps table for the ecosystem
export const miniApps = pgTable("mini_apps", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon"),
  category: varchar("category", { enum: ["transportation", "shopping", "finance", "utilities", "health", "education"] }).notNull(),
  developerId: varchar("developer_id"),
  isActive: boolean("is_active").default(true),
  apiEndpoint: varchar("api_endpoint"),
  permissions: jsonb("permissions"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credit/Loan system
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in months
  status: varchar("status", { enum: ["pending", "approved", "active", "completed", "defaulted"] }).default("pending"),
  purpose: varchar("purpose"),
  collateral: text("collateral"),
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }),
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }),
  nextPaymentDate: timestamp("next_payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Merchant-specific data
export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: varchar("business_name").notNull(),
  businessType: varchar("business_type"),
  businessLicense: varchar("business_license"),
  taxId: varchar("tax_id"),
  address: text("address"),
  phoneNumber: varchar("phone_number"),
  businessHours: jsonb("business_hours"),
  paymentMethods: jsonb("payment_methods"),
  qrCodeData: text("qr_code_data"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("0.00"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent-specific data
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentCode: varchar("agent_code").unique().notNull(),
  territory: varchar("territory"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("2.50"),
  floatBalance: decimal("float_balance", { precision: 10, scale: 2 }).default("0.00"),
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }).default("10000.00"),
  isActive: boolean("is_active").default(true),
  supervisorId: varchar("supervisor_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KYC Documents
export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  documentType: varchar("document_type", { enum: ["id_card", "passport", "drivers_license", "utility_bill", "bank_statement"] }).notNull(),
  documentUrl: varchar("document_url"),
  status: varchar("status", { enum: ["pending", "verified", "rejected"] }).default("pending"),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: varchar("verified_by"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  wallets: many(wallets),
  roles: many(userRoles),
  loans: many(loans),
  merchant: one(merchants),
  agent: one(agents),
  kycDocuments: many(kycDocuments),
  preferences: many(userPreferences),
  securityLogs: many(securityLogs),
  devices: many(userDevices),
  supportTickets: many(supportTickets),
  recoveryTokens: many(accountRecovery),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, {
    fields: [securityLogs.userId],
    references: [users.id],
  }),
}));

export const userDevicesRelations = relations(userDevices, ({ one }) => ({
  user: one(users, {
    fields: [userDevices.userId],
    references: [users.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
}));

export const accountRecoveryRelations = relations(accountRecovery, ({ one }) => ({
  user: one(users, {
    fields: [accountRecovery.userId],
    references: [users.id],
  }),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  sentTransactions: many(transactions, {
    relationName: "sentTransactions",
  }),
  receivedTransactions: many(transactions, {
    relationName: "receivedTransactions",
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  fromWallet: one(wallets, {
    fields: [transactions.fromWalletId],
    references: [wallets.id],
    relationName: "sentTransactions",
  }),
  toWallet: one(wallets, {
    fields: [transactions.toWalletId],
    references: [wallets.id],
    relationName: "receivedTransactions",
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  user: one(users, {
    fields: [loans.userId],
    references: [users.id],
  }),
}));

export const merchantsRelations = relations(merchants, ({ one }) => ({
  user: one(users, {
    fields: [merchants.userId],
    references: [users.id],
  }),
}));

export const agentsRelations = relations(agents, ({ one }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
}));

export const kycDocumentsRelations = relations(kycDocuments, ({ one }) => ({
  user: one(users, {
    fields: [kycDocuments.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  createdAt: true,
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMiniAppSchema = createInsertSchema(miniApps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertUserDeviceSchema = createInsertSchema(userDevices).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountRecoverySchema = createInsertSchema(accountRecovery).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;
export type Merchant = typeof merchants.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertMiniApp = z.infer<typeof insertMiniAppSchema>;
export type MiniApp = typeof miniApps.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertUserDevice = z.infer<typeof insertUserDeviceSchema>;
export type UserDevice = typeof userDevices.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertAccountRecovery = z.infer<typeof insertAccountRecoverySchema>;
export type AccountRecovery = typeof accountRecovery.$inferSelect;
