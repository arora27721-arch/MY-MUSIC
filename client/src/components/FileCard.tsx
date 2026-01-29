import { type File } from "@shared/schema";
import { FileIcon, HardDrive, Download, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface FileCardProps {
  file: File;
}

export function FileCard({ file }: FileCardProps) {
  // Format bytes to KB/MB
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="brutal-card flex flex-col h-full hover:bg-yellow-50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-secondary p-3 border-2 border-black">
          <FileIcon className="w-8 h-8 text-black" />
        </div>
        <div className="font-mono text-xs font-bold bg-black text-white px-2 py-1">
          ID: {file.id.toString().padStart(4, '0')}
        </div>
      </div>
      
      <h3 className="text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
        {file.filename}
      </h3>
      
      <p className="text-sm text-muted-foreground font-mono mb-4 flex-grow line-clamp-3">
        {file.description || "No description provided."}
      </p>
      
      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold border-t-2 border-dashed border-black/20 pt-3">
          <HardDrive className="w-4 h-4" />
          <span>{formatSize(file.size)}</span>
        </div>
        
        <Link href={`/file/${file.id}`} className="w-full brutal-btn text-sm py-2 gap-2 bg-primary text-white hover:bg-primary/90">
          <span>DETAILS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
