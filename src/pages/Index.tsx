import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SituationCard } from "@/components/SituationCard";
import { PlayerHand } from "@/components/PlayerHand";
import { GameBoard } from "@/components/GameBoard";
import { Scoreboard } from "@/components/Scoreboard";
import { GameLobby } from "@/components/GameLobby";
import { SituationInput } from "@/components/SituationInput";
import { useGameState } from "@/hooks/useGameState";
import { Plus, Users } from "lucide-react";

const Index = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [currentGameCode, setCurrentGameCode] = useState<string>(() => {
    return localStorage.getItem("currentGameCode") || undefined;
  });
  // Restore currentPlayer from localStorage if needed
  const [restoredPlayer, setRestoredPlayer] = useState<any>(() => {
    const raw = localStorage.getItem("currentPlayer");
    return raw ? JSON.parse(raw) : undefined;
  });

  // Persist currentGameCode
  useEffect(() => {
    if (currentGameCode) {
      localStorage.setItem("currentGameCode", currentGameCode);
    }
  }, [currentGameCode]);
  
  const {
    game,
    players,
    currentRound,
    plays,
    currentPlayer,
    memeCards,
    createGame,
    joinGame,
    startGame,
    submitSituation,
    playCard,
    voteForCard
  } = useGameState(currentGameCode);

  // Persist currentPlayer
  useEffect(() => {
    if (currentPlayer) {
      localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    }
  }, [currentPlayer]);

  const [selectedCard, setSelectedCard] = useState<string>();

  const handleCreateGame = async () => {
    if (!playerName.trim()) return;
    const code = await createGame(playerName);
    if (code) {
      setCurrentGameCode(code);
      localStorage.setItem("currentGameCode", code);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim() || !gameCode.trim()) return;
    const success = await joinGame(gameCode, playerName);
    if (success) {
      setCurrentGameCode(gameCode.toUpperCase());
      localStorage.setItem("currentGameCode", gameCode.toUpperCase());
    }
  };

  const handleCardSelect = (cardId: string) => {
    if (game?.current_phase === 'playing' && !plays.find(p => p.player_id === currentPlayer?.id)) {
      setSelectedCard(cardId);
      playCard(cardId);
    }
  };

  const handleVote = (playId: string) => {
    if (game?.current_phase === 'voting') {
      voteForCard(playId);
    }
  };

  // Show main menu if no game
  if (!currentGameCode || !game || !currentPlayer) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Meme Chaos
            </h1>
            <p className="text-xl text-game-light">The Ultimate Meme Card Game</p>
          </div>

          {/* Game Options */}
          <Card className="p-6 bg-game-card border-neon-cyan shadow-glow">
            <div className="space-y-6">
              {/* Player Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-game-dark border-border text-foreground"
                />
              </div>

              {/* Create Game */}
              <Button 
                onClick={handleCreateGame}
                className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white"
                size="lg"
                disabled={!playerName.trim()}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Game
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-game-card text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Join Game */}
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter game code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  className="bg-game-dark border-border text-foreground"
                />
                <Button 
                  onClick={handleJoinGame}
                  className="w-full bg-neon-green text-game-dark hover:bg-neon-green/80"
                  size="lg"
                  disabled={!playerName.trim() || !gameCode.trim()}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Game
                </Button>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Multiplayer meme mayhem awaits! 🎴</p>
          </div>
        </div>
      </div>
    );
  }

  // Show lobby if game is waiting
  if (game.status === 'waiting') {
    return (
      <GameLobby 
        game={game}
        players={players}
        currentPlayer={currentPlayer}
        onStartGame={startGame}
      />
    );
  }

  // Show situation input if it's situation phase
  if (game.current_phase === 'situation') {
    return (
      <SituationInput
        isLeader={currentPlayer.is_leader}
        onSubmitSituation={submitSituation}
      />
    );
  }

  // Get played cards with vote counts and player info
  const playedCards = plays.map(play => {
    const player = players.find(p => p.id === play.player_id);
    const meme = memeCards.find(m => m.id === play.meme_id);
    return {
      id: play.id,
      image: meme?.image_url || '',
      alt: `${meme?.id} meme`,
      playerName: player?.name || 'Unknown',
      votes: play.votes,
      canVote: currentPlayer.id !== play.player_id
    };
  });

  // Get current player's hand as meme card objects
  const playerHand = currentPlayer.hand.map(memeId => {
    const meme = memeCards.find(m => m.id === memeId);
    return {
      id: memeId,
      image: meme?.image_url || '',
      alt: `${memeId} meme`
    };
  });

  // Show main game
  return (
    <div className="min-h-screen bg-game-dark p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Meme Chaos
          </h1>
          <p className="text-game-light">
            Round {game.current_round} - {game.current_phase === 'playing' ? 'Play Phase' : 'Voting Phase'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Situation Card */}
            {currentRound && (
              <SituationCard 
                situation={currentRound.situation || "Loading situation..."}
                isLeader={currentPlayer.is_leader}
              />
            )}
            
            {/* Game Board */}
            <GameBoard 
              playedCards={playedCards}
              onVote={handleVote}
              votingPhase={game.current_phase === 'voting'}
            />
            
            {/* Player Hand */}
            <PlayerHand 
              cards={playerHand}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              disabled={game.current_phase !== 'playing' || !!plays.find(p => p.player_id === currentPlayer.id)}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Scoreboard 
              players={players.map(p => ({
                ...p,
                isYou: p.id === currentPlayer.id,
                isLeader: p.is_leader
              }))} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;