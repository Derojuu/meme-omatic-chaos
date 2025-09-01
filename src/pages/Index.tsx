import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SituationCard } from "@/components/SituationCard";
import { PlayerHand } from "@/components/PlayerHand";
import { GameBoard } from "@/components/GameBoard";
import { Scoreboard } from "@/components/Scoreboard";
import { Gamepad2, Users, Zap } from "lucide-react";

// Import meme images
import memeCat from "@/assets/meme-cat.jpg";
import memeDog from "@/assets/meme-dog.jpg";
import memeShocked from "@/assets/meme-shocked.jpg";
import logo from "@/assets/logo.jpg";

const Index = () => {
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Mock data for demonstration
  const mockCards = [
    { id: '1', image: memeCat, alt: 'Surprised cat with headphones' },
    { id: '2', image: memeDog, alt: 'Confused dog at computer' },
    { id: '3', image: memeShocked, alt: 'Shocked person reaction' },
    { id: '4', image: memeCat, alt: 'Another funny cat' },
    { id: '5', image: memeDog, alt: 'Another confused dog' },
    { id: '6', image: memeShocked, alt: 'Another shocked reaction' },
  ];

  const mockPlayedCards = [
    { id: '1', image: memeCat, alt: 'Cat meme', playerName: 'Player1', votes: 3, canVote: true },
    { id: '2', image: memeDog, alt: 'Dog meme', playerName: 'Player2', votes: 1, canVote: true },
    { id: '3', image: memeShocked, alt: 'Shocked meme', playerName: 'Player3', votes: 2, canVote: true },
  ];

  const mockPlayers = [
    { id: '1', name: 'You', score: 5, isYou: true, isLeader: true },
    { id: '2', name: 'Alice', score: 3, isLeader: false },
    { id: '3', name: 'Bob', score: 2, isLeader: false },
    { id: '4', name: 'Charlie', score: 4, isLeader: false },
  ];

  const handleJoinGame = () => {
    if (playerName.trim()) {
      setGameState('playing');
    }
  };

  const handleCreateGame = () => {
    if (playerName.trim()) {
      setRoomCode('MEME123');
      setGameState('playing');
    }
  };

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <img 
              src={logo} 
              alt="Meme Chaos Logo" 
              className="mx-auto w-64 h-32 object-contain mb-4 animate-glow"
            />
            <p className="text-lg text-muted-foreground">
              The hilarious multiplayer meme card game!
            </p>
          </div>

          {/* Join/Create Game Form */}
          <Card className="p-6 bg-game-card border-border shadow-card-game">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Nickname
                </label>
                <Input
                  type="text"
                  placeholder="Enter your nickname..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Room Code (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Enter room code to join..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleJoinGame}
                  disabled={!playerName.trim()}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-bold py-3 shadow-neon"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {roomCode ? 'Join Game' : 'Quick Match'}
                </Button>
                
                <Button
                  onClick={handleCreateGame}
                  disabled={!playerName.trim()}
                  variant="secondary"
                  className="w-full bg-neon-cyan text-game-dark hover:bg-neon-cyan/90 font-bold py-3"
                >
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Create Game
                </Button>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-neon-purple">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Real-time multiplayer</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-neon-cyan">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Play with friends</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-neon-pink">
              <Gamepad2 className="h-5 w-5" />
              <span className="text-sm font-medium">Hilarious meme cards</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-game">
      {/* Header */}
      <header className="border-b border-border bg-game-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Meme Chaos" className="h-8 object-contain" />
            {roomCode && (
              <div className="text-sm">
                <span className="text-muted-foreground">Room:</span>
                <span className="ml-1 font-mono font-bold text-neon-cyan">{roomCode}</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Leave Game
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <Scoreboard players={mockPlayers} />
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Situation Card */}
            <SituationCard
              situation="When you realize you've been on mute during the entire meeting..."
              isLeader={true}
              timeLeft={15}
            />

            {/* Game Board */}
            <GameBoard
              playedCards={mockPlayedCards}
              votingPhase={true}
              onVote={(cardId) => console.log('Voted for card:', cardId)}
            />

            {/* Player Hand */}
            <PlayerHand
              cards={mockCards}
              selectedCard={selectedCard}
              onCardSelect={setSelectedCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;