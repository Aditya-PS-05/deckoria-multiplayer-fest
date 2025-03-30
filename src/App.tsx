
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";

// Lazy-loaded pages for better performance
const Home = lazy(() => import("./pages/Index"));
const Game = lazy(() => import("./pages/Game"));
const DeckBuilder = lazy(() => import("./pages/Decks"));
const GameLobby = lazy(() => import("./pages/Lobby"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-game-dark text-white">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Game />} />
              <Route path="/decks" element={<DeckBuilder />} />
              <Route path="/lobby" element={<GameLobby />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
