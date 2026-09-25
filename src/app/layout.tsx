import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SuporteWhatsApp } from "@/factory/SuporteWhatsApp";

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

export const metadata: Metadata = {
  title: `${appName} — seu dia, com direção`,
  description:
    "Organize tarefas, enxergue urgência e importância e monte o dia com a matriz de Eisenhower e o seu pico de energia. A decisão final é sempre sua.",
  // PWA: o mesmo manifest do app (/app), para instalar também a partir da landing.
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: appName, statusBarStyle: "default" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <SuporteWhatsApp produto={appName} />
      </body>
    </html>
  );
}
