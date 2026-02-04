// src/hooks/useDailyGame.ts
import { useState, useEffect } from "react";
import { getDayIndex, getDailyPlayer } from "@/lib/gameLogic";
import { Player } from "@/data/players";

interface GameState {
  guesses: string[];
  gameOver: boolean;
  won: boolean;
  lastPlayedIndex: number; // Salva o ID do dia (ex: dia 100)
}

export function useDailyGame() {
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estado ao abrir o jogo
  useEffect(() => {
    const todayIndex = getDayIndex();
    const playerOfTheDay = getDailyPlayer();
    setTargetPlayer(playerOfTheDay);

    const savedData = localStorage.getItem("footy_daily_state");

    if (savedData) {
      const parsed: GameState = JSON.parse(savedData);

      // Se o save for do MESMO dia de hoje, recupera tudo
      if (parsed.lastPlayedIndex === todayIndex) {
        setGuesses(parsed.guesses);
        setGameOver(parsed.gameOver);
        setWon(parsed.won);
      } else {
        // Se for um dia novo, limpa o localStorage antigo
        localStorage.removeItem("footy_daily_state");
      }
    }
    setIsLoading(false);
  }, []);

  // Salvar estado toda vez que algo mudar
  useEffect(() => {
    if (isLoading || !targetPlayer) return;

    const todayIndex = getDayIndex();
    const state: GameState = {
      guesses,
      gameOver,
      won,
      lastPlayedIndex: todayIndex,
    };

    localStorage.setItem("footy_daily_state", JSON.stringify(state));
  }, [guesses, gameOver, won, isLoading, targetPlayer]);

  return {
    targetPlayer,
    guesses,
    setGuesses,
    gameOver,
    setGameOver,
    won,
    setWon,
    isLoading,
  };
}
