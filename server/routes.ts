import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all notes
  app.get("/api/notes", async (req: Request, res: Response) => {
    try {
      const notes = await storage.getNotes();
      return res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Get a specific note
  app.get("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      const note = await storage.getNote(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      return res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      return res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  // Create a new note
  app.post("/api/notes", async (req: Request, res: Response) => {
    try {
      const parsedData = insertNoteSchema.parse(req.body);
      const newNote = await storage.createNote(parsedData);
      return res.status(201).json(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ message: "Failed to create note" });
    }
  });

  // Update an existing note
  app.patch("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      // Partial validation of update data
      const updateData = insertNoteSchema.partial().parse(req.body);
      
      const updatedNote = await storage.updateNote(id, updateData);
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      return res.json(updatedNote);
    } catch (error) {
      console.error("Error updating note:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ message: "Failed to update note" });
    }
  });

  // Delete a note
  app.delete("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      const success = await storage.deleteNote(id);
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      return res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Mock Twilio API endpoint
  app.post("/api/send-message", async (req: Request, res: Response) => {
    try {
      const { recipient, content, messageType, voiceType } = req.body;
      
      // Validate required fields
      if (!recipient || !content) {
        return res.status(400).json({ 
          message: "Recipient phone number and content are required" 
        });
      }
      
      // Simple validation for phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(recipient.replace(/\s+/g, ''))) {
        return res.status(400).json({ 
          message: "Invalid phone number format. Please use international format (e.g., +1234567890)" 
        });
      }

      // In a real implementation, this would make an actual call to Twilio API
      
      // Add a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return res.status(200).json({
        success: true,
        message: `Message sent successfully via ${messageType === 'voice' ? 'voice call' : 'text message'}`
      });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
