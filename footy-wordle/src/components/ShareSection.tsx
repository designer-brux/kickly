"use client";

import { useRef, useState } from "react";
import { X, Download, Copy, MessageCircle } from "lucide-react";
import html2canvas from "html2canvas";
import { getGameNumber } from "@/lib/gameLogic";

interface ShareSectionProps {
  isOpen: boolean;
  onClose: () => void;
  won: boolean;
  guessesCount: number;
  time: string; // Adicionei o Tempo aqui
}

export default function ShareSection({
  isOpen,
  onClose,
  won,
  guessesCount,
  time,
}: ShareSectionProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const gameNumber = getGameNumber();

  // Imagens de Fundo Genéricas (Sem Spoiler)
  const WIN_BG =
    "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=1000&auto=format&fit=crop"; // Estádio Aceso
  const LOSE_BG =
    "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop"; // Gramado Dramático/Escuro

  if (!isOpen) return null;

  const getShareText = () => {
    const icon = won ? "🏆" : "❌";
    // Texto misterioso para WhatsApp
    return `Footly #${gameNumber} ${icon}\n⏱️ Time: ${time}\n🎯 Attempts: ${won ? guessesCount : "X"}/3\n\nCan you beat me? Play now: kickly.vercel.app`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getShareText());
    alert("Text copied!");
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText())}`;
    window.open(url, "_blank");
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);

    try {
      // Pequeno hack: Forçamos o html2canvas a usar um proxy para evitar erro de CORS
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        proxy: "https://corsproxy.io/?", // Isso resolve o problema de permissão da imagem externa
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `footly-result-${gameNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error", err);
      alert("Erro ao gerar imagem. Tente tirar um print da tela!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Componente interno para o visual do Poster (Reusado no preview e no print)
  const PosterContent = () => (
    <div className="w-full h-full relative flex flex-col items-center justify-center text-center p-6 isolate">
      {/* Imagem de Fundo Escurecida */}
      <img
        src={won ? WIN_BG : LOSE_BG}
        className="absolute inset-0 w-full h-full object-cover -z-20"
        crossOrigin="anonymous"
        alt="Background"
      />
      <div
        className={`absolute inset-0 -z-10 ${won ? "bg-green-900/60" : "bg-red-900/60"} backdrop-blur-[1px]`}
      />

      {/* Conteúdo */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-white/80 font-bold tracking-[0.2em] text-xs uppercase">
          Footly #{gameNumber}
        </span>
        <h2 className="text-white text-4xl font-black italic tracking-tighter drop-shadow-lg">
          {won ? "VICTORY!" : "GAME OVER"}
        </h2>
      </div>

      {/* Caixa de Estatísticas */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-[200px] mb-6 shadow-2xl">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase mb-1">
              Time
            </p>
            <p className="text-white text-2xl font-black">{time}</p>
          </div>
          <div className="w-full h-[1px] bg-white/10"></div>
          <div>
            <p className="text-white/60 text-xs font-bold uppercase mb-1">
              Guesses
            </p>
            <p className="text-white text-2xl font-black">
              {won ? `${guessesCount}/3` : "Failed"}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-auto">
        <p className="text-white font-bold text-lg drop-shadow-md">
          Sua vez de tentar!
        </p>
        <p className="text-[#00D656] font-medium text-sm">kickly.vercel.app</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-800" />
        </button>

        <div className="pt-8 pb-6 px-6 text-center">
          <h2 className="text-2xl font-black text-[#1D1B20] mb-6 tracking-tight">
            Share Result
          </h2>

          {/* PREVIEW VISUAL */}
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg mb-6 bg-slate-900 group border-4 border-white">
            <PosterContent />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-4 justify-center">
            <ActionBtn
              icon={<Copy size={20} />}
              label="Text"
              onClick={handleCopyText}
            />
            <ActionBtn
              icon={<MessageCircle size={20} />}
              label="WhatsApp"
              onClick={handleWhatsApp}
            />
            <ActionBtn
              icon={
                isGenerating ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Download size={20} />
                )
              }
              label="Save Img"
              onClick={handleDownloadImage}
              primary
            />
          </div>
        </div>
      </div>

      {/* MOLDE ESCONDIDO (ALTA QUALIDADE) */}
      <div
        ref={posterRef}
        className="fixed -top-[9999px] left-0 w-[600px] h-[800px] text-[20px]" // Aumentei a fonte base
      >
        {/* Reutilizamos o mesmo layout, mas o container maior fará tudo escalar */}
        <PosterContent />
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, primary = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group ${primary ? "text-[#00D656]" : "text-slate-500"}`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm ${primary ? "bg-[#00D656] text-white shadow-[#00D656]/30" : "bg-slate-100 hover:bg-slate-200"}`}
      >
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}
