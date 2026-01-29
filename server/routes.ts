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
  const filesDir = path.join(process.cwd(), "files");
  if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);

  app.use("/files", express.static(filesDir));

  async function syncFiles() {
    const dbFiles = await storage.getFiles();
    const diskFiles = fs.readdirSync(filesDir);
    for (const filename of diskFiles) {
      if (filename.startsWith('.')) continue;
      if (!dbFiles.find(f => f.filename === filename)) {
        const stats = fs.statSync(path.join(filesDir, filename));
        await storage.createFile({
          filename,
          path: `/files/${filename}`,
          size: stats.size,
          description: ""
        });
      }
    }
  }
  
  syncFiles().catch(console.error);

  app.get(api.files.list.path, async (req, res) => {
    await syncFiles();
    res.json(await storage.getFiles());
  });

  app.get("/", async (req, res) => {
    await syncFiles();
    const files = await storage.getFiles();
    const list = files.map(f => `<li><a href="${f.path}">${f.filename}</a> (${Math.round(f.size/1024)}KB)</li>`).join('');
    res.send(`
      <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
      <style>body{font-family:sans-serif;padding:10px;margin:0}a{display:inline-block;padding:5px 0}li{margin-bottom:10px}</style>
      </head><body><h1>Files</h1><ul>${list}</ul></body></html>
    `);
  });

  return httpServer;
}
