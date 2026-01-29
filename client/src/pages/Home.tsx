import { useFiles } from "@/hooks/use-files";
import { FileCard } from "@/components/FileCard";
import { Loader2, AlertTriangle, Wifi } from "lucide-react";

export default function Home() {
  const { data: files, isLoading, error } = useFiles();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-bold font-mono animate-pulse">ESTABLISHING CONNECTION...</h2>
        <p className="text-sm font-mono text-muted-foreground mt-2">Loading archive index</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-destructive/10 p-6 rounded-none border-4 border-destructive mb-6">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">CONNECTION FAILURE</h2>
          <p className="font-mono max-w-md mx-auto">
            Unable to retrieve the file manifest. The server may be offline or unreachable.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="brutal-btn"
        >
          RETRY UPLINK
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-white border-b-4 border-black p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Wifi className="w-64 h-64" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block bg-black text-white px-3 py-1 text-sm font-mono font-bold mb-4">
            Directory Listing
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            FEATURE PHONE<br />
            <span className="text-primary">ARCHIVE REPOSITORY</span>
          </h1>
          <p className="text-lg font-mono max-w-2xl text-muted-foreground border-l-4 border-primary pl-4">
            Curated collection of lightweight content optimized for 2G/EDGE networks. 
            Direct download links available. No Javascript required for core functions.
          </p>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse block"></span>
            AVAILABLE FILES ({files?.length || 0})
          </h2>
        </div>

        {files?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-black bg-gray-50">
            <p className="font-mono text-xl text-muted-foreground">Directory is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files?.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
