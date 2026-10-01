import type { IconName } from "../components/ui/Icon";

/**
 * Registo dos assets 3D (Claymorphism). Ficheiros em /public/assets/3d/<name>.webp e <name>@2x.webp.
 * Orçamento data-lean: ≤ 12 KB por ficheiro @1x, ≤ 25 KB @2x.
 * `fallback` é o ícone SVG mostrado se o asset falhar (offline, 404, rede lenta).
 */
export const ASSETS_3D = {
  "kombi-student": { fallback: "book" },
  "creator-sebentas": { fallback: "seal" },
  "diagnostic-target": { fallback: "target" },
  "xp-bolt": { fallback: "bolt" },
  "trophy-complete": { fallback: "trophy" },
  "shield-verified": { fallback: "shield" },
  "document-upload": { fallback: "file" },
  "wallet-express": { fallback: "wallet" },
  "studio-draft": { fallback: "edit" },
  "kombi-celebrate": { fallback: "trophy" },
  "badge-caloiro": { fallback: "seal" },
  "streak-flame": { fallback: "flame" },
  "challenge-bolt": { fallback: "bolt" },
  "cover-direito": { fallback: "scale" },
  "cover-economia": { fallback: "chart" },
  "cover-engenharia": { fallback: "cpu" },
  "cover-saude": { fallback: "heart" },
  "figure-porto-luanda": { fallback: "chart" },
  "figure-escassez": { fallback: "cpu" },
  "sms-code": { fallback: "phone" },
  "kombi-offline": { fallback: "cloud" },

} as const satisfies Record<string, { fallback: IconName }>;

export type Asset3DName = keyof typeof ASSETS_3D;

export const asset3DSrc = (name: Asset3DName, density: 1 | 2 = 1) =>
  `/assets/3d/${name}${density === 2 ? "@2x" : ""}.webp`;
