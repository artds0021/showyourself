import { profiles, type Profile, type InsertProfile } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileBySlug(slug: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  getAllProfiles(page?: number, limit?: number, search?: string): Promise<{ profiles: Profile[], total: number }>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  deleteProfile(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async getProfileBySlug(slug: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.slug, slug));
    return profile || undefined;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async getAllProfiles(page = 1, limit = 12, search?: string): Promise<{ profiles: Profile[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Build profile query
    let profileQuery = db.select().from(profiles);
    if (search) {
      profileQuery = profileQuery.where(ilike(profiles.name, `%${search}%`));
    }
    
    const profileResults = await profileQuery
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Build count query  
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(profiles);
    if (search) {
      countQuery = countQuery.where(ilike(profiles.name, `%${search}%`));
    }
    
    const countResult = await countQuery;
    const count = countResult[0]?.count || 0;
    
    return {
      profiles: profileResults,
      total: count
    };
  }

  async updateProfile(id: string, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set(profileData)
      .where(eq(profiles.id, id))
      .returning();
    return profile || undefined;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const result = await db.delete(profiles).where(eq(profiles.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
