"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Answer = "a" | "b" | "c" | "d";

type Step =
  | { kind: "intro" }
  | { kind: "q"; id: 1 | 2 | 3 | 4 }
  | { kind: "result" };

const QUESTIONS: Record<
  1 | 2 | 3 | 4,
  { title: string; support?: string; options: { id: Answer; label: string }[] }
> = {
  1: {
    title: "No fim do dia, o que sobra mais?",
    support: "Não é falta de foco. Em geral é horário errado.",
    options: [
      { id: "a", label: "A tarefa difícil sem fazer" },
      { id: "b", label: "Culpa por ter corrido" },
      { id: "c", label: "Lista longa e zero clareza" },
      { id: "d", label: "O dia sumiu" },
    ],
  },
  2: {
    title: "Como o dia está montado hoje?",
    options: [
      { id: "a", label: "Google/Apple + zap + cabeça" },
      { id: "b", label: "Lista de tarefas" },
      { id: "c", label: "Tudo na cabeça" },
      { id: "d", label: "Misturo sem energia do dia" },
    ],
  },
  3: {
    title: "Em que parte do dia você rende mais no trabalho que muda o jogo?",
    support: "No teste você começa protegendo essa janela.",
    options: [
      { id: "a", label: "Manhã" },
      { id: "b", label: "Meio do dia" },
      { id: "c", label: "Tarde-noite" },
      { id: "d", label: "Muda" },
    ],
  },
  4: {
    title: "O que quer que o SmartDayZ resolva primeiro?",
    options: [
      { id: "a", label: "Proteger o horário que rende" },
      { id: "b", label: "Decidir o que fazer agora" },
      { id: "c", label: "Destravar a tarefa empurrada" },
      { id: "d", label: "Separar pessoal e negócio" },
    ],
  },
};

function resultTitle(answers: Partial<Record<1 | 2 | 3 | 4, Answer>>): string {
  const q1 = answers[1];
  const q4 = answers[4];
  if (q1 === "a" || q4 === "a") {
    return "Sua agenda está de trás pra frente. Dá pra virar isso.";
  }
  if (q4 === "b") return "Tudo parece urgente. Quase nada é.";
  if (q4 === "c") return "A tarefa travada não precisa ficar na cabeça.";
  if (q4 === "d") return "Pessoal e negócio não precisam dividir a mesma fila.";
  return "Sua agenda está de trás pra frente. Dá pra virar isso.";
}

function windowLabel(a?: Answer): string {
  switch (a) {
    case "a":
      return "manhã";
    case "b":
      return "meio do dia";
    case "c":
      return "tarde-noite";
    default:
      return "a janela que você escolheu";
  }
}

function seenBlurb(answers: Partial<Record<1 | 2 | 3 | 4, Answer>>): string {
  const q1 = answers[1];
  const q2 = answers[2];
  const bits: string[] = [];
  if (q1 === "a") bits.push("A tarefa difícil fica pra depois.");
  else if (q1 === "b") bits.push("O dia corre e a culpa sobra.");
  else if (q1 === "c") bits.push("A lista cresce sem ordem clara.");
  else if (q1 === "d") bits.push("O dia some sem rastro.");
  if (q2 === "a") bits.push("Ferramentas demais e o mesmo caos.");
  else if (q2 === "c") bits.push("Tudo ainda vive na cabeça.");
  else if (q2 === "d") bits.push("A energia do dia não entra na montagem.");
  return bits.slice(0, 2).join(" ") || "A agenda está empurrando o que importa.";
}

function signupHref(answers: Partial<Record<1 | 2 | 3 | 4, Answer>>): string {
  const params = new URLSearchParams({
    utm_source: "quiz",
    utm_medium: "onboarding",
    utm_campaign: "lancamento_set2026",
  });
  ( [1, 2, 3, 4] as const).forEach((n) => {
    const v = answers[n];
    if (v) params.set(`q${n}`, v);
  });
  return `/login?${params.toString()}`;
}

export function QuizFlow() {
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [answers, setAnswers] = useState<Partial<Record<1 | 2 | 3 | 4, Answer>>>({});

  const progress = useMemo(() => {
    if (step.kind === "intro") return 0;
    if (step.kind === "result") return 100;
    return (step.id / 4) * 100;
  }, [step]);

  function pick(qid: 1 | 2 | 3 | 4, answer: Answer) {
    const next = { ...answers, [qid]: answer };
    setAnswers(next);
    if (qid === 4) setStep({ kind: "result" });
    else setStep({ kind: "q", id: (qid + 1) as 1 | 2 | 3 | 4 });
  }

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-xl flex-col px-6 py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm font-medium text-slate hover:text-signal">
          SmartDayZ
        </Link>
        {step.kind === "q" ? (
          <p className="text-xs font-medium text-mist">
            {step.id} de 4
          </p>
        ) : (
          <span className="text-xs text-mist" />
        )}
      </div>

      <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-deep transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step.kind === "intro" ? (
        <section className="flex flex-1 flex-col justify-center gap-6 rounded-[24px] bg-paper p-8 shadow-[var(--shadow-card)] sm:p-10">
          <p className="text-xs font-semibold tracking-wide text-signal uppercase">
            4 perguntas · 1 minuto
          </p>
          <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">
            Onde a sua agenda está te atrapalhando?
          </h1>
          <p className="text-base leading-relaxed text-slate">
            Sem cadastro. No fim você entra no teste de 7 dias.
          </p>
          <button
            type="button"
            onClick={() => setStep({ kind: "q", id: 1 })}
            className="mt-4 inline-flex items-center justify-center rounded-[8px] bg-signal px-6 py-3.5 text-[17px] font-semibold text-paper shadow-[var(--shadow-btn)] transition hover:brightness-110"
          >
            Começar
          </button>
        </section>
      ) : null}

      {step.kind === "q" ? (
        <section className="flex flex-1 flex-col gap-6 rounded-[24px] bg-paper p-8 shadow-[var(--shadow-card)] sm:p-10">
          <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[32px]">
            {QUESTIONS[step.id].title}
          </h1>
          <div className="flex flex-col gap-3">
            {QUESTIONS[step.id].options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => pick(step.id, opt.id)}
                className="rounded-[16px] border border-hairline bg-pebble px-5 py-4 text-left text-[16px] font-medium text-ink transition hover:border-deep hover:bg-paper"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {QUESTIONS[step.id].support ? (
            <p className="text-sm leading-relaxed text-slate">
              {QUESTIONS[step.id].support}
            </p>
          ) : null}
        </section>
      ) : null}

      {step.kind === "result" ? (
        <section className="flex flex-1 flex-col gap-6 rounded-[24px] bg-paper p-8 shadow-[var(--shadow-card)] sm:p-10">
          <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[34px]">
            {resultTitle(answers)}
          </h1>
          <p className="text-base leading-relaxed text-slate">{seenBlurb(answers)}</p>
          <ul className="space-y-2 text-sm leading-relaxed text-ink">
            <li>Melhor janela: proteger {windowLabel(answers[3])}.</li>
            <li>Matriz do dia: o que muda o jogo sobe; o resto espera.</li>
            <li>Aviso no pico do app (ainda 15h às 22h), sem prometer ritmo personalizado.</li>
          </ul>
          <div className="rounded-[16px] border border-hairline bg-pebble px-5 py-4 text-sm leading-relaxed text-slate">
            7 dias com tudo liberado, sem cartão. Depois Pro R$14,90/mês.
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href={signupHref(answers)}
              className="inline-flex items-center justify-center rounded-[8px] bg-signal px-6 py-3.5 text-[17px] font-semibold text-paper shadow-[var(--shadow-btn)] transition hover:brightness-110"
            >
              Começar grátis
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-[8px] bg-deep px-6 py-3.5 text-[17px] font-semibold text-paper transition hover:brightness-125"
            >
              Ver como funciona
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
