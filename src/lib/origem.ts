/**
 * De onde a pessoa chegou, pra saber quais canais trazem gente que cria conta.
 *
 * Por que existe: o pixel e o Google contam visita de anúncio, mas quem chega de um grupo de
 * WhatsApp, da bio do Instagram ou de uma busca não deixa rastro nenhum. Sem isso não dá pra
 * saber se o trabalho no orgânico está trazendo cliente.
 *
 * Primeiro toque com rastro: a primeira visita que chega por um link com utm_ ou vinda de outro
 * site fica guardada num cookie nosso, de 90 dias. Visita seguinte não sobrescreve. Visita
 * direta, sem rastro, não marca nada e espera a próxima.
 *
 * No cadastro, o servidor lê este cookie (lib/auth.ts, no gancho de conta criada) e manda a
 * origem junto com o evento `user_signed_up` para o painel da fábrica (saas-control). O banco
 * do app não ganhou coluna nova de propósito: o deploy não roda migração sozinho.
 *
 * Não guarda identificador de anúncio nem a lista de páginas lidas.
 *
 * Mesmo modelo do Print3dOps (apps/web/src/lib/origem.ts lá).
 */

export type Origem = {
  /** utm_source do link, ex.: instagram. */
  fonte?: string;
  /** utm_medium do link, ex.: bio. */
  meio?: string;
  /** utm_campaign do link. */
  campanha?: string;
  /** Site de onde veio, quando não houve utm: google.com, l.instagram.com. */
  site?: string;
  /** Página do SmartDayZ em que chegou. */
  pagina?: string;
  /** Resposta de "Como você conheceu o SmartDayZ?", quando a pessoa respondeu no cadastro. */
  resposta?: string;
  /** Dia da chegada, AAAA-MM-DD. */
  em: string;
};

export const COOKIE_ORIGEM = "sdz_origem";
const DIAS = 90;
const DOMINIO = "smartdayz.com";

// utm que nós mesmos pomos em link interno: o /quiz manda pro cadastro com
// utm_source=quiz. Isso é caminho dentro do site, não canal de aquisição.
const FONTES_INTERNAS = new Set(["quiz"]);

const curto = (v: string | null | undefined) => (v ? v.trim().slice(0, 80) : undefined) || undefined;

/** Lê a origem de um valor de cookie já separado. Nunca lança. */
function interpretar(valor: string | undefined): Origem | null {
  if (!valor) return null;
  try {
    const dados = JSON.parse(decodeURIComponent(valor));
    if (!dados || typeof dados !== "object" || typeof dados.em !== "string") return null;
    // Só os campos conhecidos, sempre curtos: o cookie vem do navegador e pode ter sido mexido.
    const o: Origem = { em: String(dados.em).slice(0, 10) };
    for (const k of ["fonte", "meio", "campanha", "site", "pagina", "resposta"] as const) {
      const v = typeof dados[k] === "string" ? curto(dados[k]) : undefined;
      if (v) o[k] = v;
    }
    return o;
  } catch {
    return null;
  }
}

function valorDoCookie(cabecalho: string | null | undefined): string | undefined {
  if (!cabecalho) return undefined;
  const par = cabecalho.split(/;\s*/).find((c) => c.startsWith(`${COOKIE_ORIGEM}=`));
  return par ? par.slice(COOKIE_ORIGEM.length + 1) : undefined;
}

/** Servidor: lê a origem do cabeçalho Cookie da requisição, ou null. */
export function origemDoCabecalho(cabecalhoCookie: string | null | undefined): Origem | null {
  return interpretar(valorDoCookie(cabecalhoCookie));
}

/** Navegador: lê a origem guardada, ou null. */
export function lerOrigem(): Origem | null {
  if (typeof document === "undefined") return null;
  return interpretar(valorDoCookie(document.cookie));
}

function gravar(origem: Origem) {
  const host = window.location.hostname;
  const dominio = host === DOMINIO || host.endsWith(`.${DOMINIO}`) ? `; Domain=.${DOMINIO}` : "";
  const seguro = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_ORIGEM}=${encodeURIComponent(JSON.stringify(origem))}; Max-Age=${DIAS * 86400}; Path=/; SameSite=Lax${dominio}${seguro}`;
}

/** Guarda a origem desta visita, se ela tiver rastro e nada tiver sido guardado antes. */
export function guardarOrigem(): void {
  if (typeof window === "undefined") return;
  try {
    if (lerOrigem()) return;
    const busca = new URLSearchParams(window.location.search);
    let fonte = curto(busca.get("utm_source"));
    if (fonte && FONTES_INTERNAS.has(fonte.toLowerCase())) fonte = undefined;
    let site: string | undefined;
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.toLowerCase();
      const ehNosso = host === DOMINIO || host.endsWith(`.${DOMINIO}`) || host === window.location.hostname;
      if (!ehNosso) site = curto(host.replace(/^www\./, ""));
    }
    if (!fonte && !site) return;

    gravar({
      fonte,
      meio: fonte ? curto(busca.get("utm_medium")) : undefined,
      campanha: fonte ? curto(busca.get("utm_campaign")) : undefined,
      site,
      pagina: curto(window.location.pathname),
      em: new Date().toISOString().slice(0, 10),
    });
  } catch {
    // Medição nunca quebra a tela.
  }
}

/**
 * Junta a resposta de "Como você conheceu" ao que já estiver guardado, logo antes de criar a
 * conta, para o servidor ler tudo de uma vez. Sem resposta, não mexe em nada.
 */
export function guardarResposta(resposta: string): void {
  if (typeof window === "undefined" || !resposta) return;
  try {
    const atual = lerOrigem() ?? { em: new Date().toISOString().slice(0, 10) };
    gravar({ ...atual, resposta: curto(resposta) });
  } catch {
    // idem.
  }
}

/** Respostas de "Como você conheceu o SmartDayZ?", na ordem em que aparecem. */
export const COMO_CONHECEU = [
  "Instagram",
  "Facebook",
  "Grupo de Facebook ou WhatsApp",
  "Busca no Google",
  "YouTube",
  "TikTok",
  "Indicação de alguém",
  "Anúncio",
  "Outro",
] as const;
