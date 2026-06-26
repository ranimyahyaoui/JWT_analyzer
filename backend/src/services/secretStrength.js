import { KNOWN_WEAK_SECRETS, WEAK_PATTERNS } from "../utils/knownWeakSecrets.js";

function shannonEntropyBits(str) {
  if (!str) return 0;
  const freq = {};
  for (const ch of str) 
    freq[ch] = (freq[ch] || 0) + 1;
  let entropy = 0;
  const len = str.length;
  for (const ch in freq) {
    const p = freq[ch] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy * len;
}

function charsetScore(str) {
  let classes = 0;
  if (/[a-z]/.test(str)) 
    classes++;
  if (/[A-Z]/.test(str)) 
    classes++;
  if (/[0-9]/.test(str)) 
    classes++;
  if (/[^a-zA-Z0-9]/.test(str)) 
    classes++;
  return classes; 
}

function lengthScore(len) {
  if (len < 16) return 0;
  if (len < 32) return 15;
  if (len < 64) return 25;
  return 30;
}

function isKnownWeak(secret) {
  const lower = secret.toLowerCase().trim();
  return KNOWN_WEAK_SECRETS.some(
    (w) => lower === w.toLowerCase() || lower.includes(w.toLowerCase())
  );
}

function matchedWeakPatterns(secret) {
  return WEAK_PATTERNS.filter(
    (p) => p.regex.test(secret)).map((p) => p.label
  );
}


export function analyzeSecretStrength(secret, { label = "JWT_SECRET" } = {}) {
  const issues = [];
  const recommendations = [];
  let score = 0;

  if (!secret || typeof secret !== "string" || secret.trim().length === 0) {
    return {
      label,
      score: 0,
      maxScore: 100,
      issues: [{ severity: "critical", title: "Secret vide", detail: "pas de valeur pour secret." }],
      recommendations: ["donner valeur."],
      meta: {},
    };
  }

  const len = secret.length;
  const entropyBits = shannonEntropyBits(secret);
  const classes = charsetScore(secret);

  const lScore = lengthScore(len);
  score += lScore;
  if (len < 16) {
    issues.push({
      severity: "critical",
      title: "Secret trop court",
      detail: `Longueur actuelle : ${len} caractères.`,
    });
    recommendations.push("Un secret JWT (HS256) doit faire au moins 32 caractères.");
  } else if (len < 32) {
    issues.push({
      severity: "high",
      title: "Secret trop court pour HS256",
      detail: `Longueur actuelle : ${len} caractères. Il faut au moins 32 caractères  pour éviter au brute-force.`,
    });
    recommendations.push("Augmentez la longueur du secret à au moins 32 caractères.");
  } else if (len < 64) {
    issues.push({
      severity: "low",
      title: "Longueur correcte ",
      detail: `Longueur actuelle : ${len} caractères. 64 caractères .Bonne sécurité.`,
    });
  }

  const charsetPts = Math.round((classes / 4) * 25);
  score += charsetPts;
  if (classes <= 1) {
    issues.push({
      severity: "critical",
      title: "Charset très limité",
      detail: "Le secret n'utilise qu'une seule catégorie de caractères.",
    });
    recommendations.push("Combinez majuscules, minuscules, chiffres et symboles.");
  } else if (classes <= 2) {
    issues.push({
      severity: "medium",
      title: "Diversité de caractères insuffisante",
      detail: "Seulement 2 catégories de caractères détectées.",
    });
    recommendations.push("Préférez un secret encodé en base64.");
  }

  const weak = isKnownWeak(secret);
  const matchedPatterns = matchedWeakPatterns(secret);
  if (weak) {
    issues.push({
      severity: "critical",
      title: "Secret connu",
      detail: `Ce secret correspond à une valeur par défaut :${weak} .Evitez!!!!`,
    });
    recommendations.push("Remplacez immédiatement ce secret!!");
  } else {
    score += 20;
  }

  if (matchedPatterns.length > 0) {
    issues.push({
      severity: "high",
      title: "Motif prévisible détecté",
      detail: `Le secret correspond à un pattern prévisible : ${matchedPatterns.join(", ")}.`,
    });
    recommendations.push("Évitez les motifs répétitifs ou les séquences");
  } else if (!weak) {
    score += 0; 
  }

  const entropyPerChar = len > 0 ? entropyBits / len : 0;
  if (entropyPerChar >= 3.5) {
    score += 15;
  } else if (entropyPerChar >= 2.5) {
    score += 8;
    issues.push({
      severity: "low",
      title: "Entropie modérée",
      detail: `Entropie estimée : ${entropyPerChar.toFixed(2)} bits/caractère. Le secret contient des répétitions.`,
    });
  } else {
    issues.push({
      severity: "medium",
      title: "Faible entropie",
      detail: `Entropie estimée : ${entropyPerChar.toFixed(2)} bits/caractère. Le secret est trop prévisible.`,
    });
    recommendations.push("évitez les secret qui sont trop prévisibles.");
  }

  const looksLikeWord = /^[a-zA-Z]+$/.test(secret) && secret.length < 40;
  if (looksLikeWord) {
    issues.push({
      severity: "medium",
      title: "Ressemble à un mot ou une phrase",
      detail: "Le secret semble composé uniquement de lettres.",
    });
    recommendations.push("Évitez les phrases ou mots, même longs.");
  } else {
    score += 10;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const severityOrder = ["critical", "high", "medium", "low"];
  const worst = severityOrder.find((s) => issues.some((i) => i.severity === s));
  const caps = { critical: 30, high: 50, medium: 70, low: 90 };
  if (worst && caps[worst] < score) {
    score = caps[worst];
  }

  if (issues.length === 0) {
    recommendations.push("Aucun problème détecté.");
  }

  return {
    label,
    score,
    maxScore: 100,
    issues,
    recommendations,
    meta: {
      length: len,
      entropyBitsTotal: Math.round(entropyBits),
      entropyPerChar: Number(entropyPerChar.toFixed(2)),
      charsetClasses: classes,
    },
  };
}
