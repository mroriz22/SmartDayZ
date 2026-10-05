import { createHash } from "node:crypto";

/**
 * Aviso de venda do servidor pro Meta (API de Conversões).
 *
 * Por que isso existe: a compra acontece na Quack, fora do nosso site, e o checkout da Quack
 * não tem campo de pixel. O pixel vive no navegador da pessoa e nunca vê esse pagamento, então
 * sem este arquivo o anúncio jamais saberia que alguém comprou.
 *
 * A ponte entre o clique no anúncio e a venda é o e-mail, enviado embaralhado (SHA-256, que é
 * um caminho só de ida: o Meta compara com o que ele já tem, não consegue ler de volta).
 *
 * Sem NEXT_PUBLIC_META_PIXEL_ID e META_CAPI_TOKEN preenchidos, vira no-op, igual ao resto da
 * medição. Mesmo modelo do Print3dOps (apps/web/src/lib/meta-capi.ts lá).
 */

const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
const VERSAO_API = "v21.0";

/** Pro mensal, R$ 14,90: usado quando o aviso da Quack não traz o valor. */
const VALOR_PRO = 14.9;

function embaralhar(valor: string) {
  return createHash("sha256").update(valor.trim().toLowerCase()).digest("hex");
}

/**
 * Identificador da venda pro Meta descartar repetição.
 *
 * A Quack pode avisar a mesma compra duas vezes com nomes diferentes (`order.paid` e
 * `subscription.activated`), e só o primeiro traz o número do pedido. Por isso o
 * identificador é o e-mail embaralhado + o dia: os dois avisos da mesma compra viram uma
 * venda só no Meta (ele junta eventos com o mesmo event_id em até 48 horas).
 */
function idDaVenda(email: string, quando: Date) {
  return `compra-${embaralhar(email).slice(0, 24)}-${quando.toISOString().slice(0, 10)}`;
}

export async function enviarCompraMeta({
  email,
  totalCents,
  plano = "pro",
}: {
  email: string;
  totalCents?: number;
  plano?: string;
}) {
  if (!PIXEL || !TOKEN) return;

  const agora = new Date();
  const valor =
    typeof totalCents === "number" && Number.isFinite(totalCents) && totalCents > 0
      ? Math.round(totalCents) / 100
      : VALOR_PRO;

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 4000);
    const resposta = await fetch(`https://graph.facebook.com/${VERSAO_API}/${PIXEL}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: ac.signal,
      body: JSON.stringify({
        access_token: TOKEN,
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(agora.getTime() / 1000),
            event_id: idDaVenda(email, agora),
            action_source: "website",
            event_source_url: "https://smartdayz.com",
            user_data: { em: [embaralhar(email)] },
            custom_data: { currency: "BRL", value: valor, content_name: plano },
          },
        ],
      }),
    });
    clearTimeout(t);

    if (!resposta.ok) {
      // Fica no log pra dar pra conferir depois da primeira venda real. Nunca loga o token.
      console.warn("[meta-capi] recusado:", resposta.status, (await resposta.text()).slice(0, 500));
    }
  } catch {
    // Medição nunca derruba o fluxo: se o Meta estiver fora do ar, a assinatura já foi
    // liberada antes desta chamada e a pessoa não perde nada.
  }
}
