// src/components/AdBanner.tsx
export default function AdBanner() {
  return (
    <div className="w-full h-full bg-pink-200 relative overflow-hidden rounded-2xl border-2 border-pink-300">
      {/* Imagem de fundo */}
      <img
        src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Banner Publicidade"
      />

      {/* Texto Centralizado */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
        <span className="text-[#1D1B20] font-black text-xl tracking-[0.2em] uppercase bg-white/60 px-2 py-1 rounded">
          ADSENSE
        </span>
      </div>
    </div>
  );
}
