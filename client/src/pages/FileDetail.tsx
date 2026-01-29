import { useFile } from "@/hooks/use-files";
import { useRoute } from "wouter";
import { Loader2, Download, FileText, Calendar, HardDrive, ArrowLeft, Share2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function FileDetail() {
  const [, params] = useRoute("/file/:id");
  const id = parseInt(params?.id || "0");
  const { data: file, isLoading, error } = useFile(id);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-mono mt-4 animate-pulse">Retrieving file metadata...</p>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 border-4 border-black bg-red-50 text-center">
        <h1 className="text-3xl font-bold mb-4">404: FILE NOT FOUND</h1>
        <p className="font-mono mb-8">The requested resource identifier does not exist in the archives.</p>
        <Link href="/" className="brutal-btn">
          <ArrowLeft className="w-4 h-4 mr-2" />
          RETURN TO INDEX
        </Link>
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
      <Link href="/" className="inline-flex items-center text-sm font-bold hover:underline mb-8 font-mono">
        <ArrowLeft className="w-4 h-4 mr-2" />
        BACK TO DIRECTORY
      </Link>

      <div className="bg-white brutal-border p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* File Icon / Type Indicator */}
          <div className="flex-shrink-0 w-24 h-24 bg-primary text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-mono text-2xl font-bold">
              {file.filename.split('.').pop()?.toUpperCase() || 'FILE'}
            </span>
          </div>

          <div className="flex-grow w-full">
            <h1 className="text-2xl md:text-4xl font-black break-all leading-tight mb-4">
              {file.filename}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <HardDrive className="w-4 h-4 text-black" />
                <span>Size: <span className="text-black font-bold">{formatSize(file.size)}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-black" />
                <span>Date: <span className="text-black font-bold">{file.createdAt ? format(new Date(file.createdAt), 'yyyy-MM-dd') : 'Unknown'}</span></span>
              </div>
            </div>

            <div className="bg-secondary/30 p-4 border border-black mb-8">
              <h3 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Description
              </h3>
              <p className="font-mono text-sm leading-relaxed">
                {file.description || "No detailed description available for this file."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Native download link for reliability */}
              <a 
                href={`/api/files/${file.id}/download`} // Assuming this endpoint exists or handled by path
                download 
                className="w-full brutal-btn bg-accent text-white border-black text-center justify-center text-lg py-4 hover:bg-accent/90"
              >
                <Download className="w-6 h-6 mr-3" />
                INITIATE DOWNLOAD
              </a>
              
              <div className="text-center">
                 <p className="text-[10px] font-mono uppercase text-muted-foreground">
                   SHA-256 Checksum verification recommended after transfer.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
