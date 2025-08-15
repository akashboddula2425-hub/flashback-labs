import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Store user session after successful authentication
  app.post("/api/session", async (req, res) => {
    try {
      const { phoneNumber, token, loginTime } = req.body;
      
      const session = await storage.createSession({
        phoneNumber,
        token,
        loginTime
      });
      
      res.json({ success: true, session });
    } catch (error) {
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Update session with selfie URL
  app.patch("/api/session/:phoneNumber", async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      const { selfieUrl } = req.body;
      
      const session = await storage.updateSession(phoneNumber, { selfieUrl });
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({ success: true, session });
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Get user session
  app.get("/api/session/:phoneNumber", async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      const session = await storage.getSession(phoneNumber);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
