import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Player {
  id: string;
  name: string;
  score: number;
  hand: string[];
  is_leader: boolean;
  created_at?: string;
  updated_at?: string;
  game_id?: string;
}

export interface Game {
  id: string;
  code: string;
  current_round: number;
  leader_id: string | null;
  status: 'waiting' | 'in_progress' | 'finished';
  current_phase: 'situation' | 'playing' | 'voting' | 'results';
}

export interface Round {
  id: string;
  game_id: string;
  round_number: number;
  leader_id: string;
  situation: string | null;
  winner_id: string | null;
}

export interface Play {
  id: string;
  round_id: string;
  player_id: string;
  meme_id: string;
  votes: number;
}

export const useGameState = (gameCode?: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [memeCards, setMemeCards] = useState<any[]>([]);
  const { toast } = useToast();

  // Load meme cards
  useEffect(() => {
    const loadMemeCards = async () => {
      const { data, error } = await supabase
        .from('meme_cards')
        .select('*');
      
      if (error) {
        console.error('Error loading meme cards:', error);
        return;
      }
      
      setMemeCards(data || []);
    };
    
    loadMemeCards();
  }, []);

  // Generate random hand for new player
  const generateRandomHand = useCallback(() => {
    if (memeCards.length === 0) return [];
    const shuffled = [...memeCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6).map(card => card.id);
  }, [memeCards]);

  // Create a new game
  const createGame = async (playerName: string) => {
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert({ code: gameCode })
      .select()
      .single();
    
    if (gameError) {
      toast({ title: "Error creating game", description: gameError.message, variant: "destructive" });
      return null;
    }
    
    const hand = generateRandomHand();
    
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert({ 
        game_id: gameData.id, 
        name: playerName, 
        hand,
        is_leader: true 
      })
      .select()
      .single();
    
    if (playerError) {
      toast({ title: "Error creating player", description: playerError.message, variant: "destructive" });
      return null;
    }
    
    await supabase
      .from('games')
      .update({ leader_id: playerData.id })
      .eq('id', gameData.id);
    
    setCurrentPlayer({
      ...playerData,
      hand: playerData.hand as string[]
    });
    toast({ title: "Game created!", description: `Game code: ${gameCode}` });
    return gameCode;
  };

  // Join an existing game
  const joinGame = async (code: string, playerName: string) => {
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (gameError) {
      toast({ title: "Game not found", description: "Please check the game code", variant: "destructive" });
      return false;
    }
    
    const hand = generateRandomHand();
    
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert({ 
        game_id: gameData.id, 
        name: playerName, 
        hand 
      })
      .select()
      .single();
    
    if (playerError) {
      toast({ title: "Error joining game", description: playerError.message, variant: "destructive" });
      return false;
    }
    
    setCurrentPlayer({
      ...playerData,
      hand: playerData.hand as string[]
    });
    toast({ title: "Joined game!", description: `Welcome to ${code}` });
    return true;
  };

  // Start the game
  const startGame = async () => {
    if (!game || !currentPlayer?.is_leader) return;
    
    await supabase
      .from('games')
      .update({ 
        status: 'in_progress',
        current_phase: 'situation',
        current_round: 1
      })
      .eq('id', game.id);
  };

  // Submit situation
  const submitSituation = async (situation: string) => {
    if (!game || !currentPlayer?.is_leader) return;
    
    const { data: roundData, error } = await supabase
      .from('rounds')
      .insert({
        game_id: game.id,
        round_number: game.current_round,
        leader_id: currentPlayer.id,
        situation
      })
      .select()
      .single();
    
    if (error) {
      toast({ title: "Error submitting situation", description: error.message, variant: "destructive" });
      return;
    }
    
    await supabase
      .from('games')
      .update({ current_phase: 'playing' })
      .eq('id', game.id);
  };

  // Play a card
  const playCard = async (memeId: string) => {
    if (!currentRound || !currentPlayer) return;
    
    const { error } = await supabase
      .from('plays')
      .insert({
        round_id: currentRound.id,
        player_id: currentPlayer.id,
        meme_id: memeId
      });
    
    if (error) {
      toast({ title: "Error playing card", description: error.message, variant: "destructive" });
      return;
    }
    
    // Remove card from hand
    const newHand = currentPlayer.hand.filter(id => id !== memeId);
    await supabase
      .from('players')
      .update({ hand: newHand })
      .eq('id', currentPlayer.id);
  };

  // Vote for a card
  const voteForCard = async (playId: string) => {
    if (!currentPlayer) return;
    
    const { error } = await supabase
      .from('votes')
      .insert({
        play_id: playId,
        voter_id: currentPlayer.id
      });
    
    if (error) {
      toast({ title: "Error voting", description: error.message, variant: "destructive" });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!gameCode) return;
    
    const gameChannel = supabase
      .channel('game-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `code=eq.${gameCode}` }, 
        (payload) => setGame(payload.new as Game))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, 
        () => loadPlayers())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, 
        () => loadCurrentRound())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plays' }, 
        () => loadPlays())
      .subscribe();
    
    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [gameCode]);

  const loadPlayers = async () => {
    if (!game) return;
    
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', game.id);
    
    // Ensure is_leader is set for the correct player (leader_id from game)
    setPlayers((data || []).map(player => ({
      ...player,
      hand: player.hand as string[],
      is_leader: game?.leader_id === player.id
    })));
  };

  const loadCurrentRound = async () => {
    if (!game) return;
    
    const { data } = await supabase
      .from('rounds')
      .select('*')
      .eq('game_id', game.id)
      .eq('round_number', game.current_round)
      .single();
    
    setCurrentRound(data);
  };

  const loadPlays = async () => {
    if (!currentRound) return;
    
    const { data } = await supabase
      .from('plays')
      .select(`
        *,
        votes(count)
      `)
      .eq('round_id', currentRound.id);
    
    setPlays(data || []);
  };

  // Load initial data when game code changes
  useEffect(() => {
    if (!gameCode) return;
    
    const loadGameData = async () => {
      const { data: gameData } = await supabase
        .from('games')
        .select('*')
        .eq('code', gameCode)
        .single();
      
      if (gameData) {
        setGame(gameData);
      }
    };
    
    loadGameData();
  }, [gameCode]);

  // Load dependent data when game changes
  useEffect(() => {
    if (game) {
      loadPlayers();
      loadCurrentRound();
      // If currentPlayer exists, update is_leader status
      if (currentPlayer && game.leader_id) {
        setCurrentPlayer({
          ...currentPlayer,
          is_leader: currentPlayer.id === game.leader_id
        });
      }
    }
  }, [game]);

  useEffect(() => {
    if (currentRound) {
      loadPlays();
    }
  }, [currentRound]);

  return {
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
  };
};