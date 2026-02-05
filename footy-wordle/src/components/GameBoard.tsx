"use client";

import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import { useDailyGame } from "@/hooks/useDailyGame";
import confetti from "canvas-confetti";
import { Clock, Share2 } from "lucide-react";
import AdBanner from "./AdBanner";
import ShareSection from "./ShareSection";

export default function GameBoard({ onQuit }: { onQuit?: () => void }) {
  const {
    targetPlayer,
    guesses,
    setGuesses,
    gameOver,
    setGameOver,
    won,
    setWon,
    isLoading,
  } = useDailyGame();

  const [timer, setTimer] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!gameOver && targetPlayer && !isLoading) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameOver, targetPlayer, isLoading]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (selectedName: string) => {
    if (gameOver || !targetPlayer) return;
    const newGuesses = [...guesses, selectedName];
    setGuesses(newGuesses);
    if (selectedName.toLowerCase() === targetPlayer.name.toLowerCase()) {
      setWon(true);
      setGameOver(true);
      confetti();
    } else if (newGuesses.length >= 3) {
      setGameOver(true);
    }
  };

  const getBlurClass = () => {
    if (gameOver) return "blur-none";
    if (guesses.length === 0) return "blur-2xl";
    if (guesses.length === 1) return "blur-xl";
    if (guesses.length === 2) return "blur-md";
    return "blur-none";
  };

  if (isLoading || !targetPlayer) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    // min-h-dvh é o padrão moderno para altura dinâmica de viewport
    <div className="w-full min-h-dvh flex flex-col relative pb-36">
      {/* Container Centralizado */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-5 animate-in fade-in duration-500 px-6 pt-10">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center font-bold text-slate-700">
          <span className="text-lg">{guesses.length}/3</span>
          <h2 className="text-[#004D40] text-2xl tracking-tight">Challenge</h2>
          <div className="flex items-center gap-1 text-lg">
            <Clock size={20} />
            {formatTime(timer)}
          </div>
        </div>

        {/* Imagem */}
        <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
          <img
            src={targetPlayer.image}
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${getBlurClass()}`}
            alt="Desafio"
          />

          {/* Foco Central */}
          {!gameOver && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                maskImage:
                  "radial-gradient(circle 50px at center, black 100%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle 50px at center, black 100%, transparent 100%)",
              }}
            >
              <img
                src={targetPlayer.image}
                className="w-full h-full object-cover"
                alt="Foco"
              />
            </div>
          )}

          {/* Overlay de Resultado */}
          {gameOver && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                won ? "bg-green-500/10" : "bg-red-500/10"
              } transition-colors duration-1000`}
            />
          )}
        </div>

        {/* --- DICAS --- */}
        <div className="bg-white border border-[#E8F5E9] rounded-3xl p-5 shadow-sm">
          <h3 className="text-[#006B52] font-extrabold text-lg mb-4">Hints</h3>
          <div className="space-y-3">
            {/* Dica 1 */}
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400 font-medium">Position</span>
              <span className="font-bold text-slate-800">
                {targetPlayer.hints[0]}
              </span>
            </div>

            {/* Dica 2 */}
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400 font-medium">Nationality</span>
              <span className="font-bold text-slate-800">
                {guesses.length >= 1 ? targetPlayer.hints[1] : "-"}
              </span>
            </div>

            {/* Dica 3 */}
            <div className="flex justify-between pb-1">
              <span className="text-slate-400 font-medium">Current Club</span>
              <span className="font-bold text-slate-800">
                {guesses.length >= 2 ? targetPlayer.hints[2] : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Área de Ação */}
        <div className="space-y-4">
          {!gameOver ? (
            <div className="bg-white rounded-2xl border-2 border-[#00D656]/20 p-1 focus-within:border-[#00D656] transition-colors shadow-sm">
              <SearchInput onSelect={handleSelect} />
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 items-center">
              <div className="text-center">
                <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">
                  The player was:
                </p>
                <h2 className="text-4xl font-black text-[#006B52] tracking-tighter italic">
                  {targetPlayer.name}
                </h2>
              </div>

              <button
                onClick={() => setIsShareOpen(true)}
                className="w-full py-4 bg-[#00D656] text-white font-black text-xl rounded-full shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={24} />
                Share Result
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Banner Fixo */}
      <div className="fixed bottom-0 left-0 w-full h-25 bg-slate-100 z-50 border-t border-slate-200">
        <div className="w-full h-full max-w-300 mx-auto p-2">
          <AdBanner />
        </div>
      </div>

      <ShareSection
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        won={won}
        guessesCount={guesses.length}
        time={formatTime(timer)}
      />
    </div>
  );
}
