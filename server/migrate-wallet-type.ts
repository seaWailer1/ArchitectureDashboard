
import { db } from "./db";

export async function addWalletTypeColumn() {
  try {
    // Add the walletType column to existing wallets table
    await db.execute(`
      ALTER TABLE wallets 
      ADD COLUMN IF NOT EXISTS wallet_type VARCHAR 
      DEFAULT 'primary'
    `);
    
    console.log("✅ Successfully added walletType column to wallets table");
  } catch (error) {
    console.error("❌ Error adding walletType column:", error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addWalletTypeColumn()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
