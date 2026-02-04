import { create } from "zustand";

interface GameState {
  guesses: string[];
  currentAttempt: number;
  isGameOver: boolean;
  hasWon: boolean;
  addGuess: (guess: string, correctName: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  guesses: [],
  currentAttempt: 0,
  isGameOver: false,
  hasWon: false,
  addGuess: (guess, correctName) =>
    set((state) => {
      const newGuesses = [...state.guesses, guess];
      const won = guess.toLowerCase() === correctName.toLowerCase();
      const lost = newGuesses.length >= 3 && !won;

      return {
        guesses: newGuesses,
        currentAttempt: state.currentAttempt + 1,
        hasWon: won,
        isGameOver: won || lost,
      };
    }),
  resetGame: () =>
    set({ guesses: [], currentAttempt: 0, isGameOver: false, hasWon: false }),
}));
