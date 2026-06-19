// Runner for the account ROI report generator.
//
//   node scripts/generate-account-reports.mjs
//
// Boots Vite's SSR module loader so the generator (scripts/gen-reports.tsx) and
// everything it imports — the "@/" alias, TypeScript, TSX, and the @react-pdf
// document — resolve exactly as the Next.js app does, with no extra tooling.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const server = await createServer({
  root: projectRoot,
  configFile: false,
  logLevel: "warn",
  server: { middlewareMode: true },
  resolve: { alias: { "@": projectRoot } },
});

try {
  const mod = await server.ssrLoadModule("/scripts/gen-reports.tsx");
  await mod.run(projectRoot);
} finally {
  await server.close();
}
