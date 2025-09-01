import { MemeCard } from "./MemeCard";

interface PlayedCard {
  id: string;
  image: string;
  alt: string;
  playerName: string;
  votes: number;
  canVote?: boolean;
}

interface GameBoardProps {
  playedCards: PlayedCard[];
  onVote?: (cardId: string) => void;
  votingPhase?: boolean;
}

export const GameBoard = ({ 
  playedCards, 
  onVote, 
  votingPhase = false 
}: GameBoardProps) => {
  if (playedCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-muted rounded-2xl">
        <p className="text-muted-foreground text-lg">
          Waiting for players to submit cards...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {votingPhase && (
        <h3 className="text-xl font-bold text-center text-foreground mb-6">
          🗳️ Vote for the funniest card!
        </h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playedCards.map((card) => (
          <div key={card.id} className="space-y-2">
            <MemeCard
              image={card.image}
              alt={card.alt}
              isRevealed={true}
              votes={card.votes}
              onClick={() => votingPhase && card.canVote && onVote?.(card.id)}
              className={
                votingPhase && card.canVote 
                  ? "hover:border-neon-green cursor-pointer" 
                  : votingPhase 
                  ? "opacity-75 cursor-not-allowed" 
                  : ""
              }
            />
            <p className="text-center text-sm font-medium text-foreground">
              {card.playerName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};