"use client";

import { X } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-[#006B52] tracking-tight">
            About Footly
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Conteúdo Rolável (Rico para AdSense) */}
        <div className="p-6 overflow-y-auto text-slate-600 space-y-6 leading-relaxed text-sm md:text-base">
          <section>
            <h3 className="text-slate-900 font-bold text-lg mb-2">
              The Ultimate Daily Football Challenge
            </h3>
            <p>
              Footly is an interactive daily trivia game designed for football
              fans worldwide. Our mission is to test your visual memory and
              knowledge about the biggest stars of the sport. Every day, a new
              player is hidden behind a blur, challenging you to guess who they
              are with limited hints.
            </p>
          </section>

          <section>
            <h3 className="text-slate-900 font-bold text-lg mb-2">
              How it Works
            </h3>
            <p>
              The game mechanics are simple yet challenging. You start with a
              blurred image of a professional football player. As you make
              guesses or ask for hints, you unlock specific details:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Position:</strong> Understand the player's role on the
                field.
              </li>
              <li>
                <strong>Nationality:</strong> Narrow down the options by
                country.
              </li>
              <li>
                <strong>Current Club:</strong> The final clue to seal your
                victory.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-slate-900 font-bold text-lg mb-2">
              Our Database
            </h3>
            <p>
              Footly is powered by a comprehensive database updated for the{" "}
              <strong>2024/2025 season</strong>. We cover active players from
              the world's most competitive leagues, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>🇬🇧 Premier League (England)</li>
              <li>🇪🇸 La Liga (Spain)</li>
              <li>🇧🇷 Brasileirão Série A (Brazil)</li>
              <li>🇮🇹 Serie A (Italy)</li>
              <li>🇩🇪 Bundesliga (Germany)</li>
              <li>🇸🇦 Saudi Pro League (Saudi Arabia)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-slate-900 font-bold text-lg mb-2">
              Educational & Fun
            </h3>
            <p>
              More than just a game, Footly is a tool to learn about the
              transfer market, player stats, and global football geography.
              Whether you support Real Madrid, Flamengo, Manchester City, or
              Al-Hilal, Footly puts your knowledge to the test.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            <p>
              © 2026 Footly Game. Not affiliated with FIFA or any football club.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
