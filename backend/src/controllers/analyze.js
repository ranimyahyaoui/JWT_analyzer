import { analyzeSecretStrength } from "../services/secretStrength.js";
import { analyzeJwt } from "../services/jwtAnalyzer.js";
import { analyzeEnvFile } from "../services/envAnalyzer.js";

const analyzeSecret=(req, res) => {
  const { secret, label } = req.body || {};
  if (typeof secret !== "string") {
    return res.status(400).json({ error: "Le champ 'secret' (string) est requis." });
  }
  const result = analyzeSecretStrength(secret, { label: label || "Secret" });
  res.json(result);
}
const analyzeJWT=(req, res) => {
  const { token, secret } = req.body || {};
  if (typeof token !== "string" || token.trim().length === 0) {
    return res.status(400).json({ error: "Le champ 'token' (string) est requis." });
  }
  const result = analyzeJwt(token, { secret });
  res.json(result);
}
const analyzeEnv= (req, res) => {
  const { content } = req.body || {};
  if (typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ error: "Le champ 'content' (string) est requis." });
  }
  const result = analyzeEnvFile(content);
  res.json(result);
}
const health = (req, res) => {
    res.json({
        status: "ok"
    });
};

export {
    analyzeSecret,
    analyzeJWT,
    analyzeEnv,
    health
};