"use client";

import Link from "next/link";
import { eventoMedicao, type EventoMedicao } from "@/lib/medicao";

/**
 * Link que avisa a medição antes de sair. Igual a um link comum no resto.
 *
 * Existe porque a landing e a página de planos são renderizadas no servidor e não podem
 * ter clique próprio. Este pedacinho é a única parte delas que roda no navegador.
 *
 * Por padrão mede `clique_testar` (botões de começar / testar grátis): quantas pessoas o
 * texto convence a ir até o onboarding ou o cadastro. No botão de assinar, use
 * `evento="checkout_iniciado"`.
 */
export function CtaMedido({
  href,
  className,
  evento = "clique_testar",
  dados,
  children,
}: {
  href: string;
  className?: string;
  evento?: EventoMedicao;
  dados?: { valor?: number; plano?: string };
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => eventoMedicao(evento, dados)}>
      {children}
    </Link>
  );
}
