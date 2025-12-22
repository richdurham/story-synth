import { eq, desc } from "drizzle-orm";
import { gameRoles, gameIssues, gameVariables, gameState, notes, gameHistory, GameRole, GameIssue, GameVariable, GameStateRecord, Note, GameHistoryRecord, InsertGameRole, InsertGameIssue, InsertGameVariable, InsertNote, InsertGameHistory } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Game Roles - Fetch and manage player roles
 */
export async function getAllGameRoles(): Promise<GameRole[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gameRoles);
}

export async function getGameRoleById(roleId: string): Promise<GameRole | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gameRoles).where(eq(gameRoles.roleId, roleId)).limit(1);
  return result[0];
}

export async function upsertGameRole(role: InsertGameRole): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(gameRoles).values(role).onDuplicateKeyUpdate({
    set: { name: role.name, description: role.description },
  });
}

/**
 * Game Issues - Fetch and manage game issues
 */
export async function getAllGameIssues(): Promise<GameIssue[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gameIssues);
}

export async function getGameIssueById(issueId: string): Promise<GameIssue | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gameIssues).where(eq(gameIssues.issueId, issueId)).limit(1);
  return result[0];
}

export async function getActiveGameIssue(): Promise<GameIssue | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gameIssues).where(eq(gameIssues.status, "active")).limit(1);
  return result[0];
}

export async function upsertGameIssue(issue: InsertGameIssue): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(gameIssues).values(issue).onDuplicateKeyUpdate({
    set: { title: issue.title, description: issue.description, type: issue.type, status: issue.status },
  });
}

/**
 * Game Variables - Fetch and manage global game state variables
 */
export async function getAllGameVariables(): Promise<GameVariable[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gameVariables);
}

export async function getGameVariableById(variableId: string): Promise<GameVariable | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gameVariables).where(eq(gameVariables.variableId, variableId)).limit(1);
  return result[0];
}

export async function upsertGameVariable(variable: InsertGameVariable): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(gameVariables).values(variable).onDuplicateKeyUpdate({
    set: { name: variable.name, description: variable.description, currentValue: variable.currentValue, minValue: variable.minValue, maxValue: variable.maxValue },
  });
}

export async function updateGameVariableValue(variableId: string, newValue: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(gameVariables).set({ currentValue: newValue }).where(eq(gameVariables.variableId, variableId));
}

/**
 * Game State - Fetch and manage current game state
 */
export async function getCurrentGameState(): Promise<GameStateRecord | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gameState).limit(1);
  return result[0];
}

export async function updateCurrentIssue(issueId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const current = await getCurrentGameState();
  if (current) {
    await db.update(gameState).set({ currentIssueId: issueId }).where(eq(gameState.id, current.id));
  } else {
    await db.insert(gameState).values({ currentIssueId: issueId });
  }
}

export async function advanceRound(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const current = await getCurrentGameState();
  if (current) {
    await db.update(gameState).set({ round: current.round + 1 }).where(eq(gameState.id, current.id));
  }
}

/**
 * Notes - Send and retrieve private player notes
 */
export async function sendNote(senderRole: string, recipientRole: string, content: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(notes).values({ senderRole, recipientRole, content });
}

export async function getNotesByRecipient(recipientRole: string): Promise<Note[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(eq(notes.recipientRole, recipientRole)).orderBy(desc(notes.createdAt));
}

export async function markNoteAsRead(noteId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(notes).set({ isRead: 1 }).where(eq(notes.id, noteId));
}

/**
 * Game History - Track narrative outcomes and state changes
 */
export async function recordGameHistory(history: InsertGameHistory): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(gameHistory).values(history);
}

export async function getGameHistoryByRound(round: number): Promise<GameHistoryRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gameHistory).where(eq(gameHistory.round, round)).orderBy(desc(gameHistory.createdAt));
}

export async function getGameHistoryByIssue(issueId: string): Promise<GameHistoryRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gameHistory).where(eq(gameHistory.issueId, issueId)).orderBy(desc(gameHistory.createdAt));
}
