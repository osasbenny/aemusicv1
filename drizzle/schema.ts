import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Beats table for storing music beats available for purchase
 */
export const beats = mysqlTable("beats", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 100 }).notNull(),
  mood: varchar("mood", { length: 100 }).notNull(),
  bpm: int("bpm").notNull(),
  price: int("price").notNull(), // Price in cents
  description: text("description"),
  audioFileKey: varchar("audioFileKey", { length: 500 }).notNull(),
  audioUrl: varchar("audioUrl", { length: 1000 }).notNull(),
  coverImageKey: varchar("coverImageKey", { length: 500 }),
  coverImageUrl: varchar("coverImageUrl", { length: 1000 }),
  licenseType: varchar("licenseType", { length: 100 }).default("Basic").notNull(),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Beat = typeof beats.$inferSelect;
export type InsertBeat = typeof beats.$inferInsert;

/**
 * Submissions table for artist music submissions
 */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  artistName: varchar("artistName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  songTitle: varchar("songTitle", { length: 255 }).notNull(),
  message: text("message"),
  fileType: varchar("fileType", { length: 50 }).notNull(), // audio or video
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1000 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "accepted", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

/**
 * Purchases table for tracking beat purchases
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  beatId: int("beatId").notNull(),
  buyerEmail: varchar("buyerEmail", { length: 320 }).notNull(),
  buyerName: varchar("buyerName", { length: 255 }),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // Amount in cents
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;