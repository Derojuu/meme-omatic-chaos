import { Card } from "@/components/ui/card";

interface Player {
  id: string;
  name: string;
  score: number;
  isLeader?: boolean;
  isYou?: boolean;
}

interface ScoreboardProps {
  players: Player[];
  className?: string;
}

export const Scoreboard = ({ players, className }: ScoreboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className={`p-4 bg-game-card border-border ${className}`}>
      <h3 className="text-lg font-bold text-foreground mb-4 text-center">
        🏆 Scoreboard
      </h3>
      
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              player.isYou ? 'bg-neon-purple/20 border border-neon-purple/50' : 'bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-foreground">
                {player.name}
                {player.isYou && ' (You)'}
              </span>
              {player.isLeader && (
                <span className="text-neon-green">👑</span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <span className="font-bold text-foreground">{player.score}</span>
              <span className="text-sm text-muted-foreground">pts</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};