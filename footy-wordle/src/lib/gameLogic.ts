import { PLAYERS, Player } from "@/data/players";

// ==============================================================================
// CONFIGURAÇÃO DO DIA ZERO
// Para o jogo começar como #1 HOJE, coloque a data de HOJE aqui (AAAA-MM-DD).
// Lembre-se: O formato deve ser sempre UTC (T00:00:00Z) para evitar fusos.
// ==============================================================================
const GAME_EPOCH = new Date("2026-02-04T00:00:00Z");

// Calcula quantos dias se passaram desde o início
export function getDayIndex(): number {
  const now = new Date();

  // Zera as horas da data atual para evitar bugs de "meio dia"
  // Isso garante que a comparação seja apenas Dia vs Dia
  const todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const epochUTC = new Date(
    Date.UTC(
      GAME_EPOCH.getUTCFullYear(),
      GAME_EPOCH.getUTCMonth(),
      GAME_EPOCH.getUTCDate(),
    ),
  );

  const oneDay = 1000 * 60 * 60 * 24;
  const diff = todayUTC.getTime() - epochUTC.getTime();

  return Math.floor(diff / oneDay);
}

// Retorna o Jogador do Dia (Loop infinito)
export function getDailyPlayer(): Player {
  const dayIndex = getDayIndex();

  // O Math.abs garante que, se você colocar uma data futura sem querer,
  // o índice não fique negativo e quebre o array.
  const safeIndex = Math.abs(dayIndex);

  const playerIndex = safeIndex % PLAYERS.length;
  return PLAYERS[playerIndex];
}

// Retorna o Número da Edição
export function getGameNumber(): number {
  // Se for o dia do lançamento, dayIndex é 0, então somamos 1 para ser Jogo #1
  return getDayIndex() + 1;
}

// Formata a data atual para exibição (Ex: 04/02/2026)
export function getFormattedDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
