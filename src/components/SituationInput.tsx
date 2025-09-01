import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Clock, Send } from 'lucide-react';

interface SituationInputProps {
  isLeader: boolean;
  onSubmitSituation: (situation: string) => void;
  timeLeft?: number;
}

const defaultSituations = [
  "When you see your crush with someone else...",
  "When the teacher says 'pop quiz'...",
  "When you're broke but your friends want to go out...",
  "When you realize you left your homework at home...",
  "When someone spoils your favorite show...",
  "When you're trying to be healthy but see pizza...",
  "When you hear your alarm go off on Monday morning...",
  "When you're pretending to understand the lecture..."
];

export const SituationInput = ({ isLeader, onSubmitSituation, timeLeft = 30 }: SituationInputProps) => {
  const [situation, setSituation] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1 && isLeader && !situation.trim()) {
          // Auto-submit random situation if leader doesn't provide one
          const randomSituation = defaultSituations[Math.floor(Math.random() * defaultSituations.length)];
          onSubmitSituation(randomSituation);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLeader, situation, onSubmitSituation]);

  const handleSubmit = () => {
    const finalSituation = situation.trim() || defaultSituations[Math.floor(Math.random() * defaultSituations.length)];
    onSubmitSituation(finalSituation);
  };

  if (!isLeader) {
    return (
      <div className="min-h-screen bg-game-dark p-4 flex items-center justify-center">
        <Card className="p-8 bg-game-card border-neon-cyan text-center max-w-md">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-neon-cyan">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold">{timeRemaining}s</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Waiting for situation...
            </h2>
            <p className="text-muted-foreground">
              The game leader is setting up this round's situation.
            </p>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-neon-cyan h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeRemaining / timeLeft) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-dark p-4 flex items-center justify-center">
      <Card className="p-8 bg-game-card border-neon-purple max-w-lg w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-neon-pink mb-4">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold">{timeRemaining}s</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              👑 You're the Leader!
            </h2>
            <p className="text-muted-foreground">
              Set the situation for this round
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Type a funny situation... (or leave blank for a random one)"
              className="min-h-[120px] bg-game-dark border-border text-foreground resize-none"
              maxLength={200}
            />
            
            <div className="text-right text-sm text-muted-foreground">
              {situation.length}/200
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-neon-green text-game-dark hover:bg-neon-green/80"
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Situation
            </Button>
          </div>

          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-neon-pink h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeRemaining / timeLeft) * 100}%` }}
            />
          </div>

          {timeRemaining <= 10 && (
            <p className="text-center text-sm text-neon-pink animate-pulse">
              ⚠️ Time running out! A random situation will be chosen if you don't submit.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};