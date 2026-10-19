/**
 * Camada única de medição de anúncio (Meta, Google e a jornada do Lab2AppZ) do site
 * público.
 *
 * Regra que vale pra tudo aqui: medição NUNCA pode quebrar a tela. Se o script não
 * carregou (bloqueador de anúncio, variável vazia, dev local), toda função vira no-op.
 *
 * Os eventos são escritos com o nome do nosso negócio e traduzidos aqui para o nome que
 * cada plataforma entende. Quem chama não precisa saber o vocabulário do Meta nem do
 * Google.
 *
 * A agenda (/app) é um HTML estático em public/agenda.html, fora do React. Ela tem uma
 * cópia pequena desta mesma tradução (procure por "medição" lá dentro). Mudou um nome
 * aqui, muda lá também.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    /** Contador de jornada do Lab2AppZ (components/medicao.tsx). Fila até o script chegar. */
    lab2j?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    /** Preenchido pelo script da tag do Google, em components/medicao.tsx. */
    __conversaoCadastroGoogle?: string;
  }
}

export type EventoMedicao = "clique_testar" | "cadastro" | "checkout_iniciado";

// nome no Meta, se é evento padrão deles, e o nome no Google.
const TRADUCAO: Record<EventoMedicao, { meta: string; metaPadrao: boolean; google: string }> = {
  // Clique em "Começar a organizar" / "Experimentar o Pro" na página pública. Não é
  // conversão, é o degrau que mostra se a página convence antes do onboarding.
  clique_testar: { meta: "CliqueTestar", metaPadrao: false, google: "clique_testar" },
  // Conta criada. É ESTA a conversão que o anúncio persegue: acontece no mesmo dia do
  // clique, então cabe na janela de atribuição, e dá volume pro Meta aprender.
  cadastro: { meta: "CompleteRegistration", metaPadrao: true, google: "sign_up" },
  // Clique num botão de assinar, que leva pra Quack. A compra em si acontece fora do site.
  checkout_iniciado: { meta: "InitiateCheckout", metaPadrao: true, google: "begin_checkout" },
};

// Nome do degrau no painel de jornada do Lab2AppZ (lab2appz.roriz.tech/jornada).
const DEGRAU_JORNADA: Record<EventoMedicao, string> = {
  clique_testar: "cta",
  cadastro: "cadastro",
  checkout_iniciado: "checkout",
};

/**
 * Contador de jornada do Lab2AppZ (lab2appz.roriz.tech/jornada): mostra até onde quem vem
 * do anúncio chega e onde desiste. É nosso, não vai pro Meta nem pro Google, e não guarda
 * nome, e-mail nem o que a pessoa digita. Só no build de produção: dev local e o preview
 * do farm não contam (e o Lab2AppZ recusa o que não vem de smartdayz.com). A agenda pega
 * o mesmo endereço por /api/medicao.
 */
export const CONTADOR_JORNADA =
  process.env.NODE_ENV === "production" ? "https://lab2appz.roriz.tech/j.js" : null;
export const SITE_JORNADA = "smartdayz";

/**
 * Começos de caminho que são a área logada, não a jornada de compra: o Pixel não manda
 * visita neles e o contador de jornada não manda nada sozinho, só o que o app chamar de
 * propósito (cadastro e clique em assinar).
 */
export const TELAS_INTERNAS = ["/app", "/dashboard", "/paywall"];

/**
 * Avisa o contador de jornada do Lab2AppZ. Se o script ainda não chegou, a chamada entra
 * numa fila que ele lê ao carregar. Mesma regra do resto: nunca quebra a tela.
 *
 *   jornada("evento", "cadastro_inicio")   degrau
 *   jornada("erro", "Cadastro: ...")       erro que a pessoa viu
 *   jornada("conta", userId)               liga a pessoa à conta (a compra vem do servidor)
 */
export function jornada(...args: unknown[]) {
  if (typeof window === "undefined") return;
  try {
    if (!window.lab2j) {
      const fila = ((...a: unknown[]) => {
        (fila.q = fila.q ?? []).push(a);
      }) as NonNullable<Window["lab2j"]>;
      window.lab2j = fila;
    }
    window.lab2j(...args);
  } catch {
    // silêncio de propósito: ver o comentário do topo.
  }
}

export function eventoMedicao(
  evento: EventoMedicao,
  dados: { valor?: number; plano?: string } = {},
) {
  if (typeof window === "undefined") return;
  const nomes = TRADUCAO[evento];

  jornada("evento", DEGRAU_JORNADA[evento], dados.valor !== undefined ? { valor: dados.valor } : {});

  try {
    if (window.fbq) {
      const parametros: Record<string, unknown> = {};
      if (dados.valor !== undefined) {
        parametros.value = dados.valor;
        parametros.currency = "BRL";
      }
      if (dados.plano) parametros.content_name = dados.plano;
      window.fbq(nomes.metaPadrao ? "track" : "trackCustom", nomes.meta, parametros);
    }
  } catch {
    // silêncio de propósito: ver o comentário do topo.
  }

  try {
    if (window.gtag) {
      const parametros: Record<string, unknown> = {};
      if (dados.valor !== undefined) {
        parametros.value = dados.valor;
        parametros.currency = "BRL";
      }
      if (dados.plano) parametros.items = [{ item_name: dados.plano }];
      window.gtag("event", nomes.google, parametros);

      // O Google Ads só conta como conversão o evento marcado com o identificador dele.
      // Sem esse identificador, o evento existe no Analytics mas o anúncio não aprende.
      const conversaoCadastro = window.__conversaoCadastroGoogle;
      if (evento === "cadastro" && conversaoCadastro) {
        window.gtag("event", "conversion", { send_to: conversaoCadastro });
      }
    }
  } catch {
    // idem.
  }
}

/**
 * Visita de página, disparada na mão pelo components/medicao.tsx. As duas plataformas
 * entram com a visita automática desligada, por dois motivos: o Next troca de tela sem
 * recarregar o navegador (a jornada inteira contaria como uma página só), e as telas
 * internas do sistema não devem ser medidas.
 */
export function visitaMedicao(caminho?: string) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "PageView");
  } catch {
    /* no-op */
  }
  try {
    window.gtag?.("event", "page_view", caminho ? { page_path: caminho } : {});
  } catch {
    /* no-op */
  }
}
