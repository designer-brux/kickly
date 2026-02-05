import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kickly.vercel.app"),
  title: "Footly - Guess the Football Player",
  description:
    "Adivinhe o jogador de futebol do dia! Um desafio diário para quem ama futebol.",
  // ... resto das suas configs de metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Mantemos no HTML por garantia
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
      </head>

      {/* ADICIONE AQUI: suppressHydrationWarning na body resolve o erro do ColorZilla */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
