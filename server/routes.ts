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
    try {
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
    } catch (err) {
      console.error("Database sync failed:", err.message);
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
    const list = files.map(f => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
        <strong style="font-size: 1.1em;">${f.filename}</strong><br>
        <span style="color: #666; font-size: 0.9em;">Size: ${Math.round(f.size/1024)}KB</span><br>
        <form action="${f.path}" method="GET" style="margin: 0;">
          <input type="submit" value="DOWNLOAD" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; border: none; font-weight: bold; width: 100%; max-width: 200px; -webkit-appearance: none; cursor: pointer;">
        </form>
      </div>
    `).join('');
    res.send(`
      <!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Download Center</title>
        <style type="text/css">
          body { font-family: sans-serif; padding: 10px; margin: 0; background: #fff; color: #000; }
          h1 { font-size: 1.3em; border-bottom: 2px solid #000; padding-bottom: 5px; margin: 0 0 10px 0; }
        </style>
      </head>
      <body>
        <h1>Files</h1>
        <div style="margin-top: 10px;">
          ${list || '<p>No files available yet.</p>'}
        </div>
      </body>
      </html>
    `);
  });

  return httpServer;
}
