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

/**
 * Janela de energia da pessoa, em horas cheias. `fim` pode passar de 24 quando
 * atravessa a meia-noite: { inicio: 22, fim: 27 } é das 22h às 3h.
 */
export type Pico = { inicio: number; fim: number };

/** O dia da pessoa (acorda → dorme), no mesmo formato: 12h às 3h é { inicio: 12, fim: 27 }. */
export type Dia = { inicio: number; fim: number };

/** Só para quem respondeu "Não sei" nas duas perguntas. */
export const PICO_PADRAO: Pico = { inicio: 15, fim: 22 };
const DIA_PADRAO: Dia = { inicio: 7, fim: 23 };
const HORAS_PICO = 5;

const hora = (h: number) => `${h === 24 ? 24 : h % 24}h`;

export function rotuloPico(p: Pico) {
  return `${hora(p.inicio)}–${hora(p.fim)}`;
}

/** "Não sei" é resposta: as perguntas são obrigatórias, mas ninguém precisa chutar. */
export const NAO_SEI = "nao-sei";
export type PeriodoRende = "manha" | "tarde" | "tarde-noite" | "madrugada";
export type RespostaPeriodo = PeriodoRende | typeof NAO_SEI;
/** Como a pessoa escolheu nos selects: horas 0–23; fim ≤ início é no dia seguinte. */
export type RespostaDia = { comeca: number; termina: number } | typeof NAO_SEI;

export function normalizarDia(r: { comeca: number; termina: number }): Dia {
  return { inicio: r.comeca, fim: r.termina <= r.comeca ? r.termina + 24 : r.termina };
}

/**
 * A faixa de cada período, que é o horário escrito no card. Madrugada vai das
 * 23h às 5h (29 = 5h do dia seguinte). Espelhada em public/agenda.html
 * (FAIXA_PICO); mudou aqui, muda lá.
 */
export const FAIXA: Record<PeriodoRende, { de: number; ate: number }> = {
  manha: { de: 6, ate: 12 },
  tarde: { de: 12, ate: 17 },
  "tarde-noite": { de: 17, ate: 23 },
  madrugada: { de: 23, ate: 29 },
};

/**
 * O pico da pessoa: dentro do período em que ela rende, recortado pelo dia dela.
 * Se o período nem cabe no dia (rende de manhã, mas acorda ao meio-dia), fica
 * na parte do dia mais perto dele. Sem período, algumas horas depois de acordar;
 * sem o dia, o começo da faixa.
 */
export function definirPico(periodo: RespostaPeriodo | null, dia: RespostaDia | null): Pico {
  const p = periodo && periodo !== NAO_SEI ? periodo : null;
  const temDia = !!dia && dia !== NAO_SEI;
  if (!p && !temDia) return PICO_PADRAO;
  // sem o dia, o período sozinho decide: o começo da faixa dele
  if (p && !temDia) return { inicio: FAIXA[p].de, fim: FAIXA[p].de + HORAS_PICO };
  const d = temDia ? normalizarDia(dia) : DIA_PADRAO;
  const horas = Math.min(HORAS_PICO, d.fim - d.inicio);
  const cabe = (inicio: number) => Math.min(d.fim - horas, Math.max(d.inicio, inicio));
  let inicio: number;
  if (!p) {
    inicio = cabe(d.inicio + 3);
  } else {
    // a faixa pode estar "ontem" ou "amanhã" em relação ao dia: fica a que mais encosta nele
    const sobra = (de: number, ate: number) => Math.min(ate, d.fim) - Math.max(de, d.inicio);
    const faixa = [0, 24, -24]
      .map((k) => ({ de: FAIXA[p].de + k, ate: FAIXA[p].ate + k }))
      .reduce((m, f) => (sobra(f.de, f.ate) > sobra(m.de, m.ate) ? f : m));
    inicio = cabe(Math.max(faixa.de, d.inicio));
  }
  // guarda o início entre 0h e 23h
  const k = inicio >= 24 ? 24 : inicio < 0 ? -24 : 0;
  return { inicio: inicio - k, fim: inicio - k + horas };
}
