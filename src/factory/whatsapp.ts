/**
 * WhatsApp do cadastro do teste. Quem guarda e confere é o Lab2AppZ (aba Boas-vindas, de onde a
 * Wanessa manda a mensagem de boas-vindas à mão); aqui só barra erro de digitação antes de criar a
 * conta e manda o número limpo. Não grava no banco do app.
 */

/**
 * Número que dá pra ser WhatsApp: brasileiro com DDD (10 ou 11 dígitos, com ou sem 55 na frente,
 * celular começando com 9) ou de fora com "+" e DDI.
 */
export function whatsappValido(v: string): boolean {
  const bruto = v.trim();
  let d = bruto.replace(/\D/g, "");
  if (bruto.startsWith("+") && !d.startsWith("55")) return d.length >= 8 && d.length <= 15;
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith("55") && d.length >= 12) d = d.slice(2);
  const m = /^([1-9][1-9])(\d{8,9})$/.exec(d);
  if (!m) return false;
  return m[2].length === 8 || m[2].startsWith("9");
}

/** Só o que importa pro número: dígitos e o "+" do começo, no máximo 20 caracteres. */
export function limparWhatsapp(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const limpo = (v.trim().startsWith("+") ? "+" : "") + v.replace(/\D/g, "");
  return limpo.replace("+", "").length >= 8 ? limpo.slice(0, 20) : null;
}

/** Frase do erro, igual em todo SaaS. */
export const ERRO_WHATSAPP = "Confira o WhatsApp: com DDD, como (11) 98765-4321.";
