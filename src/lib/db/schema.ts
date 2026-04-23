import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  circleWalletId: text("circle_wallet_id"),
  circleWalletSetId: text("circle_wallet_set_id"),
  walletAddress: text("wallet_address"),
  onChainAgentId: text("on_chain_agent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agentIdentities = pgTable("agent_identities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  onChainAgentId: text("on_chain_agent_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  circleWalletId: text("circle_wallet_id").notNull(),
  metadataUri: text("metadata_uri"),
  reputationScore: numeric("reputation_score", { precision: 7, scale: 2 }),
  registrationTxHash: text("registration_tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nanopayments = pgTable("nanopayments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  task: text("task").notNull(),
  amountUsdc: numeric("amount_usdc", { precision: 16, scale: 6 }).notNull(),
  settlementTxHash: text("settlement_tx_hash"),
  splitTxHashes: text("split_tx_hashes").array(),
  providerAddress: text("provider_address"),
  status: text("status").default("settled"),
  createdAt: timestamp("created_at").defaultNow(),
});
