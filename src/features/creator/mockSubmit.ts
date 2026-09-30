import type { SubmitCreatorApplication } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Simula o envio (progresso + protocolo) para desenvolver sem back-end. */
export const mockSubmitCreatorApplication: SubmitCreatorApplication = async (app, onProgress) => {
  for (const p of [15, 45, 80, 100]) {
    await wait(250);
    onProgress(p);
  }
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return {
    protocol: `PROT-CRE-${new Date().getFullYear()}-${suffix}`,
    slaHours: app.sampleFile ? 4 : 24,
  };
};
