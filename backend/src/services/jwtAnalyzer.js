import { analyzeSecretStrength } from "./secretStrength.js";
import { SENSITIVE_PAYLOAD_KEYS } from "../utils/knownWeakSecrets.js";

function base64UrlDecode(str) {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const decoded = Buffer.from(padded + pad, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export function decodeJwt(token) {
  const parts = token.trim().split(".");
  if (parts.length < 2) return null;
  const header = base64UrlDecode(parts[0]);
  const payload = base64UrlDecode(parts[1]);
  const signature = parts[2] || "";
  return { header, payload, signature, raw: { header: parts[0], payload: parts[1] } };
}

function findSensitiveKeys(obj, foundKeys = [], prefix = "") {
  if (!obj || typeof obj !== "object") return foundKeys;
  for (const key of Object.keys(obj)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_PAYLOAD_KEYS.some((s) => lower.includes(s))) {
      foundKeys.push(prefix + key);
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      findSensitiveKeys(obj[key], foundKeys, prefix + key + ".");
    }
  }
  return foundKeys;
}


export function analyzeJwt(token, { secret } = {}) {
  const issues = [];
  const recommendations = [];
  let score = 100;

  const decoded = decodeJwt(token);
  if (!decoded || !decoded.header) {
    return {
      score: 0,
      maxScore: 100,
      issues: [{ severity: "critical", title: "Token invalide", detail: "Impossible de décoder ce JWT. c'est ca le format (header.payload.signature)." }],
      recommendations: ["Vérifiez que le token est un JWT valide encodé en base64url avec 3 parties séparées par des points."],
      decoded: null,
    };
  }

  const { header, payload } = decoded;
  const alg = header?.alg;

  if (alg && alg.toLowerCase() === "none") {
    issues.push({
      severity: "critical",
      title: "Algorithme 'none' utilisé",
      detail: "Le JWT n'est pas signé du tout (alg: none). N'importe qui peut forger un token valide.",
    });
    recommendations.push("Interdisez explicitement l'algorithme 'none'.");
    score = 0;
  }

  if (alg && /^HS/.test(alg) === false && /^RS|ES|PS/.test(alg) === false && alg.toLowerCase() !== "none") {
    issues.push({
      severity: "medium",
      title: "Algorithme non standard",
      detail: `Algorithme détecté : ${alg}. Vérifiez qu'il est bien supporté et sécurisé côté serveur.`,
    });
  }

  if (!payload?.exp) {
    issues.push({
      severity: "high",
      title: "Pas de claim 'exp' (expiration)",
      detail: "Ce token n'expire jamais. S'il est volé, il reste valide indéfiniment.",
    });
    recommendations.push("Ajoutez un claim 'exp' avec une durée de vie courte.");
    score -= 20;
  } else {
    const now = Math.floor(Date.now() / 1000);
    const lifetimeSeconds = payload.exp - (payload.iat || now);
    const lifetimeHours = lifetimeSeconds / 3600;
    if (payload.exp < now) {
      issues.push({
        severity: "info",
        title: "Token expiré",
        detail: "Ce token est déjà expiré.",
      });
    }
    if (lifetimeHours > 24) {
      issues.push({
        severity: "medium",
        title: "Durée de vie très longue",
        detail: `Durée de vie estimée : ${lifetimeHours.toFixed(1)} heures.`,
      });
      recommendations.push("Réduisez la durée de vie de l'access token.");
      score -= 10;
    }
  }

  if (!payload?.iat) {
    issues.push({
      severity: "low",
      title: "Pas de claim 'iat' (date d'émission)",
      detail: "Recommandé pour le suivi et l'invalidation des tokens anciens.",
    });
    score -= 3;
  }

  if (!payload?.aud) {
    issues.push({
      severity: "low",
      title: "Pas de claim 'aud' (audience)",
      detail: "Sans 'aud', un token émis pour un service pourrait être réutilisé sur un autre.",
    });
    recommendations.push("Ajoutez un claim 'aud' et vérifiez-le côté serveur.");
    score -= 5;
  }
  if (!payload?.iss) {
    issues.push({
      severity: "low",
      title: "Pas de claim 'iss' (émetteur)",
      detail: "Recommandé pour identifier la source du token, surtout en architecture multi-services.",
    });
    score -= 3;
  }

  const sensitiveKeys = findSensitiveKeys(payload);
  if (sensitiveKeys.length > 0) {
    issues.push({
      severity: "critical",
      title: "Données sensibles dans le payload",
      detail: `Champs détectés : ${sensitiveKeys.join(", ")}. Le payload JWT est lisible par n'importe qui (base64, pas chiffré).`,
    });
    recommendations.push("Ne stockez jamais de mots de passe, clés ou données sensibles dans le payload JWT.");
    score -= 25;
  }

  let secretAnalysis = null;
  if (secret && alg && /^HS/.test(alg)) {
    secretAnalysis = analyzeSecretStrength(secret, { label: "Secret de signature (HS*)" });
    if (secretAnalysis.score < 50) {
      issues.push({
        severity: secretAnalysis.score < 30 ? "critical" : "high",
        title: "Secret de signature faible",
        detail: `Le secret utilisé pour signer avec ${alg} obtient un score de ${secretAnalysis.score}/100. Voir l'analyse détaillée du secret.`,
      });
      recommendations.push(...secretAnalysis.recommendations);
    }
    score = Math.min(score, secretAnalysis.score + 10);
  } else if (alg && /^RS|ES|PS/.test(alg)) {
    recommendations.push("Bon choix pour algorithme");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const severityOrder = ["critical", "high", "medium", "low"];
  const worst = severityOrder.find((s) => issues.some((i) => i.severity === s));
  const caps = { critical: 30, high: 50, medium: 70, low: 90 };
  if (worst && caps[worst] < score) score = caps[worst];

  if (issues.length === 0) {
    recommendations.push("Structure du JWT conforme aux bonnes pratiques.");
  }

  return {
    score,
    maxScore: 100,
    issues,
    recommendations,
    decoded: { header, payload },
    secretAnalysis,
  };
}
