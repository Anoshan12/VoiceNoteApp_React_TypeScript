import { users, type User, type InsertUser, notes, type Note, type InsertNote } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Note operations
  getNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notesMap: Map<number, Note>;
  private userCurrentId: number;
  private noteCurrentId: number;

  constructor() {
    this.users = new Map();
    this.notesMap = new Map();
    this.userCurrentId = 1;
    this.noteCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Note methods
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notesMap.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notesMap.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.noteCurrentId++;
    const createdAt = new Date();
    const note: Note = { ...insertNote, id, createdAt };
    this.notesMap.set(id, note);
    return note;
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notesMap.get(id);
    if (!existingNote) {
      return undefined;
    }

    const updatedNote: Note = { ...existingNote, ...updateData };
    this.notesMap.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notesMap.delete(id);
  }
}

export const storage = new MemStorage();
