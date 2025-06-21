import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse, generateQuizQuestions, analyzeLearningProgress } from "./services/openai";
import { insertChatMessageSchema, insertQuizSchema, insertGameScoreSchema, insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (demo user for now)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Default demo user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get user statistics
  app.get("/api/user/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(1);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  // Get user achievements
  app.get("/api/user/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(1);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // Vocabulary endpoints
  app.get("/api/vocabulary", async (req, res) => {
    try {
      const { type, level } = req.query;
      let vocabulary;
      
      if (type) {
        vocabulary = await storage.getVocabularyByType(type as string);
      } else if (level) {
        vocabulary = await storage.getVocabularyByLevel(parseInt(level as string));
      } else {
        vocabulary = await storage.getAllVocabulary();
      }
      
      res.json(vocabulary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get vocabulary" });
    }
  });

  app.get("/api/vocabulary/random", async (req, res) => {
    try {
      const { type = "hiragana", count = "10" } = req.query;
      const vocabulary = await storage.getRandomVocabulary(type as string, parseInt(count as string));
      res.json(vocabulary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get random vocabulary" });
    }
  });

  // Progress endpoints
  app.get("/api/progress", async (req, res) => {
    try {
      const { type } = req.query;
      let progress;
      
      if (type) {
        progress = await storage.getUserProgressByType(1, type as string);
      } else {
        progress = await storage.getUserProgress(1);
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateProgress({ ...validatedData, userId: 1 });
      
      // Update user points
      const points = validatedData.correct > 0 ? validatedData.correct * 10 : 0;
      if (points > 0) {
        await storage.updateUserPoints(1, points);
      }
      
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Chat endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await generateChatResponse(message, 1);
      
      // Save chat message
      const chatData = insertChatMessageSchema.parse({
        userId: 1,
        message,
        response: response.message
      });
      await storage.saveChatMessage(chatData);
      
      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to generate chat response" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const { limit = "20" } = req.query;
      const history = await storage.getUserChatHistory(1, parseInt(limit as string));
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });

  // Quiz endpoints
  app.get("/api/quiz/generate", async (req, res) => {
    try {
      const { type = "hiragana", difficulty = "1", count = "5" } = req.query;
      const questions = await generateQuizQuestions(
        type as string, 
        parseInt(difficulty as string), 
        parseInt(count as string)
      );
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const validatedData = insertQuizSchema.parse(req.body);
      const quiz = await storage.saveQuizResult({ ...validatedData, userId: 1 });
      
      // Award points based on score
      const points = Math.round((validatedData.score / validatedData.totalQuestions) * 100);
      await storage.updateUserPoints(1, points);
      
      res.json(quiz);
    } catch (error) {
      res.status(400).json({ message: "Invalid quiz data" });
    }
  });

  app.get("/api/quiz/history", async (req, res) => {
    try {
      const history = await storage.getUserQuizHistory(1);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz history" });
    }
  });

  // Game endpoints
  app.post("/api/game/score", async (req, res) => {
    try {
      const validatedData = insertGameScoreSchema.parse(req.body);
      const gameScore = await storage.saveGameScore({ ...validatedData, userId: 1 });
      
      // Award points
      await storage.updateUserPoints(1, validatedData.score);
      
      res.json(gameScore);
    } catch (error) {
      res.status(400).json({ message: "Invalid game score data" });
    }
  });

  app.get("/api/game/scores/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const scores = await storage.getUserGameScores(1, gameType);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game scores" });
    }
  });

  app.get("/api/game/leaderboard/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const { limit = "10" } = req.query;
      const leaderboard = await storage.getLeaderboard(gameType, parseInt(limit as string));
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Cultural content endpoints
  app.get("/api/culture", async (req, res) => {
    try {
      const { category } = req.query;
      let content;
      
      if (category) {
        content = await storage.getCulturalContentByCategory(category as string);
      } else {
        content = await storage.getAllCulturalContent();
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cultural content" });
    }
  });

  // Progress analysis endpoint
  app.get("/api/progress/analysis", async (req, res) => {
    try {
      const stats = await storage.getUserStats(1);
      const analysis = await analyzeLearningProgress(stats);
      res.json({ analysis, stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
