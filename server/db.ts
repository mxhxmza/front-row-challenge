import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, episodes, InsertEpisode, Episode, outreachTracking, InsertOutreachTracking, OutreachTracking } from "../drizzle/schema";
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

// Episode-related database functions

export async function createEpisode(episode: InsertEpisode): Promise<Episode | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create episode: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(episodes).values(episode);
    const insertId = result[0].insertId;
    const created = await db.select().from(episodes).where(eq(episodes.id, insertId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create episode:", error);
    throw error;
  }
}

export async function getEpisodesByUserId(userId: number): Promise<Episode[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get episodes: database not available");
    return [];
  }

  try {
    const result = await db.select().from(episodes).where(eq(episodes.userId, userId)).orderBy(desc(episodes.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get episodes:", error);
    throw error;
  }
}

export async function getEpisodeById(episodeId: number, userId: number): Promise<Episode | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get episode: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(episodes)
      .where(eq(episodes.id, episodeId))
      .limit(1);
    // Verify the episode belongs to the user
    if (result[0] && result[0].userId === userId) {
      return result[0];
    }
    return undefined;
  } catch (error) {
    console.error("[Database] Failed to get episode:", error);
    throw error;
  }
}

export async function updateEpisode(episodeId: number, userId: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update episode: database not available");
    return undefined;
  }

  try {
    // First verify ownership
    const existing = await getEpisodeById(episodeId, userId);
    if (!existing) {
      return undefined;
    }

    await db.update(episodes).set(updates).where(eq(episodes.id, episodeId));
    return await getEpisodeById(episodeId, userId);
  } catch (error) {
    console.error("[Database] Failed to update episode:", error);
    throw error;
  }
}

export async function deleteEpisode(episodeId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete episode: database not available");
    return false;
  }

  try {
    // First verify ownership
    const existing = await getEpisodeById(episodeId, userId);
    if (!existing) {
      return false;
    }

    await db.delete(episodes).where(eq(episodes.id, episodeId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete episode:", error);
    throw error;
  }
}

// Outreach tracking functions

export async function createOutreach(outreach: InsertOutreachTracking): Promise<OutreachTracking | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create outreach: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(outreachTracking).values(outreach);
    const insertId = result[0].insertId;
    const created = await db.select().from(outreachTracking).where(eq(outreachTracking.id, insertId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create outreach:", error);
    throw error;
  }
}

export async function getOutreachByEpisodeId(episodeId: number, userId: number): Promise<OutreachTracking[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get outreach: database not available");
    return [];
  }

  try {
    const result = await db.select().from(outreachTracking)
      .where(eq(outreachTracking.episodeId, episodeId))
      .orderBy(desc(outreachTracking.createdAt));
    // Filter by userId
    return result.filter(o => o.userId === userId);
  } catch (error) {
    console.error("[Database] Failed to get outreach:", error);
    throw error;
  }
}

export async function updateOutreachStatus(
  outreachId: number, 
  userId: number, 
  status: "drafted" | "sent" | "responded" | "booked" | "declined",
  sentAt?: Date
): Promise<OutreachTracking | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update outreach: database not available");
    return undefined;
  }

  try {
    const existing = await db.select().from(outreachTracking).where(eq(outreachTracking.id, outreachId)).limit(1);
    if (!existing[0] || existing[0].userId !== userId) {
      return undefined;
    }

    const updates: Partial<InsertOutreachTracking> = { status };
    if (sentAt) {
      updates.sentAt = sentAt;
    }

    await db.update(outreachTracking).set(updates).where(eq(outreachTracking.id, outreachId));
    const updated = await db.select().from(outreachTracking).where(eq(outreachTracking.id, outreachId)).limit(1);
    return updated[0];
  } catch (error) {
    console.error("[Database] Failed to update outreach:", error);
    throw error;
  }
}
