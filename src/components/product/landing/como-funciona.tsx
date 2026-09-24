"use client";

import { useState } from "react";
import { ORDEM_QUADRANTES, QUADRANTES, quadrante, type QuadId } from "@/lib/product/matriz";
import { Eyebrow, SectionTitle } from "./lp-ui";

const DICA: Record<QuadId, string> = {
  q1: "Esta entrega vence amanhã e é importante. Vale colocá-la às 15h, no início do seu pico de energia, antes da revisão sem prazo?",
  q2: "Sem prazo apertado, mas importa. Vale reservar um horário dentro do pico, das 15h às 22h, antes que vire urgência.",
  q3: "Tem prazo, mas muda pouco para você. Vale passar para alguém ou negociar a data.",
  q4: "Nem urgente, nem importante. Vale tirar da lista de hoje e liberar o pico.",
};

function Alternar({
  titulo,
  ajuda,
  ligado,
  aoTrocar,
}: {
  titulo: string;
  ajuda: string;
  ligado: boolean;
  aoTrocar: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-line bg-white px-4 py-3.5">
      <div>
        <p className="font-semibold text-navy">{titulo}</p>
        <p className="mt-0.5 text-sm text-body">{ajuda}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-label={titulo}
        onClick={aoTrocar}
        className={`min-w-[52px] rounded-full px-3 py-1 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
          ligado ? "bg-navy text-white" : "bg-canvas text-soft ring-1 ring-line"
        }`}
      >
        {ligado ? "Sim" : "Não"}
      </button>
    </div>
  );
}

export function ComoFunciona() {
  const [urgente, setUrgente] = useState(true);
  const [importante, setImportante] = useState(true);
  const alvo = quadrante(urgente, importante);

  return (
    <section id="como-funciona" className="scroll-mt-16 border-t border-line bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <Eyebrow>Como funciona</Eyebrow>
        <SectionTitle>Veja como uma tarefa vira uma prioridade clara.</SectionTitle>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-body">
          Urgência e importância são perguntas diferentes. Marque as duas e a
          matriz mostra onde a tarefa entra no seu dia.
        </p>

        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="rounded-[16px] border border-line bg-canvas p-5 sm:p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-soft">1 · Sua tarefa</p>
            <div className="mt-3 rounded-[12px] border border-line bg-white px-4 py-3.5">
              <p className="text-[17px] font-semibold text-navy">Enviar proposta para o cliente</p>
              <p className="mt-0.5 text-sm text-body">Prazo: amanhã, 12:00</p>
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-soft">2 · Classifique</p>
            <div className="mt-3 flex flex-col gap-2.5">
              <Alternar
                titulo="Urgente"
                ajuda="Tem prazo próximo ou alguém espera."
                ligado={urgente}
                aoTrocar={() => setUrgente(!urgente)}
              />
              <Alternar
                titulo="Importante"
                ajuda="Muda algo que importa para você."
                ligado={importante}
                aoTrocar={() => setImportante(!importante)}
              />
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-soft">3 · Onde ela entra</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5" aria-live="polite">
              {ORDEM_QUADRANTES.map((q) => {
                const ativo = q === alvo;
                return (
                  <div
                    key={q}
                    className={`min-h-[104px] rounded-[12px] border p-3.5 transition ${
                      ativo ? "border-orange bg-orange-soft" : "border-line bg-white"
                    }`}
                  >
                    <p className="text-[15px] font-semibold text-navy">{QUADRANTES[q].nome}</p>
                    <p className="mt-0.5 text-[13px] text-body">{QUADRANTES[q].regra}</p>
                    {ativo ? (
                      <p className="mt-2.5 truncate rounded-[6px] bg-orange px-2.5 py-1 text-[12px] font-semibold text-navy">
                        Enviar proposta
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-[14px] bg-navy p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange">Sugestão</p>
              <p className="mt-2 text-[15px] leading-relaxed">{DICA[alvo]}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/65">
                Contexto usado: prazo, pico de energia e compromissos de hoje.
                Você decide o que muda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
