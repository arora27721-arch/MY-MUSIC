import { db } from "./db";
import { files, type File, type InsertFile } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getFiles(): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
}

export class DatabaseStorage implements IStorage {
  async getFiles(): Promise<File[]> {
    return await db.select().from(files);
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }
}

export const storage = new DatabaseStorage();
