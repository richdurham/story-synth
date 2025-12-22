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
 * Game roles available in the current game.
 * Each role represents a player position (e.g., Regent, Treasury, Military).
 */
export const gameRoles = mysqlTable("game_roles", {
  id: int("id").autoincrement().primaryKey(),
  roleId: varchar("roleId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GameRole = typeof gameRoles.$inferSelect;
export type InsertGameRole = typeof gameRoles.$inferInsert;

/**
 * Game issues that players must resolve.
 * Each issue has multiple resolution options that lead to different narrative outcomes.
 */
export const gameIssues = mysqlTable("game_issues", {
  id: int("id").autoincrement().primaryKey(),
  issueId: varchar("issueId", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 64 }), // e.g., "Militarism", "Economy"
  status: mysqlEnum("status", ["active", "resolved", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameIssue = typeof gameIssues.$inferSelect;
export type InsertGameIssue = typeof gameIssues.$inferInsert;

/**
 * Global game variables that track state (e.g., treasury_level, militarism_level).
 * These variables are updated based on player decisions and narrative outcomes.
 */
export const gameVariables = mysqlTable("game_variables", {
  id: int("id").autoincrement().primaryKey(),
  variableId: varchar("variableId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  currentValue: int("currentValue").default(0).notNull(),
  minValue: int("minValue"),
  maxValue: int("maxValue"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameVariable = typeof gameVariables.$inferSelect;
export type InsertGameVariable = typeof gameVariables.$inferInsert;

/**
 * Current game state tracking which issue is active and player-specific private variables.
 */
export const gameState = mysqlTable("game_state", {
  id: int("id").autoincrement().primaryKey(),
  currentIssueId: varchar("currentIssueId", { length: 64 }),
  round: int("round").default(1).notNull(),
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameStateRecord = typeof gameState.$inferSelect;
export type InsertGameState = typeof gameState.$inferInsert;

/**
 * Private notes sent between players.
 * Only the recipient can view notes addressed to their role.
 */
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  senderRole: varchar("senderRole", { length: 64 }).notNull(),
  recipientRole: varchar("recipientRole", { length: 64 }).notNull(),
  content: text("content").notNull(),
  isRead: int("isRead").default(0).notNull(), // 0 = unread, 1 = read
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

/**
 * Game history tracking narrative outcomes and state changes.
 * Records each resolution event and its consequences.
 */
export const gameHistory = mysqlTable("game_history", {
  id: int("id").autoincrement().primaryKey(),
  issueId: varchar("issueId", { length: 64 }).notNull(),
  playerRole: varchar("playerRole", { length: 64 }).notNull(),
  resolutionChoice: text("resolutionChoice").notNull(),
  narrativeOutcome: text("narrativeOutcome").notNull(),
  stateChanges: text("stateChanges"), // JSON string of variable changes
  round: int("round").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GameHistoryRecord = typeof gameHistory.$inferSelect;
export type InsertGameHistory = typeof gameHistory.$inferInsert;