// scripts/updatePlayers.js
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

// ATUALIZADO: Temporada 2025/2026 (Ano de início = 2025)
const SEASON = 2025;

// IDs dos Gigantes Europeus
const TEAMS = [
  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
  33, // Man Utd
  34, // Newcastle
  40, // Liverpool
  42, // Arsenal
  50, // Man City
  49, // Chelsea

  // 🇪🇸 La Liga
  529, // Barcelona
  530, // Atletico Madrid
  541, // Real Madrid

  // 🇮🇹 Serie A
  492, // Napoli
  489, // AC Milan
  505, // Inter Milan
  496, // Juventus

  // 🇩🇪 Bundesliga
  157, // Bayern Munich
  165, // Dortmund
  173, // RB Leipzig
  192, // Leverkusen
];

// Função de espera para não ser bloqueado pela API (Rate Limit)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTeamPlayers(teamId) {
  let players = [];
  let page = 1;
  let totalPages = 1;

  try {
    // Loop para pegar todas as páginas de jogadores do time
    while (page <= totalPages) {
      console.log(`   ↳ Buscando Time ID ${teamId} (Página ${page})...`);

      const response = await axios.get(`${BASE_URL}/players`, {
        params: { team: teamId, season: SEASON, page: page },
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": API_KEY,
        },
      });

      const data = response.data;

      if (data.errors && Object.keys(data.errors).length > 0) {
        console.error("❌ Erro da API:", data.errors);
        return [];
      }

      totalPages = data.paging.total;

      // Filtragem de Qualidade: Apenas quem jogou pelo menos alguns minutos
      // Isso evita pegar goleiros reservas ou jogadores da base que subiram mas não jogaram
      const activePlayers = data.response.filter((item) => {
        // Segurança: verifica se statistics existe
        if (!item.statistics || item.statistics.length === 0) return false;

        const stats = item.statistics[0];
        // Mantém se for goleiro OU se tiver jogado mais que 0 minutos na liga
        return stats.games.minutes > 0 || item.player.position === "Goalkeeper";
      });

      const formatted = activePlayers.map((item) => ({
        id: item.player.id,
        name: item.player.name,
        image: item.player.photo,
        hints: [
          mapPosition(item.statistics[0].games.position), // Posição
          "Active", // Status (se está no elenco da temporada atual, é Active)
          item.player.nationality, // Nacionalidade
        ],
      }));

      players = [...players, ...formatted];
      page++;
      await delay(1100); // Espera 1.1s entre páginas (Regra da conta Free: máx 1 req/segundo)
    }
  } catch (error) {
    console.error(`❌ Falha ao buscar time ${teamId}:`, error.message);
  }

  return players;
}

// Traduz posições da API para o padrão do jogo
function mapPosition(apiPos) {
  const map = {
    Goalkeeper: "Goalkeeper",
    Defender: "Defender",
    Midfielder: "Midfielder",
    Attacker: "Forward",
  };
  return map[apiPos] || apiPos;
}

async function run() {
  console.log(
    `🚀 Iniciando atualização da Base de Dados (Temporada ${SEASON}/${SEASON + 1})...`,
  );
  let allPlayers = [];

  for (const teamId of TEAMS) {
    console.log(`⚽ Processando time ${teamId}...`);
    const teamPlayers = await fetchTeamPlayers(teamId);
    allPlayers = [...allPlayers, ...teamPlayers];
  }

  // Embaralhar para o jogo não ficar repetitivo por time (ex: não vir 10 do Real Madrid seguidos)
  allPlayers.sort(() => Math.random() - 0.5);

  const fileContent = `
// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE POR: scripts/updatePlayers.js
// DATA: ${new Date().toLocaleString()}
// TOTAL: ${allPlayers.length} JOGADORES (Temporada ${SEASON}/${SEASON + 1})

export interface Player {
  id: number;
  name: string;
  hints: string[];
  image: string;
}

export const PLAYERS: Player[] = ${JSON.stringify(allPlayers, null, 2)};
`;

  fs.writeFileSync("./src/data/players.ts", fileContent);
  console.log(
    `\n✅ Sucesso! ${allPlayers.length} jogadores salvos em src/data/players.ts`,
  );
}

run();
