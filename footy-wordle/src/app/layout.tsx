import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Footly - Daily Football Game",
  description: "Guess the mystery player in 3 guesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Adicione suppressHydrationWarning aqui
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
