import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  ChevronDown, 
  Save, 
  Trash2, 
  Plus, 
  Search, 
  BookOpen, 
  Library, 
  Layers
} from 'lucide-react';
import GameCard, { GameCardProps, CardRarity, CardType } from './GameCard';
import { cn } from '@/lib/utils';

// Sample card collection data
const CARD_COLLECTION: GameCardProps[] = [
  { id: '1', name: 'Fire Elemental', cost: 2, type: 'minion', rarity: 'rare', attack: 3, health: 2, description: 'Deal 1 damage to all enemy minions when played', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Healing Rain', cost: 3, type: 'spell', rarity: 'common', description: 'Restore 4 health to your hero', image: 'https://images.unsplash.com/photo-1525824236856-8c0a31dfe3be?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Ancient Dragon', cost: 7, type: 'minion', rarity: 'legendary', attack: 8, health: 8, description: 'Whenever this attacks, draw a card', image: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=200&auto=format&fit=crop' },
  { id: '4', name: 'Shadow Blade', cost: 2, type: 'weapon', rarity: 'epic', attack: 3, health: 2, description: 'Your hero is immune when attacking', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop' },
  { id: '5', name: 'Novice Wizard', cost: 1, type: 'minion', rarity: 'common', attack: 1, health: 1, description: 'Spell Damage +1', image: 'https://images.unsplash.com/photo-1590955559496-50316bd28ff2?q=80&w=200&auto=format&fit=crop' },
  { id: '6', name: 'Defender', cost: 2, type: 'minion', rarity: 'common', attack: 2, health: 3, description: 'Taunt', image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=200&auto=format&fit=crop' },
  { id: '7', name: 'Dark Knight', cost: 4, type: 'minion', rarity: 'epic', attack: 5, health: 4, description: 'Deals double damage to heroes', image: 'https://images.unsplash.com/photo-1596636478939-59fed7a083f2?q=80&w=200&auto=format&fit=crop' },
  { id: '8', name: 'Time Warp', cost: 5, type: 'spell', rarity: 'legendary', description: 'Take an extra turn after this one', image: 'https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?q=80&w=200&auto=format&fit=crop' },
  { id: '9', name: 'Healing Potion', cost: 1, type: 'spell', rarity: 'common', description: 'Restore 3 health to any character', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=200&auto=format&fit=crop' },
  { id: '10', name: 'Fireball', cost: 4, type: 'spell', rarity: 'common', description: 'Deal 6 damage to any target', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=200&auto=format&fit=crop' },
  { id: '11', name: 'Jungle Panther', cost: 3, type: 'minion', rarity: 'common', attack: 4, health: 2, description: 'Stealth', image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=200&auto=format&fit=crop' },
  { id: '12', name: 'Holy Light', cost: 2, type: 'spell', rarity: 'rare', description: 'Restore 6 health to a friendly character', image: 'https://images.unsplash.com/photo-1501696461415-6bd6660c6742?q=80&w=200&auto=format&fit=crop' },
];

// Sample existing decks
const SAMPLE_DECKS = [
  { id: 'd1', name: 'Aggro Warrior', cards: CARD_COLLECTION.slice(0, 5) },
  { id: 'd2', name: 'Control Mage', cards: CARD_COLLECTION.slice(3, 8) },
];

interface DeckInfo {
  id: string;
  name: string;
  cards: GameCardProps[];
}

interface DeckBuilderProps {
  className?: string;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ className }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<CardType | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<CardRarity | 'all'>('all');
  const [currentDeck, setCurrentDeck] = useState<DeckInfo>({ id: 'new', name: 'New Deck', cards: [] });
  const [decks, setDecks] = useState<DeckInfo[]>(SAMPLE_DECKS);
  const [deckNameInput, setDeckNameInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  const MAX_DECK_SIZE = 20;
  
  const filteredCollection = CARD_COLLECTION.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || card.type === filterType;
    const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity;
    
    return matchesSearch && matchesType && matchesRarity;
  });
  
  const handleAddCardToDeck = (card: GameCardProps) => {
    if (currentDeck.cards.length >= MAX_DECK_SIZE) {
      toast({
        title: "Deck is full",
        description: `You can only have ${MAX_DECK_SIZE} cards in a deck.`,
        variant: "destructive",
      });
      return;
    }
    
    // Count how many of this card are already in the deck
    const cardCount = currentDeck.cards.filter(c => c.id === card.id).length;
    
    // Legendary cards are limited to 1 per deck
    if (card.rarity === 'legendary' && cardCount >= 1) {
      toast({
        title: "Card limit reached",
        description: "You can only have one copy of each legendary card in a deck.",
        variant: "destructive",
      });
      return;
    }
    
    // Other cards are limited to 2 per deck
    if (cardCount >= 2) {
      toast({
        title: "Card limit reached",
        description: "You can only have two copies of each card in a deck.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentDeck({
      ...currentDeck,
      cards: [...currentDeck.cards, card],
    });
    
    toast({
      title: "Card added",
      description: `Added ${card.name} to your deck.`,
    });
  };
  
  const handleRemoveCardFromDeck = (index: number) => {
    const newCards = [...currentDeck.cards];
    newCards.splice(index, 1);
    setCurrentDeck({
      ...currentDeck,
      cards: newCards,
    });
  };
  
  const handleSaveDeck = () => {
    if (currentDeck.cards.length < 10) {
      toast({
        title: "Deck too small",
        description: "Your deck must have at least 10 cards.",
        variant: "destructive",
      });
      return;
    }
    
    // If this is a new deck, add it to the list
    if (currentDeck.id === 'new') {
      const newDeck = {
        ...currentDeck,
        id: `d${Date.now()}`,
      };
      setDecks([...decks, newDeck]);
      setCurrentDeck(newDeck);
      toast({
        title: "Deck saved",
        description: `Your deck "${currentDeck.name}" has been saved.`,
      });
    } else {
      // Otherwise update the existing deck
      setDecks(decks.map(deck => 
        deck.id === currentDeck.id ? currentDeck : deck
      ));
      toast({
        title: "Deck updated",
        description: `Your deck "${currentDeck.name}" has been updated.`,
      });
    }
  };
  
  const handleChangeDeck = (deckId: string) => {
    if (deckId === 'new') {
      setCurrentDeck({ id: 'new', name: 'New Deck', cards: [] });
      setDeckNameInput('');
      setIsEditingName(false);
    } else {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        setCurrentDeck(deck);
        setDeckNameInput(deck.name);
        setIsEditingName(false);
      }
    }
  };
  
  const handleRenameDeck = () => {
    if (deckNameInput.trim() === '') return;
    
    setCurrentDeck({
      ...currentDeck,
      name: deckNameInput,
    });
    
    setIsEditingName(false);
    
    // If it's an existing deck, update it in the list
    if (currentDeck.id !== 'new') {
      setDecks(decks.map(deck => 
        deck.id === currentDeck.id ? { ...deck, name: deckNameInput } : deck
      ));
    }
  };
  
  const handleClearDeck = () => {
    setCurrentDeck({
      ...currentDeck,
      cards: [],
    });
    
    toast({
      title: "Deck cleared",
      description: "All cards have been removed from your deck.",
    });
  };

  return (
    <div className={cn("bg-gradient-to-br from-game-dark to-game-dark/90 min-h-screen py-6", className)}>
      <div className="container max-w-7xl mx-auto">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-6 h-6 text-game-accent" />
              <h1 className="text-2xl font-bold">Deck Builder</h1>
            </div>
            
            <div className="flex space-x-2">
              {isEditingName ? (
                <div className="flex items-center">
                  <Input
                    value={deckNameInput}
                    onChange={(e) => setDeckNameInput(e.target.value)}
                    className="w-48 mr-2"
                    placeholder="Deck name..."
                  />
                  <Button size="sm" onClick={handleRenameDeck}>Save</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-medium text-lg">{currentDeck.name}</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { 
                        setDeckNameInput(currentDeck.name);
                        setIsEditingName(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Layers className="mr-2 h-4 w-4" />
                        Decks
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Your Decks</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangeDeck('new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Deck
                      </DropdownMenuItem>
                      {decks.map(deck => (
                        <DropdownMenuItem key={deck.id} onClick={() => handleChangeDeck(deck.id)}>
                          <Library className="mr-2 h-4 w-4" />
                          {deck.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Current deck */}
                <div className="lg:w-1/3 glass-panel p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Current Deck ({currentDeck.cards.length}/{MAX_DECK_SIZE})</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveDeck}
                        disabled={currentDeck.cards.length < 10}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClearDeck}
                        disabled={currentDeck.cards.length === 0}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[70vh]">
                    {currentDeck.cards.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <Library className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p>Your deck is empty</p>
                        <p className="text-sm mt-1">Add cards from your collection</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Group cards by name and count them */}
                        {Object.entries(
                          currentDeck.cards.reduce((acc, card) => {
                            acc[card.id] = acc[card.id] ? [...acc[card.id], card] : [card];
                            return acc;
                          }, {} as Record<string, GameCardProps[]>)
                        ).sort((a, b) => a[1][0].cost - b[1][0].cost).map(([cardId, cards]) => (
                          <div 
                            key={cardId} 
                            className="flex items-center p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              {cards[0].cost}
                            </div>
                            <div className="ml-3 flex-grow truncate">
                              <p className={cn(
                                "font-medium truncate",
                                cards[0].rarity === 'legendary' && 'text-game-accent',
                                cards[0].rarity === 'epic' && 'text-purple-300',
                                cards[0].rarity === 'rare' && 'text-blue-300',
                              )}>
                                {cards[0].name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {cards[0].type} • {cards[0].rarity}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 bg-black/30 px-2 py-1 rounded-full text-sm">
                              {cards.length}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="ml-1 flex-shrink-0 h-8 w-8" 
                              onClick={() => handleRemoveCardFromDeck(currentDeck.cards.findIndex(c => c.id === cardId))}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                {/* Card collection */}
                <div className="lg:w-2/3">
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                      <div className="relative w-full sm:w-64">
                        <Input
                          placeholder="Search cards..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                              Type: {filterType === 'all' ? 'All' : filterType}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterType('all')}>All Types</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType('minion')}>Minion</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType('spell')}>Spell</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType('weapon')}>Weapon</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                              Rarity: {filterRarity === 'all' ? 'All' : filterRarity}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterRarity('all')}>All Rarities</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRarity('common')}>Common</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRarity('rare')}>Rare</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRarity('epic')}>Epic</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRarity('legendary')}>Legendary</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[70vh]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredCollection.map((card) => (
                          <div key={card.id} className="flex flex-col items-center">
                            <GameCard {...card} className="w-full max-w-[240px] transform hover:scale-105" />
                            <Button 
                              className="game-btn game-btn-primary mt-2 w-full max-w-[240px]"
                              onClick={() => handleAddCardToDeck(card)}
                            >
                              Add to Deck
                            </Button>
                          </div>
                        ))}
                        
                        {filteredCollection.length === 0 && (
                          <div className="col-span-full text-center py-10 text-gray-400">
                            <Search className="mx-auto h-12 w-12 mb-2 opacity-50" />
                            <p>No cards found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="collection">
              <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Your Collection</h2>
                <p className="text-gray-400">
                  You have {CARD_COLLECTION.length} cards in your collection.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
                  {CARD_COLLECTION.map((card) => (
                    <div key={card.id} className="flex justify-center">
                      <GameCard {...card} className="w-full max-w-[160px]" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
