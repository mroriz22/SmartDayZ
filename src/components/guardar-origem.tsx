"use client";

import { useEffect } from "react";
import { guardarOrigem } from "@/lib/origem";

/**
 * Anota de onde a visita veio (lib/origem.ts). Não desenha nada.
 *
 * Fica no layout raiz, e não dentro de components/medicao.tsx, porque a origem do cadastro
 * vale mesmo sem pixel configurado: é um cookie nosso, não manda nada pra ninguém.
 */
export function GuardarOrigem() {
  useEffect(() => {
    guardarOrigem();
  }, []);
  return null;
}
