
import React, { useState, useEffect } from 'react';
import GameLobby from '@/components/game/GameLobby';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Lobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Close menu when navigating away from mobile
  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  const handleJoinGame = (gameId: string) => {
    // In a real app, this would connect to the multiplayer game
    toast({
      title: "Joining game",
      description: `Connecting to game ${gameId}...`,
    });
    
    // Navigate to the game page
    setTimeout(() => {
      navigate('/play');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="bg-black/40 p-2 flex items-center justify-between">
        {isMobile ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-bold text-white font-display">Game Lobby</h1>
            <ThemeToggle />
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
            <h1 className="text-lg font-bold text-white font-display">Game Lobby</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/decks')} className="text-white">
                Deck Builder
              </Button>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
      
      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div className="bg-black/60 backdrop-blur-md p-4 absolute top-[3.25rem] left-0 w-full z-50 animate-fade-in-right">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" onClick={() => { setMenuOpen(false); navigate('/'); }} className="justify-start text-white">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => { setMenuOpen(false); navigate('/decks'); }} className="justify-start text-white">
              Deck Builder
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        <GameLobby onJoinGame={handleJoinGame} />
      </div>
    </div>
  );
};

export default Lobby;
