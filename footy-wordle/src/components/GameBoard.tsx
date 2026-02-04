"use client";

import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import { useDailyGame } from "@/hooks/useDailyGame"; // Importar o Hook
import confetti from "canvas-confetti";
import { Clock } from "lucide-react";

export default function GameBoard({ onQuit }: { onQuit?: () => void }) {
  // Substituímos os estados manuais pelo Hook inteligente
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

  // Cronômetro (simples, reinicia no reload por enquanto para não complicar)
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

    // Adiciona o palpite
    const newGuesses = [...guesses, selectedName];
    setGuesses(newGuesses);

    // Verifica vitória ou derrota
    if (selectedName.toLowerCase() === targetPlayer.name.toLowerCase()) {
      setWon(true);
      setGameOver(true);
      confetti();
    } else if (newGuesses.length >= 3) {
      setGameOver(true);
    }
    // O useEffect do hook vai salvar isso no localStorage automaticamente
  };

  const getBlurClass = () => {
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
    <div className="w-full max-w-md flex flex-col gap-5 animate-in fade-in duration-500 pb-10 mx-auto px-6 pt-10">
      {/* Cabeçalho do Desafio */}
      <div className="flex justify-between items-center font-bold text-slate-700">
        <span className="text-lg">{guesses.length}/3</span>
        <h2 className="text-[#004D40] text-2xl tracking-tight">Challange</h2>
        <div className="flex items-center gap-1 text-lg">
          <Clock size={20} />
          {formatTime(timer)}
        </div>
      </div>

      {/* Container da Imagem */}
      <div className="relative w-full aspect-4/3 rounded-4xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
        <img
          src={targetPlayer.image}
          className={`w-full h-full object-cover transition-all duration-700 ${getBlurClass()}`}
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
            className={`absolute inset-0 flex items-center justify-center ${won ? "bg-green-500/20" : "bg-red-500/20"} backdrop-blur-[2px] transition-colors`}
          >
            <div
              className={`px-6 py-2 rounded-full font-bold uppercase text-white shadow-lg ${won ? "bg-green-500" : "bg-red-500"}`}
            >
              {won ? "Correct!" : "Game Over!"}
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Dicas (Estado persiste no reload!) */}
      <div className="bg-white border border-[#E8F5E9] rounded-3xl p-5 shadow-sm">
        <h3 className="text-[#006B52] font-extrabold text-lg mb-4">Hints</h3>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-slate-400 font-medium">Position</span>
            <span className="font-bold text-slate-800">
              {targetPlayer.hints[0]}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="font-bold text-slate-800">
              {guesses.length >= 1 ? targetPlayer.hints[1] : "-"}
            </span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400 font-medium">Nationality</span>
            <span className="font-bold text-slate-800">
              {guesses.length >= 2 ? targetPlayer.hints[2] : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Inputs / Resultados */}
      <div className="space-y-4">
        {!gameOver ? (
          <>
            <div className="bg-white rounded-2xl border-2 border-[#00D656]/20 p-1 focus-within:border-[#00D656] transition-colors shadow-sm">
              <SearchInput onSelect={handleSelect} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4">
            <div className="text-center mb-2">
              <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">
                The player was:
              </p>
              <h2 className="text-3xl font-black text-[#006B52] tracking-tighter italic">
                {targetPlayer.name}
              </h2>
            </div>

            <button
              onClick={onQuit}
              className="w-full py-4 bg-white border-2 border-[#006B52] text-[#006B52] font-bold rounded-full text-lg"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
