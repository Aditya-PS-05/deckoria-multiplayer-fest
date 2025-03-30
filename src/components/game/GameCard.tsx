
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import { Shield, Sword, Heart, Zap, Sparkles } from 'lucide-react';

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CardType = 'minion' | 'spell' | 'weapon';

export interface GameCardProps {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  rarity: CardRarity;
  attack?: number;
  health?: number;
  effect?: string;
  description: string;
  image?: string;
  className?: string;
  onPlay?: (id: string) => void;
  isInHand?: boolean;
  isInteractive?: boolean;
}

const DEFAULT_IMAGE = '/placeholder.svg';

const cardTypeIcons: Record<CardType, React.ForwardRefExoticComponent<LucideProps>> = {
  minion: Sword,
  spell: Zap,
  weapon: Shield,
};

const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  cost,
  type,
  rarity,
  attack,
  health,
  effect,
  description,
  image = DEFAULT_IMAGE,
  className,
  onPlay,
  isInHand = false,
  isInteractive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const TypeIcon = cardTypeIcons[type];
  
  const handleClick = () => {
    if (isInteractive && onPlay) {
      onPlay(id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const rarityEffect = isHovered && rarity === 'legendary' ? 'animate-pulse-gold' : '';

  const cardGlow = isHovered
    ? rarity === 'legendary' 
      ? 'shadow-[0_0_15px_rgba(255,193,7,0.6)]'
      : rarity === 'epic'
      ? 'shadow-[0_0_15px_rgba(139,92,246,0.5)]'
      : rarity === 'rare'
      ? 'shadow-[0_0_12px_rgba(59,130,246,0.5)]'
      : 'shadow-[0_0_10px_rgba(255,255,255,0.3)]'
    : '';

  return (
    <div
      className={cn(
        'perspective group',
        isInHand && 'playing-card-container',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={cn(
          'game-card w-56 h-80 select-none card-hover-effect preserve-3d',
          `game-card-rarity-${rarity}`,
          isInteractive && 'cursor-pointer',
          isHovered && 'scale-105',
          cardGlow,
          rarityEffect,
          isInHand && 'animate-card-draw',
          className
        )}
      >
        {/* Card Mana Cost */}
        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-[0_0_5px_rgba(59,130,246,0.5)] z-10">
          {cost}
        </div>
        
        {/* Card Type Indicator */}
        <div className={cn(
          "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10",
          type === 'minion' ? 'bg-red-500' : type === 'spell' ? 'bg-purple-500' : 'bg-amber-500'
        )}>
          <TypeIcon className="w-4 h-4 text-white" />
        </div>
        
        {/* Card Image with improved handling */}
        <div className="w-full h-36 overflow-hidden relative">
          <img
            src={imageError ? DEFAULT_IMAGE : image}
            alt={name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          {rarity === 'legendary' && (
            <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-game-accent/20 to-transparent pointer-events-none" />
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className={cn(
              "font-bold text-sm truncate",
              rarity === 'legendary' && 'text-game-accent',
              rarity === 'epic' && 'text-purple-300',
              rarity === 'rare' && 'text-blue-300',
            )}>
              {name}
            </h3>
            {rarity === 'legendary' && <Sparkles className="w-4 h-4 text-game-accent" />}
          </div>
          
          <p className="text-xs text-gray-300 h-16 overflow-y-auto mb-2">
            {description}
          </p>
          
          {/* Card Stats (for minions and weapons) */}
          {(type === 'minion' || type === 'weapon') && (
            <div className="absolute bottom-2 w-full px-3 flex justify-between">
              <div className="flex items-center">
                <Sword className="w-4 h-4 text-red-400 mr-1" />
                <span className="text-sm font-bold text-red-400">{attack}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm font-bold text-green-400">{health}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
