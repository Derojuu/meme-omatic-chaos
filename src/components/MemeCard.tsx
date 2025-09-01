import { cn } from "@/lib/utils";

interface MemeCardProps {
  image: string;
  alt: string;
  isSelected?: boolean;
  isRevealed?: boolean;
  votes?: number;
  onClick?: () => void;
  className?: string;
}

export const MemeCard = ({ 
  image, 
  alt, 
  isSelected = false, 
  isRevealed = false, 
  votes = 0, 
  onClick,
  className 
}: MemeCardProps) => {
  return (
    <div 
      className={cn(
        "relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        "border-2 bg-game-card shadow-card-game hover:shadow-glow",
        isSelected 
          ? "border-neon-purple shadow-neon animate-glow scale-105" 
          : "border-border hover:border-neon-cyan hover:scale-105",
        isRevealed && "animate-float",
        className
      )}
      onClick={onClick}
    >
      <img 
        src={image} 
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* Selection glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-primary opacity-20 animate-pulse-neon" />
      )}
      
      {/* Vote counter */}
      {isRevealed && votes > 0 && (
        <div className="absolute top-2 right-2 bg-neon-purple text-white px-2 py-1 rounded-full text-sm font-bold shadow-neon">
          {votes} 👍
        </div>
      )}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};