"use client";

import { useState } from "react";
import InstructionsModal from "@/components/InstructionsModal";
import AdBanner from "@/components/AdBanner";
import GameBoard from "@/components/GameBoard";
import DailyHeader from "@/components/DailyHeader";
import AboutModal from "@/components/AboutModal"; // Ajustado para @/components para manter o padrão

export default function Home() {
  const [gameState, setGameState] = useState<"home" | "playing">("home");
  const [showInstructions, setShowInstructions] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  if (gameState === "playing") {
    return (
      <main className="h-dvh w-full bg-white overflow-hidden">
        <GameBoard onQuit={() => setGameState("home")} />
      </main>
    );
  }

  return (
    <main className="relative h-dvh w-full bg-white overflow-hidden flex flex-col items-center">
      {/* 1. TOPO: Data e Número Dinâmicos */}
      <div className="absolute top-8 left-0 w-full flex justify-center z-10 pointer-events-none">
        <DailyHeader />
      </div>

      {/* 2. CONTEÚDO CENTRAL */}
      <div className="w-full h-full flex flex-col items-center justify-center pb-40">
        <div className="w-full max-w-150 px-10 flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-[#008F66] text-6xl md:text-7xl font-black tracking-tighter mb-2">
              Footly
            </h1>
            <p className="text-[#1D1B20] text-2xl md:text-3xl font-bold leading-tight">
              Daily Football Player Guessing Game
            </p>
          </div>

          <div className="w-full flex flex-col">
            <button
              onClick={() => setGameState("playing")}
              className="w-full h-14 mb-4 bg-[#00D44E] text-[#1D1B20] text-xl font-bold rounded-[40px] shadow-sm active:scale-95 transition-transform"
            >
              Play
            </button>

            <button
              onClick={() => setShowInstructions(true)}
              className="w-full h-14 bg-[#FFFBFF] text-[#008C6E] text-lg font-bold rounded-[40px] border border-[#008C6E]/20 shadow-sm active:scale-95 transition-transform"
            >
              How to play?
            </button>

            {/* BOTÃO ABOUT: Inserido logo abaixo dos botões principais */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="mt-4 text-[#008C6E] font-bold text-sm hover:opacity-80 transition-opacity"
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* 3. BANNER ABSOLUTO (Mantendo seu estilo original) */}
      <div className="absolute bottom-6 left-6 right-6 h-30 z-20">
        <AdBanner />
      </div>

      {/* MODAIS */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        onPlay={() => {
          setShowInstructions(false); // Fecha o modal
          setGameState("playing"); // Inicia o jogo
        }}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  );
}
