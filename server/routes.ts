import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import express from "express";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve files from the 'files' directory
  const filesDir = path.join(process.cwd(), "files");
  
  // Ensure directory exists
  if (!fs.existsSync(filesDir)){
      fs.mkdirSync(filesDir);
  }

  app.use("/files", express.static(filesDir));

  // Sync files from disk to DB (simple seed)
  async function syncFiles() {
    const dbFiles = await storage.getFiles();
    const diskFiles = fs.readdirSync(filesDir);

    for (const filename of diskFiles) {
      if (filename.startsWith('.')) continue; // skip hidden files
      
      const exists = dbFiles.find(f => f.filename === filename);
      if (!exists) {
        const stats = fs.statSync(path.join(filesDir, filename));
        await storage.createFile({
          filename,
          path: `/files/${filename}`,
          size: stats.size,
          description: "Auto-detected file"
        });
      }
    }
  }
  
  // Run initial sync
  syncFiles().catch(console.error);

  // API Routes
  app.get(api.files.list.path, async (req, res) => {
    // Re-sync on listing to catch new files
    await syncFiles();
    const files = await storage.getFiles();
    res.json(files);
  });

  app.get(api.files.get.path, async (req, res) => {
    const file = await storage.getFile(Number(req.params.id));
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(file);
  });

  // Lite / No-JS Route
  app.get("/lite", async (req, res) => {
    await syncFiles();
    const files = await storage.getFiles();
    
    const fileListHtml = files.map(f => `
      <div style="border-bottom: 1px solid #ccc; padding: 10px 0;">
        <a href="${f.path}" style="font-size: 1.2em; font-weight: bold; text-decoration: none; color: #000;">${f.filename}</a>
        <div style="color: #666; font-size: 0.9em;">
          Size: ${Math.round(f.size / 1024)} KB<br/>
          ${f.description || ''}
        </div>
        <a href="${f.path}" style="display: inline-block; margin-top: 5px; padding: 5px 10px; background: #eee; text-decoration: none; color: #333; border: 1px solid #ccc;">Download</a>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Files (Lite)</title>
        <style>
          body { font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.5; }
          h1 { border-bottom: 2px solid #000; }
          .footer { margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; font-size: 0.8em; }
        </style>
      </head>
      <body>
        <h1>File Downloads</h1>
        <p>Lite version for older devices.</p>
        
        <div class="file-list">
          ${fileListHtml}
        </div>

        <div class="footer">
          <p>Served from Docker container.</p>
          <a href="/">Switch to Modern View</a>
        </div>
      </body>
      </html>
    `;
    
    res.send(html);
  });

  return httpServer;
}
