import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kickly.vercel.app"),
  description:
    "Adivinhe o jogador de futebol do dia! Um desafio diário para quem ama futebol. Será que você consegue acertar com 3 dicas?",
  keywords: [
    "futebol",
    "wordle",
    "game",
    "guessing game",
    "football",
    "brasileirão",
    "champions league",
  ],
  authors: [{ name: "Footly Team" }],

  // Configuração para Redes Sociais (Open Graph)
  openGraph: {
    title: "Footly - Daily Football Challenge",
    description: "Consegue adivinhar quem é o craque de hoje? ⚽",
    url: "https://kickly.vercel.app",
    siteName: "Footly",
    images: [
      {
        url: "/opengraph-image.png", // Ele vai procurar esse arquivo na sua pasta /public
        width: 1200,
        height: 630,
        alt: "Footly Game Preview",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  // Configuração específica para Twitter (X)
  twitter: {
    card: "summary_large_image",
    title: "Footly - Can you guess the player?",
    description: "Daily challenge for football fans! 🎯",
    images: ["/opengraph-image.png"],
  },

  // Ícones do Navegador (Favicon)
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Força o tema claro para evitar bugs de visual em celulares no dark mode */}
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  );
}
