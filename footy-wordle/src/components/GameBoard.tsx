"use client";

import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import { useDailyGame } from "@/hooks/useDailyGame";
import confetti from "canvas-confetti";
import { Clock, Share2, XCircle, CheckCircle } from "lucide-react"; // Adicionei ícones para os badges
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

  // Cores do Contador
  const getCounterColor = () => {
    if (won) return "bg-green-100 text-green-700 border-green-200";

    switch (guesses.length) {
      case 0:
        return "bg-slate-100 text-slate-700 border-slate-200";
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 2:
        return "bg-orange-100 text-orange-700 border-orange-200";
      case 3:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Cores da Borda da Imagem
  const getImageBorderColor = () => {
    if (won) return "border-green-500 shadow-green-200";
    if (gameOver && !won) return "border-red-600 shadow-red-200";

    switch (guesses.length) {
      case 0:
        return "border-white shadow-slate-200";
      case 1:
        return "border-yellow-400 shadow-yellow-100";
      case 2:
        return "border-orange-500 shadow-orange-100";
      case 3:
        return "border-red-600 shadow-red-200";
      default:
        return "border-white";
    }
  };

  if (isLoading || !targetPlayer) {
    return (
      <div className="w-full h-dvh flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-dvh flex flex-col bg-white relative">
      {/* 1. HEADER */}
      <div className="flex-none w-full max-w-md mx-auto px-6 py-4 z-30 bg-white">
        <div className="flex justify-between items-center font-bold text-slate-700">
          <span
            className={`text-lg px-4 py-1 rounded-full border transition-colors duration-500 ease-in-out ${getCounterColor()}`}
          >
            {guesses.length}/3
          </span>
          <h2 className="text-[#004D40] text-xl tracking-tight">Challenge</h2>
          <div className="flex items-center gap-1 text-lg bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <Clock size={18} />
            {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* 2. ÁREA DE ROLAGEM */}
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto px-6 pb-32">
        {/* IMAGEM */}
        <div
          className={`
          relative w-full aspect-[4/3] 
          ${gameOver ? "max-h-[30vh]" : "max-h-[40vh]"} 
          rounded-3xl overflow-hidden shadow-xl border-4 
          transition-all duration-500 mb-6 mx-auto
          ${getImageBorderColor()} 
        `}
        >
          <img
            src={targetPlayer.image}
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${getBlurClass()}`}
            alt="Desafio"
          />

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

          {gameOver && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${won ? "bg-green-500/10" : "bg-red-500/10"} transition-colors duration-1000`}
            />
          )}
        </div>

        {/* INPUT / AÇÃO */}
        <div className="relative z-20 mb-6">
          {!gameOver ? (
            <div className="bg-white rounded-2xl border-2 border-[#00D656]/20 p-1 focus-within:border-[#00D656] transition-colors shadow-lg">
              <SearchInput onSelect={handleSelect} />
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 items-center">
              <div className="text-center">
                <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                  The player was:
                </p>
                <h2 className="text-2xl font-black text-[#006B52] tracking-tighter italic truncate max-w-xs mx-auto">
                  {targetPlayer.name}
                </h2>
              </div>

              <button
                onClick={() => setIsShareOpen(true)}
                className="w-full py-3 bg-[#00D656] text-white font-black text-lg rounded-full shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share Result
              </button>
            </div>
          )}
        </div>

        {/* DICAS */}
        <div className="bg-white border border-[#E8F5E9] rounded-2xl p-4 shadow-sm z-10 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#006B52] font-extrabold text-sm uppercase tracking-wide">
              Hints
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-400 font-medium">Position</span>
              <span className="font-bold text-slate-800 truncate ml-2">
                {targetPlayer.hints[0]}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-400 font-medium">Nationality</span>
              <span className="font-bold text-slate-800 truncate ml-2">
                {guesses.length >= 1 ? targetPlayer.hints[1] : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Club</span>
              <span className="font-bold text-slate-800 truncate ml-2">
                {guesses.length >= 2 ? targetPlayer.hints[2] : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* --- NOVO: BADGES DE TENTATIVAS ANTERIORES --- */}
        {guesses.length > 0 && (
          <div className="mt-6 z-0 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3 text-center">
              Players
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {guesses.map((guess, index) => {
                // Verifica se é o palpite vencedor (apenas se ganhou e for o último)
                const isWinner = won && index === guesses.length - 1;

                return (
                  <div
                    key={index}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border animate-in zoom-in duration-300
                      ${
                        isWinner
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-100"
                      }
                    `}
                  >
                    {isWinner ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {guess}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-none w-full h-[100px] bg-slate-100 border-t border-slate-200 z-30 animate-in slide-in-from-bottom duration-500">
        <div className="w-full h-full max-w-[1200px] mx-auto p-2 flex items-center justify-center">
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
