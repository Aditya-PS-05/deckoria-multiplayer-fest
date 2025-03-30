
import React, { useState } from 'react';
import { Sparkles, Shield, Sword, User, UserPlus, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import GameCard, { GameCardProps } from './GameCard';
import { cn } from '@/lib/utils';

interface PlayerState {
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  deck: number;
  hand: GameCardProps[];
  board: GameCardProps[];
}

interface GameBoardProps {
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ className }) => {
  const { toast } = useToast();
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>('player');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  // Sample data
  const [player, setPlayer] = useState<PlayerState>({
    name: 'You',
    health: 30,
    maxHealth: 30,
    mana: 3,
    maxMana: 10,
    deck: 24,
    hand: [
      { id: 'p1', name: 'Fire Elemental', cost: 2, type: 'minion', rarity: 'rare', attack: 3, health: 2, description: 'Deal 1 damage to all enemy minions when played', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=200&auto=format&fit=crop' },
      { id: 'p2', name: 'Healing Rain', cost: 3, type: 'spell', rarity: 'common', description: 'Restore 4 health to your hero', image: 'https://images.unsplash.com/photo-1525824236856-8c0a31dfe3be?q=80&w=200&auto=format&fit=crop' },
      { id: 'p3', name: 'Ancient Dragon', cost: 7, type: 'minion', rarity: 'legendary', attack: 8, health: 8, description: 'Whenever this attacks, draw a card', image: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=200&auto=format&fit=crop' },
      { id: 'p4', name: 'Shadow Blade', cost: 2, type: 'weapon', rarity: 'epic', attack: 3, health: 2, description: 'Your hero is immune when attacking', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop' },
    ],
    board: [
      { id: 'pb1', name: 'Novice Wizard', cost: 1, type: 'minion', rarity: 'common', attack: 1, health: 1, description: 'Spell Damage +1', image: 'https://images.unsplash.com/photo-1590955559496-50316bd28ff2?q=80&w=200&auto=format&fit=crop' },
    ],
  });
  
  const [opponent, setOpponent] = useState<PlayerState>({
    name: 'Opponent',
    health: 24,
    maxHealth: 30,
    mana: 4,
    maxMana: 10,
    deck: 20,
    hand: Array(3).fill(null),
    board: [
      { id: 'ob1', name: 'Defender', cost: 2, type: 'minion', rarity: 'common', attack: 2, health: 3, description: 'Taunt', image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=200&auto=format&fit=crop' },
      { id: 'ob2', name: 'Dark Knight', cost: 4, type: 'minion', rarity: 'epic', attack: 5, health: 4, description: 'Deals double damage to heroes', image: 'https://images.unsplash.com/photo-1596636478939-59fed7a083f2?q=80&w=200&auto=format&fit=crop' },
    ],
  });

  const handlePlayCard = (cardId: string) => {
    if (currentPlayer !== 'player') {
      toast({
        title: "Not your turn!",
        description: "Wait for your opponent to finish their turn.",
        variant: "destructive"
      });
      return;
    }

    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const card = player.hand[cardIndex];
    
    if (card.cost > player.mana) {
      toast({
        title: "Not enough mana!",
        description: `This card costs ${card.cost} mana, but you only have ${player.mana}.`,
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    
    // Create a new hand by removing the played card
    const newHand = [...player.hand];
    newHand.splice(cardIndex, 1);
    
    // Add card to board if it's a minion
    let newBoard = [...player.board];
    if (card.type === 'minion') {
      newBoard = [...newBoard, card];
      
      if (card.rarity === 'legendary') {
        toast({
          title: "Legendary card played!",
          description: `${card.name} enters the battlefield with a powerful effect!`,
          variant: "default"
        });
      }
    } else if (card.type === 'spell') {
      // Handle spell effects
      toast({
        title: "Spell cast!",
        description: card.description,
        variant: "default"
      });
    }
    
    // Update player state
    setPlayer({
      ...player,
      hand: newHand,
      board: newBoard,
      mana: player.mana - card.cost
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleEndTurn = () => {
    if (currentPlayer === 'player') {
      setCurrentPlayer('opponent');
      // Simulate opponent turn
      setTimeout(() => {
        setCurrentPlayer('player');
        // Increase player mana for next turn
        setPlayer({
          ...player,
          mana: Math.min(player.maxMana, player.mana + 1)
        });
        toast({
          title: "Your turn!",
          description: "Draw a card and make your move.",
        });
      }, 2000);
    }
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-game-dark bg-game-pattern", className)}>
      {/* Game actions */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Opponent's side */}
      <div className="w-full px-6 pt-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-game-secondary flex items-center justify-center">
              <User className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">{opponent.name}</p>
              <div className="flex items-center space-x-1">
                <p className="text-xs">Cards: {opponent.deck}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel px-3 py-1 flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-400" />
            <span>{opponent.health}/{opponent.maxHealth}</span>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>{opponent.mana}/{opponent.maxMana}</span>
            </div>
          </div>
        </div>
        
        {/* Opponent hand */}
        <div className="flex justify-center mb-4 h-8">
          {opponent.hand.map((_, i) => (
            <div key={`ohand-${i}`} className="w-10 h-16 bg-purple-900/50 border border-purple-500/30 rounded-md -ml-6 first:ml-0 transform rotate-180" />
          ))}
        </div>
        
        {/* Opponent board */}
        <div className="flex justify-center items-center min-h-[120px] glass-panel p-4 mb-4">
          {opponent.board.length === 0 ? (
            <p className="text-gray-400 text-sm">No minions</p>
          ) : (
            opponent.board.map((card) => (
              <div 
                key={card.id} 
                className="mx-1"
              >
                <GameCard 
                  {...card} 
                  className="w-20 h-28 transform scale-90"
                  isInteractive={false}
                />
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Middle board - battlefield */}
      <div className="relative w-full px-6 py-2">
        <div className="glass-panel py-2 px-4 mx-auto w-fit">
          <span className={cn(
            "font-medium transition-colors",
            currentPlayer === 'player' ? "text-green-400" : "text-red-400"
          )}>
            {currentPlayer === 'player' ? 'Your Turn' : 'Opponent\'s Turn'}
          </span>
        </div>
      </div>
      
      {/* Player board */}
      <div className="w-full px-6 py-2">
        <div className="flex justify-center items-center min-h-[120px] glass-panel p-4 mb-4">
          {player.board.length === 0 ? (
            <p className="text-gray-400 text-sm">Play a minion</p>
          ) : (
            player.board.map((card) => (
              <div 
                key={card.id} 
                className="mx-1"
              >
                <GameCard 
                  {...card} 
                  className="w-20 h-28 transform scale-90"
                  isInteractive={currentPlayer === 'player'}
                />
              </div>
            ))
          )}
        </div>
        
        {/* Player hand */}
        <div className="flex justify-center items-end min-h-[150px] mx-auto">
          {player.hand.map((card, index) => (
            <div 
              key={card.id} 
              className={cn(
                "transform transition-all duration-300 -mx-6 first:ml-0 last:mr-0 hover:translate-y-[-20px] hover:z-10",
                selectedCard === card.id && 'translate-y-[-20px] z-10'
              )}
              style={{
                zIndex: index,
                transform: `rotate(${-10 + index * (20 / (player.hand.length - 1 || 1))}deg)`,
              }}
            >
              <GameCard 
                {...card} 
                isInHand={true}
                onPlay={handlePlayCard}
                isInteractive={currentPlayer === 'player'}
              />
            </div>
          ))}
        </div>
        
        {/* Player info */}
        <div className="flex justify-between items-center mt-4">
          <div className="glass-panel px-3 py-1 flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-400" />
            <span>{player.health}/{player.maxHealth}</span>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>{player.mana}/{player.maxMana}</span>
            </div>
          </div>
          
          <Button 
            className="game-btn game-btn-accent" 
            onClick={handleEndTurn}
            disabled={currentPlayer !== 'player'}
          >
            End Turn
          </Button>
          
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-semibold text-right">{player.name}</p>
              <div className="flex items-center space-x-1 justify-end">
                <p className="text-xs">Cards: {player.deck}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-game-primary flex items-center justify-center">
              <User className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
