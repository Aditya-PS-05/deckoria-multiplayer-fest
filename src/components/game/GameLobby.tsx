
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  UserPlus, 
  Users, 
  Power, 
  Clock, 
  Trophy, 
  Search, 
  MailPlus, 
  Shield, 
  Swords, 
  Sparkles,
  MessagesSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'playing' | 'away' | 'offline';
  level: number;
  rank?: string;
}

interface GameRoomInfo {
  id: string;
  name: string;
  host: PlayerInfo;
  players: PlayerInfo[];
  maxPlayers: number;
  status: 'waiting' | 'in-progress' | 'finished';
  mode: 'casual' | 'ranked' | 'tournament';
  createdAt: string;
}

// Sample players
const SAMPLE_PLAYERS: PlayerInfo[] = [
  { id: 'p1', name: 'CardMaster', avatar: 'https://ui-avatars.com/api/?name=CardMaster&background=a855f7&color=fff', status: 'online', level: 42, rank: 'Gold' },
  { id: 'p2', name: 'DeckBuilder9000', avatar: 'https://ui-avatars.com/api/?name=DeckBuilder&background=3b82f6&color=fff', status: 'playing', level: 31, rank: 'Silver' },
  { id: 'p3', name: 'MagicWielder', avatar: 'https://ui-avatars.com/api/?name=MagicWielder&background=10b981&color=fff', status: 'online', level: 27, rank: 'Bronze' },
  { id: 'p4', name: 'LegendaryPlayer', avatar: 'https://ui-avatars.com/api/?name=Legendary&background=f59e0b&color=fff', status: 'away', level: 65, rank: 'Platinum' },
  { id: 'p5', name: 'SpellCaster123', avatar: 'https://ui-avatars.com/api/?name=SpellCaster&background=ef4444&color=fff', status: 'online', level: 18 },
];

// Sample game rooms
const SAMPLE_ROOMS: GameRoomInfo[] = [
  { 
    id: 'r1', 
    name: 'Pro Players Only', 
    host: SAMPLE_PLAYERS[0], 
    players: [SAMPLE_PLAYERS[0], SAMPLE_PLAYERS[3]], 
    maxPlayers: 2, 
    status: 'waiting', 
    mode: 'ranked',
    createdAt: '2 min ago' 
  },
  { 
    id: 'r2', 
    name: 'Casual Fun Match', 
    host: SAMPLE_PLAYERS[2], 
    players: [SAMPLE_PLAYERS[2]], 
    maxPlayers: 2, 
    status: 'waiting', 
    mode: 'casual',
    createdAt: '5 min ago' 
  },
  { 
    id: 'r3', 
    name: 'Tournament Prep', 
    host: SAMPLE_PLAYERS[1], 
    players: [SAMPLE_PLAYERS[1], SAMPLE_PLAYERS[4]], 
    maxPlayers: 2, 
    status: 'in-progress', 
    mode: 'tournament',
    createdAt: '12 min ago' 
  },
];

interface GameLobbyProps {
  className?: string;
  onJoinGame?: (gameId: string) => void;
  onCreateGame?: (gameInfo: Omit<GameRoomInfo, 'id' | 'createdAt'>) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ 
  className,
  onJoinGame,
  onCreateGame
}) => {
  const { toast } = useToast();
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'casual' | 'ranked' | 'tournament'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'in-progress'>('all');
  const [gameRooms, setGameRooms] = useState<GameRoomInfo[]>(SAMPLE_ROOMS);
  const [friendsList, setFriendsList] = useState<PlayerInfo[]>(SAMPLE_PLAYERS);
  const [selectedRoom, setSelectedRoom] = useState<GameRoomInfo | null>(null);
  const [newGameName, setNewGameName] = useState('');
  const [newGameMode, setNewGameMode] = useState<'casual' | 'ranked' | 'tournament'>('casual');
  
  // Current player (you)
  const currentPlayer: PlayerInfo = {
    id: 'you',
    name: 'You',
    avatar: 'https://ui-avatars.com/api/?name=You&background=8b5cf6&color=fff',
    status: 'online',
    level: 25,
    rank: 'Silver'
  };
  
  const filteredRooms = gameRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.host.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || room.mode === filterMode;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    
    return matchesSearch && matchesMode && matchesStatus;
  });
  
  const handleCreateGame = () => {
    if (newGameName.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a game name",
        variant: "destructive",
      });
      return;
    }
    
    const newRoom: GameRoomInfo = {
      id: `r${Date.now()}`,
      name: newGameName.trim(),
      host: currentPlayer,
      players: [currentPlayer],
      maxPlayers: 2,
      status: 'waiting',
      mode: newGameMode,
      createdAt: 'just now'
    };
    
    setGameRooms([newRoom, ...gameRooms]);
    setIsCreateGameOpen(false);
    setNewGameName('');
    
    toast({
      title: "Game created",
      description: `You created "${newGameName.trim()}"`,
    });
    
    if (onCreateGame) {
      onCreateGame({
        name: newGameName.trim(),
        host: currentPlayer,
        players: [currentPlayer],
        maxPlayers: 2,
        status: 'waiting',
        mode: newGameMode,
      });
    }
  };
  
  const handleJoinGame = (room: GameRoomInfo) => {
    if (room.players.length >= room.maxPlayers) {
      toast({
        title: "Game is full",
        description: "This game has reached the maximum number of players.",
        variant: "destructive",
      });
      return;
    }
    
    if (room.status !== 'waiting') {
      toast({
        title: "Game in progress",
        description: "This game has already started.",
        variant: "destructive",
      });
      return;
    }
    
    // Add player to the room
    const updatedRooms = gameRooms.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          players: [...r.players, currentPlayer]
        };
      }
      return r;
    });
    
    setGameRooms(updatedRooms);
    
    toast({
      title: "Game joined",
      description: `You joined "${room.name}"`,
    });
    
    if (onJoinGame) {
      onJoinGame(room.id);
    }
  };
  
  const handleInviteFriend = (player: PlayerInfo) => {
    toast({
      title: "Invitation sent",
      description: `Invited ${player.name} to play`,
    });
  };
  
  const statusColors = {
    online: "bg-green-500",
    playing: "bg-blue-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500"
  };
  
  // Simulate a player joining a room every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomRoomIndex = Math.floor(Math.random() * gameRooms.length);
        const randomPlayerIndex = Math.floor(Math.random() * friendsList.length);
        const room = gameRooms[randomRoomIndex];
        const player = friendsList[randomPlayerIndex];
        
        // Only add player if not already in the room and room is not full
        if (
          room && 
          player && 
          room.players.length < room.maxPlayers &&
          !room.players.some(p => p.id === player.id) &&
          room.status === 'waiting'
        ) {
          const updatedRooms = gameRooms.map(r => {
            if (r.id === room.id) {
              return {
                ...r,
                players: [...r.players, player]
              };
            }
            return r;
          });
          
          setGameRooms(updatedRooms);
          
          toast({
            title: "Player joined",
            description: `${player.name} joined "${room.name}"`,
          });
        }
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [gameRooms, friendsList]);

  return (
    <div className={cn("bg-gradient-to-br from-game-dark to-game-dark/90 min-h-screen py-6", className)}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="glass-panel p-6 rounded-2xl shadow-xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Users className="h-8 w-8 text-game-accent" />
                Game Lobby
              </h1>
              <p className="text-gray-400">Find opponents and join multiplayer matches</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="game-btn game-btn-primary" 
                onClick={() => setIsCreateGameOpen(true)}
              >
                <Swords className="mr-2 h-5 w-5" />
                Create Game
              </Button>
              <Button 
                className="game-btn game-btn-accent"
                onClick={() => {
                  toast({
                    title: "Quick Match",
                    description: "Searching for an opponent...",
                  });
                  
                  // Simulate finding a match after a delay
                  setTimeout(() => {
                    toast({
                      title: "Match Found!",
                      description: "Joining game with CardMaster",
                    });
                    
                    if (onJoinGame) {
                      onJoinGame('quick-match');
                    }
                  }, 2000);
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Quick Match
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Game rooms */}
            <div className="lg:w-2/3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex space-x-2 w-full sm:w-auto">
                  <select 
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value as any)}
                  >
                    <option value="all">All Modes</option>
                    <option value="casual">Casual</option>
                    <option value="ranked">Ranked</option>
                    <option value="tournament">Tournament</option>
                  </select>
                  
                  <select 
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                  >
                    <option value="all">All Status</option>
                    <option value="waiting">Waiting</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
              </div>
              
              <div className="glass-panel p-4 rounded-xl min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4">Available Games</h2>
                
                {filteredRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Swords className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg">No games found</p>
                    <p className="text-sm mt-1">Create a new game or adjust your filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRooms.map((room) => (
                      <Card key={room.id} className="bg-black/20 border-gray-800 overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {room.name}
                                {room.mode === 'ranked' && (
                                  <Badge variant="default" className="bg-blue-600">Ranked</Badge>
                                )}
                                {room.mode === 'tournament' && (
                                  <Badge variant="default" className="bg-amber-600">Tournament</Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {room.createdAt}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={room.status === 'waiting' ? 'outline' : 'secondary'}
                              className={cn(
                                room.status === 'waiting' ? 'border-green-500 text-green-400' : 'bg-blue-900/30',
                              )}
                            >
                              {room.status === 'waiting' ? 'Waiting for players' : 'In progress'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-2 my-1">
                            {room.players.map((player) => (
                              <div key={player.id} className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                  <img 
                                    src={player.avatar} 
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs">{player.name}</span>
                                {player.id === room.host.id && (
                                  <Trophy className="h-3 w-3 text-yellow-400" />
                                )}
                              </div>
                            ))}
                            
                            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
                              <div key={`empty-${i}`} className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full border border-dashed border-gray-700">
                                <UserPlus className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">Open</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            disabled={room.status !== 'waiting' || room.players.length >= room.maxPlayers}
                            onClick={() => handleJoinGame(room)}
                            className={room.status === 'waiting' && room.players.length < room.maxPlayers ? 'game-btn-primary' : ''}
                          >
                            {room.status === 'waiting' ? 
                              room.players.length >= room.maxPlayers ? 'Full' : 'Join Game' : 
                              'In Progress'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Friends List */}
            <div className="lg:w-1/3">
              <div className="glass-panel p-4 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Friends</h2>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {friendsList.map((friend) => (
                      <div 
                        key={friend.id} 
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img 
                                src={friend.avatar} 
                                alt={friend.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card", statusColors[friend.status])} />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{friend.name}</p>
                            <div className="flex items-center text-xs text-gray-400">
                              <Shield className="h-3 w-3 mr-1" />
                              Level {friend.level}
                              {friend.rank && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{friend.rank}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            disabled={friend.status !== 'online'}
                            onClick={() => handleInviteFriend(friend)}
                          >
                            <MailPlus className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              toast({
                                title: "Chat opened",
                                description: `Started chat with ${friend.name}`,
                              });
                            }}
                          >
                            <MessagesSquare className="h-4 w-4 text-green-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Player stats card */}
              <div className="glass-panel p-4 rounded-xl mt-4">
                <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
                
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img 
                      src={currentPlayer.avatar}
                      alt="Your avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-lg">{currentPlayer.name}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Badge variant="outline" className="bg-game-primary/20 text-game-primary border-game-primary/40">
                        {currentPlayer.rank}
                      </Badge>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">Level {currentPlayer.level}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Wins</span>
                      <span className="font-semibold text-lg">24</span>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Losses</span>
                      <span className="font-semibold text-lg">12</span>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Win Rate</span>
                      <span className="font-semibold text-lg">67%</span>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Rank Points</span>
                      <span className="font-semibold text-lg">248</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create game dialog */}
      <Dialog open={isCreateGameOpen} onOpenChange={setIsCreateGameOpen}>
        <DialogContent className="bg-game-dark border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New Game</DialogTitle>
            <DialogDescription>
              Set up a new game room for other players to join.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Game Name</label>
              <Input
                placeholder="Enter a name for your game"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Game Mode</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button"
                  className={cn(
                    "flex-1",
                    newGameMode === 'casual' 
                      ? 'game-btn-primary' 
                      : 'bg-game-dark border border-gray-700'
                  )}
                  onClick={() => setNewGameMode('casual')}
                >
                  Casual
                </Button>
                <Button 
                  type="button"
                  className={cn(
                    "flex-1",
                    newGameMode === 'ranked' 
                      ? 'game-btn-primary' 
                      : 'bg-game-dark border border-gray-700'
                  )}
                  onClick={() => setNewGameMode('ranked')}
                >
                  Ranked
                </Button>
                <Button 
                  type="button"
                  className={cn(
                    "flex-1",
                    newGameMode === 'tournament' 
                      ? 'game-btn-primary' 
                      : 'bg-game-dark border border-gray-700'
                  )}
                  onClick={() => setNewGameMode('tournament')}
                >
                  Tournament
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGameOpen(false)}>
              Cancel
            </Button>
            <Button className="game-btn-accent" onClick={handleCreateGame}>
              Create Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameLobby;
