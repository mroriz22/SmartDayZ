/**
 * Camada única de medição de anúncio (Meta e Google) do site público.
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

export function eventoMedicao(
  evento: EventoMedicao,
  dados: { valor?: number; plano?: string } = {},
) {
  if (typeof window === "undefined") return;
  const nomes = TRADUCAO[evento];

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
