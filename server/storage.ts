import { 
  users, type User, type InsertUser,
  messages, type Message, type InsertMessage,
  sessions, type Session, type InsertSession
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Message methods
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Session methods
  getSession(sessionId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionLastActive(sessionId: string): Promise<Session | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private sessions: Map<string, Session>;
  private userIdCounter: number;
  private messageIdCounter: number;
  private sessionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.sessions = new Map();
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
    this.sessionIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.id - b.id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const timestamp = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      timestamp
    };
    
    this.messages.set(id, message);
    
    // Update session last active timestamp
    this.updateSessionLastActive(insertMessage.sessionId);
    
    return message;
  }

  // Session methods
  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const now = new Date();
    const session: Session = { 
      ...insertSession, 
      id, 
      createdAt: now, 
      lastActive: now 
    };
    
    this.sessions.set(insertSession.sessionId, session);
    return session;
  }

  async updateSessionLastActive(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { 
      ...session, 
      lastActive: new Date() 
    };
    
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }
}

// Create and export storage instance
export const storage = new MemStorage();
