// src/data/players.ts

export interface Player {
  id: number;
  name: string;
  hints: string[]; // [Position, Status, Nationality]
  image: string; // URL da imagem
}

export const PLAYERS: Player[] = [
  {
    id: 1,
    name: "Neymar Jr",
    hints: ["Forward", "Active", "Brazil"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bra-Cos_%281%29.jpg/888px-Bra-Cos_%281%29.jpg?20180622191927",
  },
  {
    id: 2,
    name: "Lionel Messi",
    hints: ["Forward", "Active", "Argentina"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  },
  {
    id: 3,
    name: "Cristiano Ronaldo",
    hints: ["Forward", "Active", "Portugal"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
  },
  // Adicione quantos quiser...
];
