"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { trackClient } from "@/factory/useAccess";
import { Check, Logo, botao } from "@/components/product/landing/lp-ui";
import {
  FAIXA,
  NAO_SEI,
  ORDEM_QUADRANTES,
  QUADRANTES,
  quadrante,
  rotuloPico,
  type RespostaAcorda,
} from "@/lib/product/matriz";
import {
  NOME_CONTEXTO,
  lerRespostas,
  montarDia,
  picoDoPerfil,
  salvarRespostas,
  semearAgenda,
  type Contexto,
  type Janela,
  type RespostasOnboarding,
  type TarefaOnboarding,
} from "@/lib/product/onboarding";

/**
 * Onboarding de primeira entrada (/quiz) — design de 23/09/2026, 7 telas.
 * As escolhas ficam no aparelho e o dia montado vira a agenda de /app.
 * Desvios do design registrados em DESVIOS-LP-ONBOARDING.md.
 */

const TOTAL = 7;

const hh = (h: number) => `${h}h`;

const JANELAS: { id: Janela; nome: string; horas: string }[] = [
  { id: "manha", nome: "Manhã", horas: `${hh(FAIXA.manha.de)}–${hh(FAIXA.manha.ate)}` },
  { id: "tarde", nome: "Tarde", horas: `${hh(FAIXA.tarde.de)}–${hh(FAIXA.tarde.ate)}` },
  { id: "tarde-noite", nome: "Tarde/Noite", horas: `${hh(FAIXA["tarde-noite"].de)}–${hh(FAIXA["tarde-noite"].ate)}` },
  { id: "madrugada", nome: "Noite", horas: `${hh(FAIXA.madrugada.de)}–${hh(FAIXA.madrugada.ate)}` },
  { id: NAO_SEI, nome: "Não sei", horas: "A agenda usa o horário em que você acorda" },
];
const ACORDA: { id: RespostaAcorda; nome: string; texto: string }[] = [
  { id: "antes-6", nome: "Antes das 6h", texto: "antes das 6h" },
  { id: "6-8", nome: "6h–8h", texto: "entre 6h e 8h" },
  { id: "8-10", nome: "8h–10h", texto: "entre 8h e 10h" },
  { id: "depois-10", nome: "Depois das 10h", texto: "depois das 10h" },
  { id: NAO_SEI, nome: "Não sei", texto: "" },
];

const RENDE: Record<Exclude<Janela, typeof NAO_SEI>, string> = {
  manha: "de manhã",
  tarde: "à tarde",
  "tarde-noite": "do fim da tarde à noite",
  madrugada: "à noite",
};

/** Por que o pico ficou onde ficou, com as palavras das respostas. */
function motivoDoPico(janela: Janela | null, acorda: RespostaAcorda | null) {
  const partes = [
    janela && janela !== NAO_SEI ? `você rende melhor ${RENDE[janela]}` : "",
    acorda && acorda !== NAO_SEI ? `acorda ${ACORDA.find((a) => a.id === acorda)!.texto}` : "",
  ].filter(Boolean);
  if (!partes.length) return "Sem as respostas, a agenda começa neste horário. Você muda o pico no seu perfil quando quiser.";
  return `Como ${partes.join(" e ")}, é aqui que a agenda guarda o que é importante. Dá para mudar no seu perfil.`;
}

const CONTEXTOS: { id: Contexto; sigla: string; texto: string }[] = [
  { id: "pessoal", sigla: "P", texto: "Casa, saúde, estudos e compromissos seus." },
  { id: "trabalho", sigla: "T", texto: "Entregas, reuniões e solicitações de clientes." },
  { id: "meta", sigla: "M", texto: "Uma meta específica com prazo próprio." },
];

const EXEMPLO_DIA: TarefaOnboarding[] = [
  { titulo: "Enviar proposta para o cliente", urgente: true, importante: true },
  { titulo: "Estudar para certificação", urgente: false, importante: true },
];

const MOTIVO: Record<string, string> = {
  q1: "Urgente e importante — logo no início do seu pico.",
  q2: "Importante sem prazo — protegido dentro do pico, antes de virar urgência.",
  q3: "Urgente, mas pouco importante — fora do pico. Dá para delegar.",
  q4: "Nem urgente, nem importante — fora do pico. Reavalie se precisa entrar.",
};

const vazio: RespostasOnboarding = { nome: "", email: "", janela: null, acorda: null, contexto: null, tarefas: [] };

function Escolha({
  selecionado,
  aoEscolher,
  children,
}: {
  selecionado: boolean;
  aoEscolher: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selecionado}
      onClick={aoEscolher}
      className={`flex w-full items-center gap-3 rounded-[12px] border-[1.5px] px-4 py-3.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
        selecionado ? "border-orange bg-orange-soft" : "border-line bg-white hover:border-navy/30"
      }`}
    >
      {children}
    </button>
  );
}

function Marca({
  rotulo,
  ligado,
  aoTrocar,
}: {
  rotulo: string;
  ligado: boolean;
  aoTrocar: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={ligado}
      onClick={aoTrocar}
      className={`flex-1 rounded-[10px] border-[1.5px] px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
        ligado ? "border-orange bg-white text-navy" : "border-line bg-white text-soft hover:border-navy/30"
      }`}
    >
      {rotulo}: {ligado ? "sim" : "não"}
    </button>
  );
}

function Cabeca({ passo, titulo, texto }: { passo: string; titulo: string; texto: React.ReactNode }) {
  return (
    <>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-orange-text">{passo}</p>
      <h1 className="mt-2 text-[28px] font-extrabold leading-[1.12] tracking-[-0.025em] text-navy">{titulo}</h1>
      <p className="mt-2.5 text-[16px] leading-relaxed text-body">{texto}</p>
    </>
  );
}

export function OnboardingFlow({ trialDias }: { trialDias: number }) {
  const [tela, setTela] = useState(1);
  const [r, setR] = useState<RespostasOnboarding>(vazio);
  const [erroEmail, setErroEmail] = useState("");
  // passo 4 (exemplo) e passo 5 (rascunho da tarefa)
  const [exUrg, setExUrg] = useState(false);
  const [exImp, setExImp] = useState(true);
  const [rascunho, setRascunho] = useState({ titulo: "", urgente: true, importante: true });
  const id = useId();

  // retoma de onde parou, se a pessoa voltar
  // (depois da hidratação: localStorage só existe no navegador)
  useEffect(() => {
    const t = setTimeout(() => {
      const salvo = lerRespostas();
      if (salvo) setR((atual) => ({ ...atual, ...salvo, tarefas: salvo.tarefas ?? [] }));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const pico = picoDoPerfil(r);

  function atualizar(parcial: Partial<RespostasOnboarding>) {
    setR((atual) => {
      const novo = { ...atual, ...parcial };
      salvarRespostas(novo);
      return novo;
    });
  }

  function avancar() {
    if (tela === 1 && r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
      setErroEmail("Confira o e-mail — ou deixe em branco por enquanto.");
      return;
    }
    setErroEmail("");
    setTela((t) => Math.min(TOTAL, t + 1));
  }

  function adicionarTarefa() {
    const titulo = rascunho.titulo.trim();
    if (!titulo || r.tarefas.length >= 3) return;
    atualizar({ tarefas: [...r.tarefas, { ...rascunho, titulo }] });
    setRascunho({ titulo: "", urgente: true, importante: true });
  }

  function concluir(plano: "gratuito" | "pro") {
    setTela(TOTAL + 1);
    salvarRespostas({ ...r, concluidoEm: new Date().toISOString() });
    const semeou = semearAgenda(r.contexto, r.tarefas, pico);
    void trackClient("onboarding_concluido", {
      plano,
      janela: r.janela,
      acorda: r.acorda,
      pico: rotuloPico(pico),
      contexto: r.contexto,
      tarefas: r.tarefas.length,
      agenda_criada: semeou,
    });
    const utm = "utm_source=quiz&utm_medium=onboarding&utm_campaign=lancamento_set2026";
    window.location.href = plano === "pro" ? `/login?modo=cadastro&${utm}` : "/app";
  }

  const perfilRespondido = !!(r.janela || r.acorda);
  // o pico precisa das duas respostas ("Não sei" conta) antes de seguir
  const faltaPerfil = tela === 2 && (!r.janela || !r.acorda);
  const dia = montarDia(r.tarefas.length ? r.tarefas : EXEMPLO_DIA, pico);
  const primeiraNoPico = dia.find((t) => t.hora);
  const alvoRascunho = quadrante(rascunho.urgente, rascunho.importante);
  const alvoExemplo = quadrante(exUrg, exImp);

  return (
    <main className="font-display flex flex-1 justify-center bg-canvas px-3 py-4 text-navy sm:px-6 sm:py-10">
      <div className="flex w-full max-w-[486px] flex-col rounded-[18px] bg-white p-5 shadow-[0_20px_50px_-24px_rgba(11,26,64,0.3)] sm:min-h-[760px] sm:p-6">
        {/* topo */}
        <div className="grid grid-cols-3 items-center">
          <Link href="/" aria-label="Voltar para o início" className="justify-self-start rounded-md focus-visible:outline-2 focus-visible:outline-navy">
            <Logo tamanho="h-6 w-6" />
          </Link>
          <p className="justify-self-center text-sm text-body" aria-live="polite">
            {tela <= TOTAL ? `${tela} / ${TOTAL}` : ""}
          </p>
          {tela < TOTAL && tela !== 2 ? (
            <button
              type="button"
              onClick={() => setTela(tela + 1)}
              className="justify-self-end rounded-md px-2 py-1 text-sm text-body hover:bg-canvas hover:text-navy"
            >
              Pular
            </button>
          ) : (
            <span />
          )}
        </div>
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-orange transition-[width] duration-300"
            style={{ width: `${(Math.min(tela, TOTAL + 1) - 1) * (100 / TOTAL)}%` }}
          />
        </div>

        <div className="mt-7 flex flex-1 flex-col">
          {tela === 1 ? (
            <section>
              <Logo comNome={false} tamanho="h-12 w-12" />
              <h1 className="mt-6 text-[30px] font-extrabold leading-[1.12] tracking-[-0.025em] text-navy">
                Seu dia, com direção.
              </h1>
              <p className="mt-2.5 text-[16px] leading-relaxed text-body">
                Quatro passos curtos e seu primeiro dia fica montado. Só o primeiro é obrigatório: é ele que acha o seu pico.
              </p>
              <label htmlFor={`${id}-nome`} className="mt-6 block text-[13px] font-medium text-navy">
                Como quer ser chamado?
              </label>
              <input
                id={`${id}-nome`}
                value={r.nome}
                onChange={(e) => atualizar({ nome: e.target.value })}
                placeholder="Seu nome"
                autoComplete="name"
                className="mt-1.5 w-full rounded-[10px] border border-line px-3 py-2.5 text-[15px] shadow-[inset_0_1px_2px_rgba(11,26,64,0.06)] outline-none focus:border-orange"
              />
              <label htmlFor={`${id}-email`} className="mt-4 block text-[13px] font-medium text-navy">
                E-mail
              </label>
              <input
                id={`${id}-email`}
                type="email"
                value={r.email}
                onChange={(e) => atualizar({ email: e.target.value })}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                aria-invalid={!!erroEmail}
                aria-describedby={`${id}-email-ajuda`}
                className="mt-1.5 w-full rounded-[10px] border border-line px-3 py-2.5 text-[15px] shadow-[inset_0_1px_2px_rgba(11,26,64,0.06)] outline-none focus:border-orange"
              />
              <p id={`${id}-email-ajuda`} className={`mt-2 text-[12px] ${erroEmail ? "text-orange-text" : "text-body"}`}>
                {erroEmail || "Usamos só para salvar sua agenda e permitir a retomada. Nada de newsletter sem pedir."}
              </p>
            </section>
          ) : null}

          {tela === 2 ? (
            <section>
              <Cabeca
                passo="Passo 1 de 4"
                titulo="Quando você rende melhor?"
                texto="Com duas respostas a agenda encontra o seu pico de energia: o horário que ela protege para o que é importante. Se não souber, marque “Não sei”."
              />
              <div role="radiogroup" aria-label="Quando você rende melhor" className="mt-6 flex flex-col gap-2.5">
                {JANELAS.map((j) => (
                  <Escolha key={j.id} selecionado={r.janela === j.id} aoEscolher={() => atualizar({ janela: j.id })}>
                    <span className="flex-1">
                      <span className="block font-semibold text-navy">{j.nome}</span>
                      <span className="block text-[13px] text-body">{j.horas}</span>
                    </span>
                  </Escolha>
                ))}
              </div>
              <p id={`${id}-acorda`} className="mt-6 text-[15px] font-semibold text-navy">
                Num dia livre, sem despertador, que horas você acorda?
              </p>
              <div role="radiogroup" aria-labelledby={`${id}-acorda`} className="mt-2.5 grid grid-cols-2 gap-2">
                {ACORDA.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={r.acorda === a.id}
                    onClick={() => atualizar({ acorda: a.id })}
                    className={`${a.id === NAO_SEI ? "col-span-2 " : ""}rounded-[10px] border-[1.5px] px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                      r.acorda === a.id ? "border-orange bg-orange-soft text-navy" : "border-line bg-white text-navy hover:border-navy/30"
                    }`}
                  >
                    {a.nome}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-[12px] bg-navy px-4 py-3.5 text-white" aria-live="polite">
                {perfilRespondido ? (
                  <>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-orange">Seu pico</p>
                    <p className="mt-0.5 text-[22px] font-extrabold tracking-[-0.02em]">{rotuloPico(pico)}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/75">{motivoDoPico(r.janela, r.acorda)}</p>
                  </>
                ) : (
                  <p className="text-[13px] leading-relaxed text-white/75">Responda as duas perguntas e o seu pico aparece aqui.</p>
                )}
              </div>
            </section>
          ) : null}

          {tela === 3 ? (
            <section>
              <Cabeca
                passo="Passo 2 de 4"
                titulo="Qual contexto você quer organizar primeiro?"
                texto="Cada contexto tem sua própria agenda e matriz. Você começa com um; no Pro pode ter vários."
              />
              <div role="radiogroup" aria-label="Contexto" className="mt-6 flex flex-col gap-2.5">
                {CONTEXTOS.map((c) => (
                  <Escolha key={c.id} selecionado={r.contexto === c.id} aoEscolher={() => atualizar({ contexto: c.id })}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-navy text-sm font-bold text-white">
                      {c.sigla}
                    </span>
                    <span>
                      <span className="block font-semibold text-navy">{NOME_CONTEXTO[c.id]}</span>
                      <span className="block text-[13px] text-body">{c.texto}</span>
                    </span>
                  </Escolha>
                ))}
              </div>
            </section>
          ) : null}

          {tela === 4 ? (
            <section>
              <Cabeca
                passo="Antes do passo 3"
                titulo="Urgente e importante são perguntas diferentes."
                texto="Urgente tem prazo ou alguém esperando. Importante muda algo que importa para você. Teste no exemplo:"
              />
              <div className="mt-6 rounded-[12px] border border-line bg-canvas p-4">
                <p className="font-semibold text-navy">Estudar para a prova do mês que vem</p>
                <div className="mt-3 flex gap-2">
                  <Marca rotulo="Urgente" ligado={exUrg} aoTrocar={() => setExUrg(!exUrg)} />
                  <Marca rotulo="Importante" ligado={exImp} aoTrocar={() => setExImp(!exImp)} />
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-body" aria-live="polite">
                  Vai para:
                  <span className="rounded-full bg-orange px-3 py-1 text-[13px] font-semibold text-navy">
                    {QUADRANTES[alvoExemplo].nome}
                  </span>
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-body">
                  {alvoExemplo === "q2"
                    ? "Ainda falta um mês, mas a prova importa. Planejar reserva tempo antes que vire urgência."
                    : alvoExemplo === "q1"
                      ? "Se a prova fosse amanhã, entraria aqui: faça logo, de preferência no pico."
                      : alvoExemplo === "q3"
                        ? "Com prazo e sem importância, dá para passar adiante ou negociar."
                        : "Sem prazo e sem importância, ela sai da lista de hoje."}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ORDEM_QUADRANTES.map((q) => (
                  <div
                    key={q}
                    className={`rounded-[10px] border px-3 py-2.5 ${q === alvoExemplo ? "border-orange bg-orange-soft" : "border-line"}`}
                  >
                    <p className="text-sm font-semibold text-navy">{QUADRANTES[q].nome}</p>
                    <p className="text-[12px] text-body">{QUADRANTES[q].regra.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {tela === 5 ? (
            <section>
              <Cabeca
                passo="Passo 3 de 4"
                titulo="Qual tarefa você quer organizar primeiro?"
                texto="Adicione até três e marque urgência e importância. A matriz faz o resto."
              />
              <form
                className="mt-6 rounded-[12px] border border-line bg-canvas p-3.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  adicionarTarefa();
                }}
              >
                <input
                  aria-label="Tarefa"
                  value={rascunho.titulo}
                  onChange={(e) => setRascunho({ ...rascunho, titulo: e.target.value })}
                  placeholder="Ex.: Enviar proposta para o cliente"
                  maxLength={120}
                  disabled={r.tarefas.length >= 3}
                  className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-orange disabled:opacity-60"
                />
                <div className="mt-2.5 flex gap-2">
                  <Marca rotulo="Urgente" ligado={rascunho.urgente} aoTrocar={() => setRascunho({ ...rascunho, urgente: !rascunho.urgente })} />
                  <Marca rotulo="Importante" ligado={rascunho.importante} aoTrocar={() => setRascunho({ ...rascunho, importante: !rascunho.importante })} />
                </div>
                <button
                  type="submit"
                  disabled={!rascunho.titulo.trim() || r.tarefas.length >= 3}
                  className={`${botao.escuro} mt-2.5 w-full disabled:cursor-not-allowed disabled:bg-soft/70`}
                >
                  {r.tarefas.length >= 3 ? "Limite de três tarefas" : `Adicionar como “${QUADRANTES[alvoRascunho].nome}”`}
                </button>
              </form>
              {r.tarefas.length ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {r.tarefas.map((t, i) => (
                    <li key={`${t.titulo}-${i}`} className="flex items-center gap-3 rounded-[10px] border border-line px-3 py-2.5">
                      <span className="flex-1 text-[15px] font-medium text-navy">{t.titulo}</span>
                      <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[12px] font-semibold text-navy ring-1 ring-line">
                        {QUADRANTES[quadrante(t.urgente, t.importante)].nome}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remover ${t.titulo}`}
                        onClick={() => atualizar({ tarefas: r.tarefas.filter((_, j) => j !== i) })}
                        className="rounded px-1.5 text-lg leading-none text-soft hover:text-navy"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-body">Nenhuma tarefa ainda. Uma já basta para montar o dia.</p>
              )}
            </section>
          ) : null}

          {tela === 6 ? (
            <section>
              <Cabeca
                passo="Passo 4 de 4"
                titulo="Seu dia já tem direção."
                texto={`O importante ficou dentro do seu pico (${rotuloPico(pico)}). O resto, fora dele. Tudo pode ser ajustado.`}
              />
              <div className="mt-6 rounded-[14px] bg-navy p-4 text-white sm:p-5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold">
                    Hoje · {NOME_CONTEXTO[r.contexto ?? "pessoal"]}
                    {r.tarefas.length ? "" : " · exemplo"}
                  </span>
                  <span className="text-white/70">Pico {rotuloPico(pico)}</span>
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {dia.map((t, i) => (
                    <li key={`${t.titulo}-${i}`} className="flex gap-3">
                      <span className="w-12 shrink-0 pt-2.5 text-[13px] font-semibold text-orange">{t.hora || "—"}</span>
                      <div className={`flex-1 rounded-[10px] px-3.5 py-2.5 ${t.hora ? "bg-orange text-navy" : "bg-white/10 text-white"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{t.titulo}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.hora ? "bg-navy text-white" : "bg-white/15"}`}>
                            {QUADRANTES[t.quad].nome}
                          </span>
                        </div>
                        <p className={`mt-0.5 text-[12px] ${t.hora ? "text-navy/80" : "text-white/70"}`}>{MOTIVO[t.quad]}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-white/15 pt-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange">Sugestão</p>
                  <p className="mt-1.5 text-sm leading-relaxed">
                    {primeiraNoPico
                      ? `“${primeiraNoPico.titulo}” ficou às ${primeiraNoPico.hora}. Se o dia mudar, é só arrastar na agenda e a matriz se ajusta.`
                      : "Nada importante para hoje: o pico fica livre para o que aparecer."}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">
                    Contexto usado: prazos que você marcou e o pico de energia. Você pode mudar tudo no app.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {tela === 7 ? (
            <section>
              <Cabeca
                passo="Quase lá"
                titulo="Escolha como quer seguir."
                texto="A matriz completa é gratuita. O Pro adiciona profundidade — sem pressa para decidir."
              />
              <div className="mt-6 rounded-[14px] border-[1.5px] border-navy p-5">
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-navy">SmartDayZ Gratuito</p>
                  <p className="text-xl font-extrabold text-navy">R$ 0</p>
                </div>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-body">
                  <li className="flex gap-2"><Check />Agenda, tarefas e matriz completa</li>
                  <li className="flex gap-2"><Check />1 contexto · histórico de 30 dias</li>
                </ul>
                <button type="button" onClick={() => concluir("gratuito")} className={`${botao.primario} mt-4 w-full`}>
                  Começar grátis
                </button>
              </div>
              <div className="mt-3 rounded-[14px] border border-line bg-canvas p-5">
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-navy">SmartDayZ Pro</p>
                  <p className="text-xl font-extrabold text-navy">
                    R$ 14,90<span className="text-[13px] font-medium text-body">/mês</span>
                  </p>
                </div>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-body">
                  <li className="flex gap-2"><Check />Vários contextos, cada um com sua matriz</li>
                  <li className="flex gap-2"><Check />Histórico ilimitado e relatório do pico</li>
                  <li className="flex gap-2"><Check />Exportar agenda (.ics e PDF)</li>
                  <li className="flex gap-2"><Check />IA na tarefa travada e sincronia entre aparelhos</li>
                </ul>
                <p className="mt-3 text-[12px] text-body">
                  {trialDias > 0 ? `${trialDias} dias grátis, sem cartão. ` : ""}Cobrança mensal. Cancele quando quiser, direto na sua conta.
                </p>
                <button type="button" onClick={() => concluir("pro")} className={`${botao.secundario} mt-4 w-full`}>
                  Experimentar o Pro
                </button>
              </div>
            </section>
          ) : null}

          {tela > TOTAL ? (
            <section className="flex flex-1 flex-col items-center justify-center text-center" role="status">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-orange" aria-hidden />
              <p className="mt-4 text-sm text-body">Abrindo sua agenda…</p>
            </section>
          ) : null}

          {/* rodapé de navegação */}
          {tela <= TOTAL ? (
            <div className="mt-auto flex items-center gap-3 pt-8">
              {tela > 1 ? (
                <button type="button" onClick={() => setTela(tela - 1)} className={`${botao.secundario} flex-1 sm:flex-none`}>
                  Voltar
                </button>
              ) : null}
              {tela < TOTAL ? (
                <button
                  type="button"
                  onClick={avancar}
                  disabled={faltaPerfil}
                  className={`${botao.primario} flex-1 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Continuar
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
