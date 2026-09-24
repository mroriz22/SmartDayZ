import { PICO, quadrante, type QuadId } from "./matriz";

/**
 * Persistência do onboarding (/quiz).
 *
 * - As respostas ficam em `smartdayz:onboarding` (localStorage). O /login lê
 *   nome e e-mail dali pra não pedir de novo — nada de dado pessoal na URL.
 * - O dia montado vira a agenda de verdade: se o aparelho ainda não tem
 *   agenda, gravamos o store `agenda.v3` no formato que public/agenda.html lê.
 *   Com `updatedAt: 0`, qualquer agenda que já exista na nuvem vence o merge
 *   (o app guarda backup do local antes), então o onboarding nunca apaga dado.
 */

export const CHAVE_ONBOARDING = "smartdayz:onboarding";
const CHAVE_AGENDA = "agenda.v3";
const CHAVES_ANTIGAS = ["agenda.v2", "agenda.v1"];

export type Janela = "manha" | "tarde" | "tarde-noite" | "madrugada";
export type Contexto = "pessoal" | "trabalho" | "meta";

export type TarefaOnboarding = {
  titulo: string;
  urgente: boolean;
  importante: boolean;
};

export type RespostasOnboarding = {
  nome: string;
  email: string;
  janela: Janela | null;
  contexto: Contexto | null;
  tarefas: TarefaOnboarding[];
};

/** Nome da agenda no app (CTX_PRESETS em agenda.html). */
export const NOME_CONTEXTO: Record<Contexto, string> = {
  pessoal: "Pessoal",
  trabalho: "Trabalho",
  meta: "Meta Principal",
};

export type TarefaNoDia = TarefaOnboarding & {
  quad: QuadId;
  /** "HH:MM" dentro do pico, ou "" quando fica fora dele. */
  hora: string;
};

/** Monta o dia: o importante entra no pico em blocos de 2h; o resto fica sem hora, fora dele. */
export function montarDia(tarefas: TarefaOnboarding[]): TarefaNoDia[] {
  const peso: Record<QuadId, number> = { q1: 0, q2: 1, q3: 2, q4: 3 };
  let proxima = PICO.inicio;
  return tarefas
    .map((t) => ({ ...t, quad: quadrante(t.urgente, t.importante) }))
    .sort((a, b) => peso[a.quad] - peso[b.quad])
    .map((t) => {
      if (!t.importante || proxima >= PICO.fim) return { ...t, hora: "" };
      const hora = `${String(proxima).padStart(2, "0")}:00`;
      proxima += 2;
      return { ...t, hora };
    });
}

export function salvarRespostas(r: RespostasOnboarding & { concluidoEm?: string }) {
  try {
    localStorage.setItem(CHAVE_ONBOARDING, JSON.stringify(r));
  } catch {
    /* modo anônimo ou armazenamento cheio: o fluxo segue sem guardar */
  }
}

export function lerRespostas(): Partial<RespostasOnboarding> | null {
  try {
    const bruto = localStorage.getItem(CHAVE_ONBOARDING);
    return bruto ? (JSON.parse(bruto) as Partial<RespostasOnboarding>) : null;
  } catch {
    return null;
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function agendaTemConteudo(): boolean {
  try {
    if (CHAVES_ANTIGAS.some((k) => localStorage.getItem(k))) return true;
    const bruto = localStorage.getItem(CHAVE_AGENDA);
    if (!bruto) return false;
    const s = JSON.parse(bruto) as {
      data?: Record<string, { events?: unknown[]; tasks?: unknown[] }>;
      daysOff?: unknown[];
    };
    if (Array.isArray(s.daysOff) && s.daysOff.length) return true;
    return Object.values(s.data ?? {}).some(
      (d) => (d?.events?.length ?? 0) + (d?.tasks?.length ?? 0) > 0,
    );
  } catch {
    // store ilegível: melhor não mexer
    return true;
  }
}

/**
 * Grava o primeiro dia na agenda do aparelho. Devolve false (e não toca em
 * nada) quando já existe agenda com conteúdo aqui.
 */
export function semearAgenda(contexto: Contexto | null, tarefas: TarefaOnboarding[]): boolean {
  if (agendaTemConteudo()) return false;
  const id = uid();
  const hoje = hojeISO();
  const tasks = montarDia(tarefas).map((t) => ({
    id: uid(),
    title: t.titulo,
    start: hoje,
    due: null,
    time: t.hora,
    done: false,
    doneAt: null,
    quad: t.quad,
    sos: false,
    imp: t.importante,
    urg: t.urgente,
    ai: false,
  }));
  const store = {
    contexts: [{ id, name: NOME_CONTEXTO[contexto ?? "pessoal"] }],
    active: id,
    data: { [id]: { events: [], tasks } },
    daysOff: [],
    updatedAt: 0,
  };
  try {
    localStorage.setItem(CHAVE_AGENDA, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}
