-- Performance optimization indexes for AfriPay database
-- Run these to improve query performance

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_current_role ON users(current_role);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Wallet table indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_wallet_type ON wallets(wallet_type);
CREATE INDEX IF NOT EXISTS idx_wallets_currency ON wallets(currency);
CREATE INDEX IF NOT EXISTS idx_wallets_user_type ON wallets(user_id, wallet_type);

-- Transaction table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_amount ON transactions(amount);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);

-- User roles table indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Security logs table indexes
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_action ON security_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_created ON security_logs(user_id, created_at DESC);

-- User devices table indexes
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_device_id ON user_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_is_active ON user_devices(is_active);

-- Support tickets table indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Investment and trading table indexes
CREATE INDEX IF NOT EXISTS idx_asset_holdings_user_id ON asset_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_holdings_asset_type ON asset_holdings(asset_type);
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_product_id ON user_investments(product_id);
CREATE INDEX IF NOT EXISTS idx_credit_facilities_user_id ON credit_facilities(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_facilities_status ON credit_facilities(status);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_type_status ON transactions(wallet_id, type, status);
CREATE INDEX IF NOT EXISTS idx_users_role_kyc ON users(current_role, kyc_status);
CREATE INDEX IF NOT EXISTS idx_wallets_user_currency ON wallets(user_id, currency);

-- Full-text search indexes (if supported)
-- CREATE INDEX IF NOT EXISTS idx_users_name_search ON users USING gin(to_tsvector('english', first_name || ' ' || last_name));
-- CREATE INDEX IF NOT EXISTS idx_transactions_description_search ON transactions USING gin(to_tsvector('english', description));

-- Add comprehensive indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_type ON wallets(wallet_type);
CREATE INDEX IF NOT EXISTS idx_wallets_user_type ON wallets(user_id, wallet_type);

CREATE INDEX IF NOT EXISTS idx_transactions_from_wallet ON transactions(from_wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_wallet ON transactions(to_wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_timestamp ON transactions(from_wallet_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON kyc_records(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_records(status);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_date ON transactions(from_wallet_id, timestamp DESC) WHERE from_wallet_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_recent ON transactions(timestamp DESC) WHERE timestamp > NOW() - INTERVAL '30 days';

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_active_users ON users(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_verified_kyc ON kyc_records(user_id) WHERE status = 'verified';