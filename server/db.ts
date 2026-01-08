import { and, desc, eq, gte, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Beat, beats, InsertBeat, InsertPurchase, InsertSubmission, InsertUser, purchases, Submission, submissions, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Beats queries
export async function createBeat(beat: InsertBeat): Promise<Beat> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(beats).values(beat);
  const insertedBeat = await db.select().from(beats).where(eq(beats.id, Number(result[0].insertId))).limit(1);
  return insertedBeat[0]!;
}

export async function getAllBeats(): Promise<Beat[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(beats).where(eq(beats.isActive, "true")).orderBy(desc(beats.createdAt));
}

export async function getBeatById(id: number): Promise<Beat | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(beats).where(eq(beats.id, id)).limit(1);
  return result[0];
}

export async function updateBeat(id: number, beat: Partial<InsertBeat>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(beats).set(beat).where(eq(beats.id, id));
}

export async function deleteBeat(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(beats).set({ isActive: "false" }).where(eq(beats.id, id));
}

export async function filterBeats(filters: {
  genre?: string;
  mood?: string;
  minBpm?: number;
  maxBpm?: number;
}): Promise<Beat[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(beats.isActive, "true")];

  if (filters.genre) {
    conditions.push(eq(beats.genre, filters.genre));
  }
  if (filters.mood) {
    conditions.push(eq(beats.mood, filters.mood));
  }
  if (filters.minBpm !== undefined) {
    conditions.push(gte(beats.bpm, filters.minBpm));
  }
  if (filters.maxBpm !== undefined) {
    conditions.push(lte(beats.bpm, filters.maxBpm));
  }

  return db.select().from(beats).where(and(...conditions)).orderBy(desc(beats.createdAt));
}

// Submissions queries
export async function createSubmission(submission: InsertSubmission): Promise<Submission> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(submissions).values(submission);
  const insertedSubmission = await db.select().from(submissions).where(eq(submissions.id, Number(result[0].insertId))).limit(1);
  return insertedSubmission[0]!;
}

export async function getAllSubmissions(): Promise<Submission[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(submissions).orderBy(desc(submissions.createdAt));
}

export async function getSubmissionById(id: number): Promise<Submission | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result[0];
}

export async function updateSubmissionStatus(id: number, status: "pending" | "reviewed" | "accepted" | "rejected"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(submissions).set({ status }).where(eq(submissions.id, id));
}

// Purchases queries
export async function createPurchase(purchase: InsertPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(purchases).values(purchase);
  return result[0].insertId;
}

export async function getPurchasesByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(purchases).where(eq(purchases.buyerEmail, email)).orderBy(desc(purchases.createdAt));
}

export async function updatePurchaseStatus(id: number, status: "pending" | "completed" | "failed"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(purchases).set({ status }).where(eq(purchases.id, id));
}
