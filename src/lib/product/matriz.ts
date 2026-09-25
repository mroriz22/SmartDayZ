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
/** "Não sei" é resposta: a pergunta é obrigatória, mas ninguém precisa chutar. */
export const NAO_SEI = "nao-sei";
export type RespostaPeriodo = PeriodoRende | typeof NAO_SEI;
export type RespostaAcorda = HoraAcorda | typeof NAO_SEI;

const HORA_ACORDA: Record<HoraAcorda, number> = {
  "antes-6": 5,
  "6-8": 7,
  "8-10": 9,
  "depois-10": 11,
};

/**
 * A faixa de cada período, que é o horário escrito no card do onboarding e do
 * perfil: o pico cai sempre dentro dela, começando algumas horas depois de
 * acordar. Espelhada em public/agenda.html (FAIXA_PICO); mudou aqui, muda lá.
 */
export const FAIXA: Record<PeriodoRende, { de: number; ate: number; horas: number; depoisDeAcordar: number }> = {
  manha: { de: 6, ate: 12, horas: 5, depoisDeAcordar: 1 },
  tarde: { de: 11, ate: 17, horas: 5, depoisDeAcordar: 4 },
  "tarde-noite": { de: 15, ate: 22, horas: 6, depoisDeAcordar: 8 },
  madrugada: { de: 19, ate: 24, horas: 5, depoisDeAcordar: 11 },
};

/** Sem saber quando rende, o horário de acordar sugere o período. */
const PERIODO_POR_ACORDA: Record<HoraAcorda, PeriodoRende> = {
  "antes-6": "manha",
  "6-8": "tarde",
  "8-10": "tarde-noite",
  "depois-10": "madrugada",
};

/** O pico da pessoa, a partir do perfil que ela respondeu. */
export function definirPico(periodo: RespostaPeriodo | null, acorda: RespostaAcorda | null): Pico {
  const sabePeriodo = periodo && periodo !== NAO_SEI ? periodo : null;
  const sabeAcorda = acorda && acorda !== NAO_SEI ? acorda : null;
  if (!sabePeriodo && !sabeAcorda) return PICO_PADRAO;
  const faixa = FAIXA[sabePeriodo ?? PERIODO_POR_ACORDA[sabeAcorda!]];
  const acordaAs = sabeAcorda ? HORA_ACORDA[sabeAcorda] : 7;
  const inicio = Math.min(faixa.ate - faixa.horas, Math.max(faixa.de, acordaAs + faixa.depoisDeAcordar));
  return { inicio, fim: inicio + faixa.horas };
}
