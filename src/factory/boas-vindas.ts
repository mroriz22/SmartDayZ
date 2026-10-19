import { limparWhatsapp } from "./whatsapp";

/**
 * Aba Boas-vindas do Lab2AppZ (lab2appz.roriz.tech/boas-vindas): quem cria a conta e começa o
 * teste é avisado lá. De lá sai o e-mail de boas-vindas com a marca deste SaaS, e a pessoa entra
 * na fila do WhatsApp que a Wanessa manda à mão.
 *
 * Chave LAB2APPZ_JORNADA_CHAVE: chave do Lab2AppZ com nome "jornada-<slug>", que só pode avisar
 * isto e a compra deste SaaS. Sem ela, nada sai. O Lab2AppZ não duplica (mesmo userId só
 * atualiza). Silencioso e com prazo curto: painel fora do ar não atrapalha o cadastro.
 */

/** Slug do SaaS no quadro do Lab2AppZ. */
export const SLUG_LAB2APPZ = "smartdayz";

/** O que importa do contexto que o better-auth passa pro gancho do banco. */
export type ContextoDoCadastro = { path?: string; request?: unknown; body?: unknown } | null | undefined;

/**
 * Cadastro feito pela pessoa no site (POST /sign-up/email, com request). Conta criada por
 * dentro (compra na Quack, script, auth.api sem request) fica de fora: não está em teste.
 */
export function cadastroPeloSite(ctx: ContextoDoCadastro): boolean {
  return ctx?.path === "/sign-up/email" && !!ctx.request;
}

/** O WhatsApp vai junto do cadastro, fora dos campos da conta: não grava no banco daqui. */
export function whatsappDoCadastro(ctx: ContextoDoCadastro): string | null {
  return limparWhatsapp((ctx?.body as { whatsapp?: unknown } | undefined)?.whatsapp);
}

export async function avisarBoasVindas(c: {
  userId: string;
  nome: string | null | undefined;
  email: string;
  whatsapp: string | null;
  em?: Date | null;
  testeAte?: Date | null;
}): Promise<void> {
  const chave = process.env.LAB2APPZ_JORNADA_CHAVE;
  if (!chave) return;
  const base = (process.env.LAB2APPZ_URL ?? "https://lab2appz.roriz.tech").replace(/\/+$/, "");
  // nome em branco que virou o começo do e-mail não é nome
  const nome = c.nome && c.nome !== c.email.split("@")[0] ? c.nome : null;
  try {
    const r = await fetch(`${base}/api/boas-vindas/${SLUG_LAB2APPZ}/cadastros`, {
      method: "POST",
      headers: { authorization: `Bearer ${chave}`, "content-type": "application/json" },
      body: JSON.stringify({
        conta: c.userId,
        nome,
        email: c.email,
        whatsapp: c.whatsapp,
        em: (c.em ?? new Date()).toISOString(),
        testeAte: c.testeAte ? c.testeAte.toISOString() : null,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("[boas-vindas] Lab2AppZ respondeu", r.status);
  } catch (err) {
    // o cadastro já deu certo; só fica faltando na lista de boas-vindas
    console.error("[boas-vindas] não consegui avisar o Lab2AppZ", err instanceof Error ? err.message : err);
  }
}
