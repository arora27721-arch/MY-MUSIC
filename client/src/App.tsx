import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FileDetail from "@/pages/FileDetail";
import { Header } from "@/components/Header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/file/:id" component={FileDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        
        <footer className="bg-black text-white p-6 border-t-4 border-primary mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <p className="font-display font-bold text-lg">DL_ARCHIVE_SYSTEM</p>
              <p className="font-mono text-xs text-gray-400 mt-1">
                Optimized for legacy hardware & low-bandwidth connections.
              </p>
            </div>
            <div className="font-mono text-xs text-gray-500">
              © {new Date().getFullYear()} // NO COPYRIGHT INTENDED
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
