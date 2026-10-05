import { NextResponse } from "next/server";

/**
 * Números públicos da medição de anúncio, para a agenda (/app).
 *
 * A agenda é um HTML estático (public/agenda.html) e não recebe as variáveis
 * NEXT_PUBLIC_* do build, então pergunta aqui. Nada disso é segredo: são os mesmos
 * números que o pixel e a tag mostram no HTML das páginas públicas.
 *
 * Sem as variáveis, devolve tudo vazio e a agenda não carrega script nenhum.
 */
export function GET() {
  return NextResponse.json(
    {
      pixelMeta: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
      tagGoogle: process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? "",
      conversaoCadastroGoogle: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO_CADASTRO ?? "",
    },
    { headers: { "cache-control": "public, max-age=300" } },
  );
}
