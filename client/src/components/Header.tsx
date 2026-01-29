import { Link } from "wouter";
import { Terminal } from "lucide-react";

export function Header() {
  return (
    <header className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer select-none">
          <div className="bg-primary text-white p-2 border-2 border-black group-hover:bg-black transition-colors">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl leading-none tracking-tighter">
              DL_ARCHIVE
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
              v1.0.4 // 2G_OPTIMIZED
            </span>
          </div>
        </Link>
        
        <div className="hidden sm:flex gap-4">
           <div className="bg-accent/20 px-2 py-1 border border-black text-xs font-bold uppercase text-accent-foreground/90">
             System: ONLINE
           </div>
        </div>
      </div>
    </header>
  );
}
