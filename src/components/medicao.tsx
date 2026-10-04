"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { visitaMedicao } from "@/lib/medicao";

/**
 * Carrega os contadores de anúncio (pixel do Meta e tag do Google) e avisa os dois
 * quando a pessoa muda de tela.
 *
 * Nada é carregado sem as variáveis preenchidas: enquanto o pixel não existir, este
 * componente não injeta script nenhum e o site fica exatamente como está hoje. É de
 * propósito, pra dev local e conta de teste não sujarem a medição da campanha.
 *
 * IMPORTANTE, e é promessa escrita na Política de Privacidade: as telas internas NÃO
 * mandam visita de página. A agenda (/app) nem passa por aqui: é um HTML estático
 * (public/agenda.html) que só avisa cadastro e clique em assinar, nunca as telas abertas.
 *
 * Por isso os dois scripts são instalados com a visita automática DESLIGADA e cada visita
 * é disparada na mão aqui embaixo, só nas páginas públicas.
 */

const PIXEL_META = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TAG_GOOGLE = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
const CONVERSAO_CADASTRO_GOOGLE = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO_CADASTRO ?? "";

/** Começos de caminho que são a área logada, não a jornada de compra. */
const TELAS_INTERNAS = ["/app", "/dashboard", "/paywall"];

function ehTelaInterna(pathname: string) {
  return TELAS_INTERNAS.some((inicio) => pathname === inicio || pathname.startsWith(`${inicio}/`));
}

function VisitaEmCadaTela() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jaCarregou = useRef(false);

  useEffect(() => {
    // Os scripts entram com strategy afterInteractive, então na primeira passagem eles
    // ainda podem não existir. Um atraso curto evita perder a visita de quem chegou do
    // anúncio, que é justamente a que importa.
    const atraso = jaCarregou.current ? 0 : 800;
    jaCarregou.current = true;

    if (ehTelaInterna(pathname)) return;

    const t = setTimeout(() => visitaMedicao(pathname), atraso);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  return null;
}

export function Medicao() {
  if (!PIXEL_META && !TAG_GOOGLE) return null;

  return (
    <>
      {PIXEL_META ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_META}');`}
        </Script>
      ) : null}

      {TAG_GOOGLE ? (
        <>
          <Script
            id="google-tag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${TAG_GOOGLE}`}
          />
          <Script id="google-tag" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${TAG_GOOGLE}', { send_page_view: false });
window.__conversaoCadastroGoogle = '${CONVERSAO_CADASTRO_GOOGLE}';`}
          </Script>
        </>
      ) : null}

      {/* useSearchParams exige Suspense no App Router, senão a página inteira vira
          renderização sob demanda e a landing perde o cache. */}
      <Suspense fallback={null}>
        <VisitaEmCadaTela />
      </Suspense>
    </>
  );
}
