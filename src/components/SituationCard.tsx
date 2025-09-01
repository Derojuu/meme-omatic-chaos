import { cn } from "@/lib/utils";

interface SituationCardProps {
  situation: string;
  isLeader?: boolean;
  timeLeft?: number;
  className?: string;
}

export const SituationCard = ({ 
  situation, 
  isLeader = false, 
  timeLeft,
  className 
}: SituationCardProps) => {
  return (
    <div className={cn(
      "relative p-6 rounded-2xl border-2 border-neon-cyan bg-gradient-secondary text-center",
      "shadow-glow animate-glow min-h-[120px] flex flex-col justify-center",
      className
    )}>
      {/* Timer indicator */}
      {timeLeft !== undefined && (
        <div className="absolute top-2 right-2 bg-neon-pink text-white px-3 py-1 rounded-full font-bold text-sm">
          {timeLeft}s
        </div>
      )}
      
      {/* Leader badge */}
      {isLeader && (
        <div className="absolute top-2 left-2 bg-neon-green text-game-dark px-3 py-1 rounded-full font-bold text-sm">
          👑 Leader
        </div>
      )}
      
      <h2 className="text-xl md:text-2xl font-bold text-game-dark mb-2">
        Situation
      </h2>
      
      <p className="text-lg text-game-dark font-medium leading-relaxed">
        {situation}
      </p>
      
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-2xl -z-10 blur-xl" />
    </div>
  );
};