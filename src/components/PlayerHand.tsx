import { MemeCard } from "./MemeCard";

interface MemeCardData {
  id: string;
  image: string;
  alt: string;
}

interface PlayerHandProps {
  cards: MemeCardData[];
  selectedCard?: string;
  onCardSelect: (cardId: string) => void;
  disabled?: boolean;
}

export const PlayerHand = ({ 
  cards, 
  selectedCard, 
  onCardSelect, 
  disabled = false 
}: PlayerHandProps) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-foreground mb-4 text-center">
        Your Cards
      </h3>
      
      <div className="flex gap-3 overflow-x-auto pb-4 px-2">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="flex-shrink-0 w-32 md:w-40"
          >
            <MemeCard
              image={card.image}
              alt={card.alt}
              isSelected={selectedCard === card.id}
              onClick={() => !disabled && onCardSelect(card.id)}
              className={disabled ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};