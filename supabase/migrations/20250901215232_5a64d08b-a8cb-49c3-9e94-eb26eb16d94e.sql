-- Create enum for game status
CREATE TYPE game_status AS ENUM ('waiting', 'in_progress', 'finished');

-- Create enum for round phases
CREATE TYPE round_phase AS ENUM ('situation', 'playing', 'voting', 'results');

-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  current_round INTEGER DEFAULT 0,
  leader_id UUID,
  status game_status DEFAULT 'waiting',
  current_phase round_phase DEFAULT 'situation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  hand JSONB DEFAULT '[]',
  is_leader BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rounds table
CREATE TABLE public.rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  leader_id UUID NOT NULL REFERENCES public.players(id),
  situation TEXT,
  winner_id UUID REFERENCES public.players(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plays table
CREATE TABLE public.plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  meme_id TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(round_id, player_id)
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  play_id UUID NOT NULL REFERENCES public.plays(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(play_id, voter_id)
);

-- Create meme_cards table with predefined memes
CREATE TABLE public.meme_cards (
  id TEXT NOT NULL PRIMARY KEY,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'reaction',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some initial meme cards
INSERT INTO public.meme_cards (id, image_url, category) VALUES
('meme-cat', '/src/assets/meme-cat.jpg', 'reaction'),
('meme-dog', '/src/assets/meme-dog.jpg', 'funny'),
('meme-shocked', '/src/assets/meme-shocked.jpg', 'reaction');

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_cards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for games
CREATE POLICY "Anyone can view games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON public.games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON public.games FOR UPDATE USING (true);

-- Create RLS policies for players
CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can create players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);

-- Create RLS policies for rounds
CREATE POLICY "Anyone can view rounds" ON public.rounds FOR SELECT USING (true);
CREATE POLICY "Anyone can create rounds" ON public.rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rounds" ON public.rounds FOR UPDATE USING (true);

-- Create RLS policies for plays
CREATE POLICY "Anyone can view plays" ON public.plays FOR SELECT USING (true);
CREATE POLICY "Anyone can create plays" ON public.plays FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update plays" ON public.plays FOR UPDATE USING (true);

-- Create RLS policies for votes
CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Anyone can create votes" ON public.votes FOR INSERT WITH CHECK (true);

-- Create RLS policies for meme_cards
CREATE POLICY "Anyone can view meme_cards" ON public.meme_cards FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rounds_updated_at
  BEFORE UPDATE ON public.rounds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.games REPLICA IDENTITY FULL;
ALTER TABLE public.players REPLICA IDENTITY FULL;
ALTER TABLE public.rounds REPLICA IDENTITY FULL;
ALTER TABLE public.plays REPLICA IDENTITY FULL;
ALTER TABLE public.votes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE public.plays;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;