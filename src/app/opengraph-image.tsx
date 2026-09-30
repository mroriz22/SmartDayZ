import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Imagem de compartilhar da home (1200x630): marinho e laranja da logo. */
export const alt = "SmartDayZ: seu dia, com direção";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const icone = await readFile(
    join(process.cwd(), "public/icons/icon-512.png"),
  );
  const iconeSrc = `data:image/png;base64,${icone.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#0b1a40",
        color: "#f6f7f9",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconeSrc}
          width={96}
          height={96}
          alt=""
          style={{ borderRadius: 24 }}
        />
        <div style={{ display: "flex", fontSize: 48, fontWeight: 700 }}>
          SmartDayZ
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          Seu dia, com direção.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#e4e7ec",
            lineHeight: 1.4,
          }}
        >
          Tarefas pela matriz de Eisenhower e pelo seu pico de energia. A
          decisão final é sempre sua.
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            width: 64,
            height: 8,
            borderRadius: 4,
            background: "#fb7915",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#fb7915",
            fontWeight: 700,
          }}
        >
          smartdayz.com
        </div>
      </div>
    </div>,
    size,
  );
}
