
import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/game/GameBoard';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Game = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Close menu when navigating away from mobile
  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);
  
  return (
    <div className="min-h-screen flex flex-col bg-game-dark">
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
            <h1 className="text-lg font-bold text-white font-display">Card Battle</h1>
            <ThemeToggle />
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/lobby')} className="text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Lobby
            </Button>
            <h1 className="text-lg font-bold text-white font-display">Card Battle</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-white">
                <Home className="h-4 w-4 mr-1" />
                Home
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
            <Button variant="ghost" onClick={() => { setMenuOpen(false); navigate('/lobby'); }} className="justify-start text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lobby
            </Button>
            <Button variant="ghost" onClick={() => { setMenuOpen(false); navigate('/'); }} className="justify-start text-white">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        <GameBoard />
      </div>
    </div>
  );
};

export default Game;
