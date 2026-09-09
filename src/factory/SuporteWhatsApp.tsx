"use client";

/**
 * Contato de suporte (Amelia Moreira) via WhatsApp.
 *
 * A mensagem já vai preenchida com de onde a pessoa veio: produto, tela e,
 * quando ela está logada, a situação da conta (teste, assinante, expirado) e
 * o e-mail. Isso evita a rodada de "qual é o seu e-mail?" no atendimento.
 *
 * Uso:
 *   <SuporteWhatsApp produto="QueenSitters" />                 // decide sozinho
 *   <SuporteWhatsApp produto="QueenSitters" variante="menu" /> // item de menu
 */

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { ClientAccess } from "./useAccess";

export const SUPORTE_WHATSAPP = "5514981004718";
export const SUPORTE_NOME = "Amelia Moreira";

/** Telas em que a bolinha aparece sozinha: onde a pessoa trava ou paga. */
const TELAS_CRITICAS = [
  "/pricing",
  "/planos",
  "/paywall",
  "/checkout",
  "/assinar",
  "/obrigado",
  "/pagamento",
  "/login",
  "/cadastro",
  "/signup",
  "/erro",
];

/** Nome humano da tela, pra Amelia saber onde a pessoa estava. */
const NOMES_DE_TELA: Record<string, string> = {
  "/": "Início",
  "/pricing": "Planos",
  "/planos": "Planos",
  "/paywall": "Aviso de plano",
  "/checkout": "Pagamento",
  "/assinar": "Pagamento",
  "/obrigado": "Depois da compra",
  "/pagamento": "Pagamento",
  "/login": "Entrar",
  "/cadastro": "Criar conta",
  "/signup": "Criar conta",
  "/dashboard": "Painel",
  "/app": "Painel",
  "/conta": "Minha conta",
  "/configuracoes": "Configurações",
};

function nomeDaTela(pathname: string): string {
  if (NOMES_DE_TELA[pathname]) return NOMES_DE_TELA[pathname];
  const raiz = "/" + (pathname.split("/")[1] ?? "");
  if (NOMES_DE_TELA[raiz]) return NOMES_DE_TELA[raiz];
  const limpo = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!limpo) return "Início";
  return limpo
    .split("/")
    .map((p) => p.replace(/-/g, " "))
    .join(" > ");
}

function ehTelaCritica(pathname: string): boolean {
  return TELAS_CRITICAS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function dataCurta(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

type Situacao = { texto: string; urgente: boolean };

function descreveSituacao(
  autenticado: boolean,
  access: { status: string; plan: string; allowed: boolean; trialEndsAt: string | null; currentPeriodEnd: string | null } | null,
): Situacao {
  if (!autenticado || !access) return { texto: "visitante, ainda sem conta", urgente: false };

  const fimTeste = dataCurta(access.trialEndsAt);
  const fimPlano = dataCurta(access.currentPeriodEnd);

  if (access.status === "trialing" || access.plan === "trial") {
    return {
      texto: fimTeste ? `em teste grátis até ${fimTeste}` : "em teste grátis",
      urgente: !access.allowed,
    };
  }
  if (access.allowed) {
    return {
      texto: fimPlano ? `assinante ativo, renova em ${fimPlano}` : "assinante ativo",
      urgente: false,
    };
  }
  if (access.status === "expired" || access.status === "trial_expired") {
    return { texto: "teste terminou, ainda não assinou", urgente: true };
  }
  if (access.status === "canceled") return { texto: "assinatura cancelada", urgente: true };
  return { texto: "com a conta sem acesso liberado", urgente: true };
}

export function montaMensagem(opts: {
  produto: string;
  tela: string;
  situacao: string;
  email?: string | null;
  nome?: string | null;
}): string {
  const linhas = [
    "Oi, Amelia! Preciso de ajuda.",
    "",
    `Produto: ${opts.produto}`,
    `Tela: ${opts.tela}`,
    `Situação: ${opts.situacao}`,
  ];
  if (opts.nome) linhas.push(`Nome: ${opts.nome}`);
  if (opts.email) linhas.push(`E-mail: ${opts.email}`);
  linhas.push("", "Minha dúvida: ");
  return linhas.join("\n");
}

export function linkSuporte(mensagem: string): string {
  return `https://wa.me/${SUPORTE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

export type SuporteProps = {
  /** Nome do SaaS como a pessoa conhece. */
  produto: string;
  /**
   * "auto"      → bolinha nas telas críticas, nada nas outras (padrão)
   * "flutuante" → bolinha sempre
   * "menu"      → item de lista, pra dentro do menu da conta
   * "linha"     → link discreto, pra rodapé
   */
  variante?: "auto" | "flutuante" | "menu" | "linha";
  /** false em site público: não consulta a conta. */
  comConta?: boolean;
  className?: string;
};

export function SuporteWhatsApp({
  produto,
  variante = "auto",
  comConta = true,
  className,
}: SuporteProps) {
  const pathname = usePathname() ?? "/";
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // A bolinha em "auto" nem aparece fora das telas críticas. Consultar a conta em toda
  // página pública custaria uma requisição por visita de anúncio sem nada na tela, então
  // só perguntamos quem é a pessoa quando o contato vai mesmo ser mostrado.
  const vaiAparecer =
    variante !== "auto" || ehTelaCritica(pathname);

  const [conta, setConta] = useState<{
    autenticado: boolean;
    user: { email: string; name: string } | null;
    access: ClientAccess | null;
  }>({ autenticado: false, user: null, access: null });

  useEffect(() => {
    if (!comConta || !vaiAparecer) return;
    let vivo = true;
    fetch("/api/factory/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo || !d?.authenticated) return;
        setConta({ autenticado: true, user: d.user, access: d.access });
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [comConta, vaiAparecer, pathname]);

  const { autenticado, user, access } = {
    autenticado: conta.autenticado,
    user: conta.user,
    access: conta.access,
  };

  const situacao = useMemo(
    () => descreveSituacao(comConta && autenticado, comConta ? access : null),
    [comConta, autenticado, access],
  );

  const href = useMemo(
    () =>
      linkSuporte(
        montaMensagem({
          produto,
          tela: nomeDaTela(pathname),
          situacao: situacao.texto,
          email: comConta ? user?.email : null,
          nome: comConta ? user?.name : null,
        }),
      ),
    [produto, pathname, situacao.texto, user, comConta],
  );

  const rotulo = `Falar com ${SUPORTE_NOME.split(" ")[0]} no WhatsApp`;

  if (variante === "menu") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-suporte="menu"
      >
        Falar com o suporte
      </a>
    );
  }

  if (variante === "linha") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-suporte="linha"
      >
        Precisa de ajuda? Fale com o suporte no WhatsApp
      </a>
    );
  }

  // Bolinha flutuante. Em "auto" só nas telas onde a pessoa costuma travar.
  if (variante === "auto" && !ehTelaCritica(pathname)) return null;
  if (!montado) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rotulo}
      title={rotulo}
      data-suporte="flutuante"
      className={className}
      style={{
        position: "fixed",
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        zIndex: 60,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        height: "3.25rem",
        padding: "0 1.1rem",
        borderRadius: "999px",
        background: "#25D366",
        color: "#0b2a16",
        fontWeight: 600,
        fontSize: "0.95rem",
        textDecoration: "none",
        boxShadow: "0 6px 20px rgba(0,0,0,.22)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.03s.87 2.35 1 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
      Suporte
    </a>
  );
}

export default SuporteWhatsApp;
