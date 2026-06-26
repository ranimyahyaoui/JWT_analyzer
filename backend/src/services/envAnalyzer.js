import { analyzeSecretStrength } from "./secretStrength.js";

const SECRET_KEY_PATTERN = /(secret|token|key|password|pwd|api_key|apikey|auth|credential|private)/i;


export function analyzeEnvFile(content) {
  const lines = content.split("\n");
  const results = [];
  let globalScore = 100;
  let analyzedCount = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    value = value.replace(/^["']/, "").replace(/["']$/, "");

    if (!SECRET_KEY_PATTERN.test(key)) continue;
    if (!value) continue;

    analyzedCount++;
    const analysis = analyzeSecretStrength(value, { label: key });
    results.push(analysis);
    globalScore = Math.min(globalScore, analysis.score);
  }

  if (analyzedCount === 0) {
    return {
      score: null,
      analyzedCount: 0,
      results: [],
      summary: "Aucune variable ressemblant à un secret n'a été trouvée dans ce fichier .env.",
    };
  }

  return {
    score: globalScore,
    analyzedCount,
    results,
    summary: `${analyzedCount} variable(s) sensible(s) analysée(s).`,
  };
}
