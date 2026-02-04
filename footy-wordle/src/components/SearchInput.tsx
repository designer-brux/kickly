"use client";
import { useState } from "react";
// Importamos a interface Player para resolver os erros de 'any'
import { PLAYERS, Player } from "@/data/players";

export default function SearchInput({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  // Definimos que o estado de sugestões é um array de Player
  const [suggestions, setSuggestions] = useState<Player[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      // O TypeScript agora reconhece 'p' como do tipo Player
      const filtered = PLAYERS.filter((p: Player) =>
        p.name.toLowerCase().includes(value.toLowerCase()),
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Quem é o jogador?"
        // Ajustei também o input para combinar com o tema claro (texto escuro e borda mais suave)
        className="w-full bg-transparent border-b-2 border-slate-200 py-3 px-2 outline-none focus:border-[#00D656] transition-colors text-lg tracking-wide uppercase placeholder:text-slate-400 text-slate-800 font-bold"
      />

      {suggestions.length > 0 && (
        // Alteração Principal: Dropdown Branco, Sombra e Bordas Arredondadas
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto scrollbar-hide">
          {suggestions.map((player: Player) => (
            <li
              key={player.id}
              onClick={() => {
                onSelect(player.name);
                setQuery("");
                setSuggestions([]);
              }}
              // Alteração nos Itens: Texto escuro, hover cinza claro e espaçamento melhorado
              className="px-5 py-3.5 cursor-pointer hover:bg-slate-50 text-slate-700 font-medium transition-colors border-b border-slate-100 last:border-0 flex items-center justify-between group"
            >
              <span>{player.name}</span>
              {/* Seta verde sutil que aparece ao passar o mouse */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00D656]">
                →
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
