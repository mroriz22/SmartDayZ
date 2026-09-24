import { BotaoLink, Check, Eyebrow, Logo, SectionTitle } from "./lp-ui";

/* ───────── Recursos ───────── */

const ICONES = {
  agenda: (
    <>
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" />
      <path d="M3.5 8.5h13M7 3v3M13 3v3" />
    </>
  ),
  matriz: (
    <>
      <rect x="3.5" y="3.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="11" y="3.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="3.5" y="11" width="5.5" height="5.5" rx="1.2" />
      <rect x="11" y="11" width="5.5" height="5.5" rx="1.2" />
    </>
  ),
  ia: <path d="M8.5 3.5 10 8l4.5 1.5L10 11l-1.5 4.5L7 11 2.5 9.5 7 8zM15 3v3M13.5 4.5h3" />,
};

const RECURSOS: { icone: keyof typeof ICONES; titulo: string; texto: string }[] = [
  {
    icone: "agenda",
    titulo: "Agenda",
    texto:
      "Compromissos e tarefas no mesmo dia, respeitando o tempo que você realmente tem — e protegendo seu pico de energia.",
  },
  {
    icone: "matriz",
    titulo: "Prioridades",
    texto:
      "Matriz de Eisenhower com rótulos que se entendem: Fazer agora, Planejar, Delegar ou negociar, Reavaliar. No celular vira uma coluna só, sem quadrantes ilegíveis.",
  },
  {
    icone: "ia",
    titulo: "Sugestões de IA",
    texto:
      "No Pro, a IA escreve a resposta da tarefa travada e deixa uma dica lendo o seu período. Ela não mexe na agenda: a decisão continua com você.",
  },
];

export function Recursos() {
  return (
    <section id="recursos" className="scroll-mt-16 border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <Eyebrow>Recursos</Eyebrow>
        <SectionTitle>Três partes, uma rotina: registrar, decidir, organizar.</SectionTitle>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {RECURSOS.map((r) => (
            <article key={r.titulo} className="rounded-[16px] border border-line bg-white p-6 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-canvas text-navy">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONES[r.icone]}
                </svg>
              </span>
              <h3 className="mt-5 text-xl font-bold text-navy">{r.titulo}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-body">{r.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Planos ───────── */

const GRATUITO = [
  "Agenda e tarefas do dia",
  "Matriz de Eisenhower completa",
  "1 contexto (Pessoal, Trabalho ou Meta Principal)",
  "Histórico dos últimos 30 dias",
];

const PRO = [
  "Tudo do Gratuito",
  "Múltiplos contextos, cada um com sua agenda e matriz",
  "Histórico ilimitado",
  "Relatório do pico de energia: dia, semana e 30 dias",
  "Exportar agenda (.ics e PDF)",
  "IA na tarefa travada e sincronia entre aparelhos",
];

export function Planos({ trialDias }: { trialDias: number }) {
  return (
    <section id="planos" className="scroll-mt-16 border-t border-line bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <Eyebrow>Planos</Eyebrow>
        <SectionTitle>Comece grátis. A matriz inteira já está incluída.</SectionTitle>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-body">
          Assinatura mensal, cancelamento a qualquer momento, sem renovação escondida.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-[16px] border border-line bg-canvas p-6 sm:p-8">
            <p className="font-semibold text-body">SmartDayZ Gratuito</p>
            <p className="mt-4 text-[44px] font-extrabold leading-none tracking-[-0.03em] text-navy">R$ 0</p>
            <p className="mt-3 text-sm text-soft">para começar a organizar</p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {GRATUITO.map((i) => (
                <li key={i} className="flex gap-2.5 text-[15px] text-navy">
                  <Check />
                  {i}
                </li>
              ))}
            </ul>
            <BotaoLink href="/quiz" variante="secundario" className="mt-8 w-full">
              Começar grátis
            </BotaoLink>
          </div>

          <div className="flex flex-col rounded-[16px] bg-navy p-6 text-white sm:p-8">
            <p className="font-semibold text-orange">SmartDayZ Pro</p>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-[44px] font-extrabold leading-none tracking-[-0.03em]">R$ 14,90</span>
              <span className="text-sm text-white/70">/mês</span>
            </p>
            <p className="mt-3 text-sm text-white/70">
              {trialDias > 0 ? `${trialDias} dias grátis, sem cartão · ` : ""}cobrança mensal · cancele quando quiser
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {PRO.map((i) => (
                <li key={i} className="flex gap-2.5 text-[15px]">
                  <Check />
                  {i}
                </li>
              ))}
            </ul>
            <BotaoLink href="/login?modo=cadastro" className="mt-8 w-full">
              Experimentar o Pro
            </BotaoLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Dúvidas ───────── */

const DUVIDAS = [
  {
    p: "Já tenho uma agenda. Por que mais um app?",
    r: "O SmartDayZ não substitui o registro — ele conecta o que você anota à decisão do que fazer primeiro. A agenda mostra quando; a matriz mostra o que merece atenção; a sugestão mostra como encaixar no dia.",
  },
  {
    p: "A IA decide por mim?",
    r: "Não. No Pro, a IA escreve a resposta de uma tarefa travada quando você pede e deixa uma dica no relatório do período. Ela não move nada na sua agenda: o que entra, sai ou muda de horário é você quem decide.",
  },
  {
    p: "O que é o pico de energia?",
    r: "É a janela das 15h às 22h que o SmartDayZ reserva para o que é importante. A agenda destaca esse intervalo e aponta quando algo importante ficou fora dele. Por enquanto o horário é o mesmo para todo mundo.",
  },
  {
    p: "O que acontece se meu dia mudar?",
    r: "Você arrasta a tarefa para outro quadrante ou muda o horário, e a matriz se ajusta. Tarefa com prazo em até dois dias passa a contar como urgente sozinha.",
  },
  {
    p: "Como funciona o cancelamento do Pro?",
    r: "O Pro custa R$ 14,90 por mês, com 7 dias de teste sem cartão. Você cancela quando quiser, direto na sua conta, e a agenda continua funcionando no plano gratuito.",
  },
];

export function Duvidas() {
  return (
    <section id="duvidas" className="scroll-mt-16 border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-[720px] px-4 py-16 sm:px-6 lg:py-24">
        <Eyebrow>Dúvidas</Eyebrow>
        <h2 className="mt-3 text-[32px] font-extrabold tracking-[-0.025em] text-navy sm:text-[36px]">
          Perguntas frequentes
        </h2>
        <div className="mt-8 border-t border-line">
          {DUVIDAS.map((d, i) => (
            <details key={d.p} open={i === 0} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-semibold text-navy hover:text-orange-text focus-visible:outline-2 focus-visible:outline-navy [&::-webkit-details-marker]:hidden">
                {d.p}
                <span aria-hidden className="text-xl font-bold leading-none text-orange">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="pb-5 text-[15px] leading-relaxed text-body">{d.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── CTA final ───────── */

export function ChamadaFinal() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="grid grid-cols-1 overflow-hidden rounded-[20px] bg-navy md:grid-cols-2">
          <div className="relative h-64 md:h-auto md:min-h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lp/cta.jpg"
              alt="Família brincando num campo, rindo"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 text-white sm:p-10 lg:p-14">
            <Logo claro comNome={false} tamanho="h-10 w-10" />
            <h2 className="mt-6 text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[36px]">
              O próximo passo começa com uma prioridade.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Cadastre uma tarefa, marque urgência e importância e veja seu dia
              montado. Leva menos de dois minutos.
            </p>
            <BotaoLink href="/quiz" className="mt-8 self-start">
              Comece pela próxima tarefa
            </BotaoLink>
          </div>
        </div>
      </div>
    </section>
  );
}
