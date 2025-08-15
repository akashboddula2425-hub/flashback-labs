import { type UserSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSession(session: Omit<UserSession, "selfieUrl">): Promise<UserSession>;
  getSession(phoneNumber: string): Promise<UserSession | undefined>;
  updateSession(phoneNumber: string, updates: Partial<UserSession>): Promise<UserSession | undefined>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, UserSession>;

  constructor() {
    this.sessions = new Map();
  }

  async createSession(session: Omit<UserSession, "selfieUrl">): Promise<UserSession> {
    const fullSession: UserSession = {
      ...session,
      selfieUrl: undefined
    };
    this.sessions.set(session.phoneNumber, fullSession);
    return fullSession;
  }

  async getSession(phoneNumber: string): Promise<UserSession | undefined> {
    return this.sessions.get(phoneNumber);
  }

  async updateSession(phoneNumber: string, updates: Partial<UserSession>): Promise<UserSession | undefined> {
    const existing = this.sessions.get(phoneNumber);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.sessions.set(phoneNumber, updated);
    return updated;
  }
}

export const storage = new MemStorage();
