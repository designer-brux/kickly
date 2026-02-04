// scripts/updatePlayers.js
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

// Use 2024 (Temporada atual cheia na Europa e Brasil) ou 2025 se já virou.
const SEASON = 2024;

// CONFIGURAÇÃO DE ELITE
// Pegamos apenas 2 páginas para garantir, mas a filtragem por minutos será o principal
const MAX_PAGES_PER_TEAM = 2;
const DELAY_MS = 7000; // 7s de pausa (Segurança máxima para plano Free)

// Lista Definitiva de IDs (API-Football)
const TEAMS = [
  // --- 🇧🇷 BRASILEIRÃO (G12) ---
  126, // São Paulo
  121, // Palmeiras
  127, // Flamengo
  133, // Vasco da Gama
  120, // Botafogo
  124, // Fluminense
  125, // Santos (Mesmo na B, é gigante)
  131, // Corinthians
  130, // Grêmio
  119, // Internacional
  128, // Cruzeiro
  1062, // Atlético Mineiro

  // --- 🇸🇦 SAUDI PRO LEAGUE (Big 4) ---
  293, // Al-Hilal
  294, // Al-Nassr
  297, // Al-Ahli
  296, // Al-Ittihad

  // --- 🇪🇺 GIGANTES EUROPEUS ---
  // Premier League
  33,
  40,
  42,
  50,
  49, // Man Utd, Liverpool, Arsenal, City, Chelsea
  // La Liga
  529,
  530,
  541, // Barcelona, Atleti, Real Madrid
  // Serie A
  492,
  489,
  505,
  496, // Napoli, Milan, Inter, Juve
  // Bundesliga
  157,
  165, // Bayern, Dortmund
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTeamPlayers(teamId) {
  let allRawPlayers = [];
  let page = 1;

  try {
    // Busca até 2 páginas (geralmente cobre todo o elenco principal)
    while (page <= MAX_PAGES_PER_TEAM) {
      console.log(`   ↳ Time ID ${teamId} (Página ${page})...`);

      const response = await axios.get(`${BASE_URL}/players`, {
        params: { team: teamId, season: SEASON, page: page },
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": API_KEY,
        },
      });

      const data = response.data;

      if (data.errors && Object.keys(data.errors).length > 0) {
        console.warn(`      ⚠️ Aviso da API:`, JSON.stringify(data.errors));
        break;
      }

      const list = data.response || [];
      allRawPlayers = [...allRawPlayers, ...list];

      // Se acabaram as páginas, para
      if (page >= data.paging.total) break;

      page++;
      // Pequena pausa entre páginas do mesmo time
      if (page <= MAX_PAGES_PER_TEAM) await delay(2000);
    }

    // --- FILTRAGEM DE "TITULARES" (A Mágica) ---
    // 1. Apenas quem tem foto
    // 2. Ordenar por minutos jogados (do maior para o menor)
    // 3. Pegar apenas os top 18 (Titulares + Reservas imediatos)

    const elitePlayers = allRawPlayers
      .filter(
        (item) => item.player.photo && item.statistics[0].games.minutes > 0,
      )
      .sort(
        (a, b) => b.statistics[0].games.minutes - a.statistics[0].games.minutes,
      ) // Mais minutos primeiro
      .slice(0, 18) // PEGA SÓ OS 18 QUE MAIS JOGAM
      .map((item) => ({
        id: item.player.id,
        name: item.player.name,
        image: item.player.photo,
        hints: [
          mapPosition(item.statistics[0].games.position),
          "Active", // Status
          item.player.nationality,
        ],
      }));

    return elitePlayers;
  } catch (error) {
    console.error(`❌ Erro no time ${teamId}:`, error.message);
    return [];
  }
}

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
  console.log(`🚀 Iniciando atualização BRASIL + ARÁBIA + EUROPA...`);
  console.log(
    `ℹ️  Filtrando apenas os TOP 18 jogadores (mais minutos) de cada time.`,
  );

  let allPlayers = [];

  for (const teamId of TEAMS) {
    console.log(`\n⚽ Processando time ${teamId}...`);
    const teamPlayers = await fetchTeamPlayers(teamId);
    allPlayers = [...allPlayers, ...teamPlayers];

    console.log(`   ✅ ${teamPlayers.length} craques adicionados.`);
    console.log(`   ⏳ Aguardando ${DELAY_MS / 1000}s...`);
    await delay(DELAY_MS);
  }

  // Remove duplicados por ID
  const uniquePlayers = Array.from(
    new Map(allPlayers.map((item) => [item.id, item])).values(),
  );
  uniquePlayers.sort(() => Math.random() - 0.5);

  const fileContent = `
// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE
// DATA: ${new Date().toLocaleString()}
// TOTAL: ${uniquePlayers.length} JOGADORES (Titulares e Estrelas)

export interface Player {
  id: number;
  name: string;
  hints: string[];
  image: string;
}

export const PLAYERS: Player[] = ${JSON.stringify(uniquePlayers, null, 2)};
`;

  fs.writeFileSync("./src/data/players.ts", fileContent);
  console.log(
    `\n✅ SUCESSO! Base atualizada com ${uniquePlayers.length} jogadores.`,
  );
}

run();
