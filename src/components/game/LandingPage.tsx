
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Book, Settings, Users, LogIn, Sparkles, Sword, Shield, Zap } from 'lucide-react';
import GameCard, { GameCardProps } from './GameCard';
import { cn } from '@/lib/utils';

const FEATURED_CARDS: GameCardProps[] = [
  { id: '1', name: 'Fire Elemental', cost: 2, type: 'minion', rarity: 'rare', attack: 3, health: 2, description: 'Deal 1 damage to all enemy minions when played', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Ancient Dragon', cost: 7, type: 'minion', rarity: 'legendary', attack: 8, health: 8, description: 'Whenever this attacks, draw a card', image: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=200&auto=format&fit=crop' },
  { id: '8', name: 'Time Warp', cost: 5, type: 'spell', rarity: 'legendary', description: 'Take an extra turn after this one', image: 'https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?q=80&w=200&auto=format&fit=crop' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % FEATURED_CARDS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-game-dark to-game-dark/90 text-white overflow-hidden">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-game-accent" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-game-primary to-game-accent bg-clip-text text-transparent">
              Deckoria
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              About
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              Support
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-70"></div>
        <div className="absolute inset-0 bg-game-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Wotfard, sans-serif' }}>
                  Build Decks. <br/>
                  <span className="text-game-accent">Conquer Opponents.</span>
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-lg">
                  Experience the ultimate multiplayer card game with stunning visuals, strategic deck building, and real-time battles against players worldwide.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="game-btn game-btn-primary text-lg py-6 px-8"
                    onClick={() => navigate('/play')}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                  <Button 
                    className="game-btn game-btn-outline text-lg py-6 px-8"
                    onClick={() => navigate('/decks')}
                  >
                    <Book className="h-5 w-5 mr-2" />
                    Build Decks
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative perspective"
              >
                <div className="relative flex justify-center items-center h-[400px]">
                  {FEATURED_CARDS.map((card, index) => (
                    <motion.div
                      key={card.id}
                      className={cn(
                        "absolute transition-all duration-500 transform",
                        index === activeCardIndex 
                          ? "z-20 scale-100" 
                          : index === (activeCardIndex + 1) % FEATURED_CARDS.length
                          ? "z-10 scale-90 translate-x-20 -rotate-6 opacity-80"
                          : "z-0 scale-90 -translate-x-20 rotate-6 opacity-80"
                      )}
                      animate={{
                        scale: index === activeCardIndex ? 1 : 0.9,
                        x: index === activeCardIndex 
                          ? 0 
                          : index === (activeCardIndex + 1) % FEATURED_CARDS.length
                          ? 80
                          : -80,
                        rotate: index === activeCardIndex 
                          ? 0 
                          : index === (activeCardIndex + 1) % FEATURED_CARDS.length
                          ? -6
                          : 6,
                        opacity: index === activeCardIndex ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <GameCard {...card} className="w-[280px] h-[400px]" isInteractive={false} />
                    </motion.div>
                  ))}
                  
                  {/* Animated glow effect */}
                  <div className="absolute w-56 h-56 bg-game-primary/20 rounded-full blur-3xl animate-pulse-gold" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Game Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dive into an immersive card game experience with powerful features designed for casual players and serious strategists alike.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="glass-panel p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-game-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiplayer Battles</h3>
              <p className="text-gray-400">
                Challenge friends or random opponents in real-time multiplayer duels. Climb the ranks and become a legend.
              </p>
            </motion.div>
            
            <motion.div 
              className="glass-panel p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Book className="w-7 h-7 text-game-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Deck Building</h3>
              <p className="text-gray-400">
                Create powerful card combinations with our intuitive deck builder. Experiment with different strategies and card synergies.
              </p>
            </motion.div>
            
            <motion.div 
              className="glass-panel p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-game-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Stunning Visuals</h3>
              <p className="text-gray-400">
                Immerse yourself in beautiful card animations and visual effects that bring the game to life with every play.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Card Types */}
      <section className="py-16 md:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Strategic Card Types</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Master different card types to dominate your opponents and create winning strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <Sword className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Minions</h3>
              <p className="text-center text-gray-400 max-w-xs">
                Summon powerful creatures to attack your enemies and defend your hero. Each minion has unique abilities and synergies.
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spells</h3>
              <p className="text-center text-gray-400 max-w-xs">
                Cast powerful spells to disrupt your opponent's plans, destroy their minions, or support your own strategy.
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Weapons</h3>
              <p className="text-center text-gray-400 max-w-xs">
                Equip your hero with powerful weapons to attack directly, giving you additional combat options beyond your minions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="glass-panel p-8 md:p-12 rounded-2xl bg-gradient-to-br from-game-primary/30 to-game-secondary/20 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-game-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-game-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-gray-300 max-w-lg">
                  Join thousands of players already battling in Deckoria. Build your deck, challenge opponents, and become a card game master.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="game-btn game-btn-accent text-lg py-6 px-8"
                  onClick={() => navigate('/play')}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play Now
                </Button>
                <Button 
                  className="game-btn game-btn-outline text-lg py-6 px-8"
                  onClick={() => navigate('/decks')}
                >
                  <Book className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-game-accent" />
              <span className="font-bold">Deckoria</span>
              <span className="text-gray-500 text-sm">© 2023</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
