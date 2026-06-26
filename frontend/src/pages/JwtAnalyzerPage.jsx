import { useState } from "react";
import { analyzeJwt } from "../api.js";
import ResultPanel from "../components/ResultPanel.jsx";

export default function JwtAnalyzerPage() {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeJwt(token, secret || undefined);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 sm:p-6 flex flex-col gap-3">
        <label className="text-sm text-slate-300">Token JWT</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          className="bg-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-600 resize-none break-all"
          placeholder="xxx.yyy.zzz"
        />
        <label className="text-sm text-slate-300 mt-2">
          Secret de signature <span className="text-slate-500">(optionnel)</span>
        </label>
        <input
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="bg-slate-800 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-600"
          placeholder="Votre JWT_SECRET..."
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !token}
          className="self-start bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition px-5 py-2 rounded-lg font-semibold text-sm"
        >
          {loading ? "Analyse en cours..." : "Analyser le token"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <>
          <ResultPanel
            title="Analyse du JWT"
            score={result.score}
            issues={result.issues}
            recommendations={result.recommendations}
            decoded={result.decoded}
          />
          {result.secretAnalysis && (
            <ResultPanel
              title="Analyse détaillée du secret de signature"
              score={result.secretAnalysis.score}
              meta={result.secretAnalysis.meta}
              issues={result.secretAnalysis.issues}
              recommendations={result.secretAnalysis.recommendations}
            />
          )}
        </>
      )}
    </div>
  );
}
