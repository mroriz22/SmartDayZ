/**
 * A matriz de Eisenhower como o app (/app, public/agenda.html) mostra hoje.
 * Os nomes são os do design de 23/09/2026 e são os mesmos do const QUAD de lá;
 * o pico é o de cada pessoa (definirPico; lá, store.peak). Os ids (q1..q4) é que ficam gravados na
 * agenda — os nomes são só exibição, então trocar nome não quebra agenda salva.
 */

export type QuadId = "q1" | "q2" | "q3" | "q4";

export const QUADRANTES: Record<QuadId, { nome: string; regra: string }> = {
  q1: { nome: "Fazer agora", regra: "Urgente + importante" },
  q2: { nome: "Planejar", regra: "Importante, sem urgência" },
  q3: { nome: "Delegar ou negociar", regra: "Urgente, não importante" },
  q4: { nome: "Reavaliar", regra: "Nem urgente, nem importante" },
};

export const ORDEM_QUADRANTES: QuadId[] = ["q1", "q2", "q3", "q4"];

export function quadrante(urgente: boolean, importante: boolean): QuadId {
  if (urgente && importante) return "q1";
  if (importante) return "q2";
  if (urgente) return "q3";
  return "q4";
}

/** Janela de energia da pessoa, em horas cheias (fim exclusivo; vai até 24). */
export type Pico = { inicio: number; fim: number };

/** Só para quem pulou as perguntas do perfil: o pico que a agenda usava antes. */
export const PICO_PADRAO: Pico = { inicio: 15, fim: 22 };

export function rotuloPico(p: Pico) {
  return `${p.inicio}h–${p.fim}h`;
}

export type PeriodoRende = "manha" | "tarde" | "tarde-noite" | "madrugada";
export type HoraAcorda = "antes-6" | "6-8" | "8-10" | "depois-10";

const HORA_ACORDA: Record<HoraAcorda, number> = {
  "antes-6": 5,
  "6-8": 7,
  "8-10": 9,
  "depois-10": 11,
};

/**
 * Onde cai o pico de cada período: começa algumas horas depois de acordar,
 * mas sem sair da faixa que a pessoa disse que rende.
 */
const FAIXA: Record<PeriodoRende, { depoisDeAcordar: number; min: number; max: number; horas: number }> = {
  manha: { depoisDeAcordar: 1, min: 6, max: 8, horas: 5 },
  tarde: { depoisDeAcordar: 4, min: 10, max: 12, horas: 5 },
  "tarde-noite": { depoisDeAcordar: 8, min: 14, max: 17, horas: 6 },
  madrugada: { depoisDeAcordar: 11, min: 18, max: 19, horas: 5 },
};

/** Sem a resposta de quando rende, o horário de acordar sugere o período. */
const PERIODO_POR_ACORDA: Record<HoraAcorda, PeriodoRende> = {
  "antes-6": "manha",
  "6-8": "tarde",
  "8-10": "tarde-noite",
  "depois-10": "madrugada",
};

/** O pico da pessoa, a partir do perfil que ela respondeu no onboarding. */
export function definirPico(periodo: PeriodoRende | null, acorda: HoraAcorda | null): Pico {
  if (!periodo && !acorda) return PICO_PADRAO;
  const faixa = FAIXA[periodo ?? PERIODO_POR_ACORDA[acorda!]];
  const acordaAs = acorda ? HORA_ACORDA[acorda] : 7;
  const inicio = Math.min(faixa.max, Math.max(faixa.min, acordaAs + faixa.depoisDeAcordar));
  return { inicio, fim: Math.min(24, inicio + faixa.horas) };
}
