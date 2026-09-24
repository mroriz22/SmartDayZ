/**
 * A matriz de Eisenhower como o app (/app, public/agenda.html) mostra hoje.
 * Os nomes e o pico vêm de lá (const QUAD e PEAK_START/PEAK_END): a landing e
 * o onboarding não prometem rótulo nem horário que a agenda não usa.
 */

export type QuadId = "q1" | "q2" | "q3" | "q4";

export const QUADRANTES: Record<QuadId, { nome: string; regra: string }> = {
  q1: { nome: "Fazer agora", regra: "Urgente + importante" },
  q2: { nome: "Foco / Agendar", regra: "Importante, sem urgência" },
  q3: { nome: "Delegar", regra: "Urgente, não importante" },
  q4: { nome: "Eliminar", regra: "Nem urgente, nem importante" },
};

export const ORDEM_QUADRANTES: QuadId[] = ["q1", "q2", "q3", "q4"];

export function quadrante(urgente: boolean, importante: boolean): QuadId {
  if (urgente && importante) return "q1";
  if (importante) return "q2";
  if (urgente) return "q3";
  return "q4";
}

/** Pico de energia fixo da agenda (15h–22h), igual para todo mundo por enquanto. */
export const PICO = { inicio: 15, fim: 22, rotulo: "15h–22h" } as const;
