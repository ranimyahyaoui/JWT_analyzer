const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function post(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur API");
  return data;
}

export function analyzeSecret(secret, label) {
  return post("/analyze/secret", { secret, label });
}

export function analyzeJwt(token, secret) {
  return post("/analyze/jwt", { token, secret });
}

export function analyzeEnv(content) {
  return post("/analyze/env", { content });
}
