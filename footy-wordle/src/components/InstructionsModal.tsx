"use client";
import { X } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void; // Nova propriedade para iniciar o jogo
}

export default function InstructionsModal({
  isOpen,
  onClose,
  onPlay,
}: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="relative w-full max-w-sm bg-white p-8 rounded-4xl shadow-2xl animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#004D40] mb-6">How to play</h2>

        <ul className="space-y-4 text-slate-600 mb-10">
          <li className="flex gap-2">
            <span>•</span> Guess the mistery football player in 3 guesses
          </li>
          <li className="flex gap-2">
            <span>•</span> Get hints after each wrong guess
          </li>
          {/* <li className="flex gap-2">
            <span>•</span> Score points based on guesses and time taken
          </li> */}
          <li className="flex gap-2">
            <span>•</span> Share your results and compete with your friends!
          </li>
        </ul>

        {/* Botão Play agora chama a função onPlay */}
        <button
          onClick={onPlay}
          className="w-full py-4 bg-[#00D656] text-black text-2xl font-black rounded-full shadow-lg hover:scale-[1.02] transition-transform"
        >
          Play
        </button>
      </div>
    </div>
  );
}
