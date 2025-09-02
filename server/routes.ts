import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Get all profiles with pagination and search
  app.get("/api/profiles", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const search = req.query.search as string;

      const result = await storage.getAllProfiles(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Get single profile by slug
  app.get("/api/profiles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const profile = await storage.getProfileBySlug(slug);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Create new profile
  app.post("/api/profiles", upload.single('profilePhoto'), async (req, res) => {
    try {
      const profileData = req.body;
      
      // Add uploaded file path if exists
      if (req.file) {
        profileData.profilePhoto = `/uploads/${req.file.filename}`;
      }

      // Set status to Pending for all new profiles
      profileData.status = "Pending";

      // Generate unique slug
      let baseSlug = generateSlug(profileData.name);
      let slug = baseSlug;
      let counter = 1;
      
      while (await storage.getProfileBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      profileData.slug = slug;

      // Validate the data
      const validatedData = insertProfileSchema.parse(profileData);
      
      // Check if email already exists
      const existingProfile = await storage.getProfileByEmail(validatedData.email);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile with this email already exists" });
      }

      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid profile data", errors: (error as any).errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update profile
  app.put("/api/profiles/:id", upload.single('profilePhoto'), async (req, res) => {
    try {
      const { id } = req.params;
      const profileData = req.body;
      
      // Add uploaded file path if exists
      if (req.file) {
        profileData.profilePhoto = `/uploads/${req.file.filename}`;
      }

      const updatedProfile = await storage.updateProfile(id, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProfile(id);
      
      if (!success) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json({ message: "Profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}