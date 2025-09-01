import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Copy, Users, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Player, Game } from '@/hooks/useGameState';

interface GameLobbyProps {
  game: Game;
  players: Player[];
  currentPlayer: Player;
  onStartGame: () => void;
}

export const GameLobby = ({ game, players, currentPlayer, onStartGame }: GameLobbyProps) => {
  const { toast } = useToast();

  const copyGameCode = () => {
    navigator.clipboard.writeText(game.code);
    toast({ title: "Game code copied!", description: "Share it with your friends" });
  };

  const canStartGame = currentPlayer.is_leader && players.length >= 2;

  return (
    <div className="min-h-screen bg-game-dark p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Meme Chaos
          </h1>
          <p className="text-xl text-game-light">Waiting for players to join...</p>
        </div>

        {/* Game Code Card */}
        <Card className="p-6 bg-game-card border-neon-cyan text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Game Code</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl font-mono font-bold text-neon-cyan bg-game-dark px-6 py-3 rounded-xl border border-neon-cyan/30">
              {game.code}
            </div>
            <Button 
              onClick={copyGameCode}
              size="lg"
              className="bg-neon-purple hover:bg-neon-purple/80"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">Share this code with your friends!</p>
        </Card>

        {/* Players List */}
        <Card className="p-6 bg-game-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-neon-green" />
            <h3 className="text-xl font-bold text-foreground">
              Players ({players.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {players.map((player) => (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  player.id === currentPlayer.id 
                    ? 'bg-neon-purple/20 border-neon-purple/50' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                  <span className="font-medium text-foreground">
                    {player.name}
                    {player.id === currentPlayer.id && ' (You)'}
                  </span>
                  {player.is_leader && (
                    <span className="text-neon-green text-lg">👑</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Start Game Button */}
        {currentPlayer.is_leader && (
          <div className="text-center">
            <Button 
              onClick={onStartGame}
              disabled={!canStartGame}
              size="lg"
              className="bg-neon-green text-game-dark hover:bg-neon-green/80 px-8 py-4 text-xl"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Game
            </Button>
            {!canStartGame && (
              <p className="text-sm text-muted-foreground mt-2">
                Need at least 2 players to start
              </p>
            )}
          </div>
        )}

        {!currentPlayer.is_leader && (
          <div className="text-center">
            <p className="text-muted-foreground">
              Waiting for the game leader to start the game...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};