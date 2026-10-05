import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SuporteWhatsApp } from "@/factory/SuporteWhatsApp";
import { Medicao } from "@/components/medicao";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const appName = process.env.APP_NAME ?? "SmartDayZ";

const title = `${appName}: seu dia, com direção`;
const description =
  "Organize tarefas, enxergue urgência e importância e monte o dia com a matriz de Eisenhower e o seu pico de energia. A decisão final é sempre sua.";

export const metadata: Metadata = {
  // Domínio de produção fixo: og:image precisa de URL absoluta que abra fora do servidor.
  metadataBase: new URL("https://smartdayz.com"),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: appName,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  // PWA: o mesmo manifest do app (/app), para instalar também a partir da landing.
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: appName, statusBarStyle: "default" },
  // Verificação de domínio do Google (Search Console) e da Meta, lidas do ambiente na hora
  // do build. Sem valor, a tag não sai (nada de content vazio).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.META_DOMAIN_VERIFICATION
      ? { "facebook-domain-verification": process.env.META_DOMAIN_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <SuporteWhatsApp produto={appName} />
        <Medicao />
      </body>
    </html>
  );
}
