import { useState } from "react";
import { analyzeSecret } from "../api.js";
import ResultPanel from "../components/ResultPanel.jsx";

export default function SecretAnalyzerPage() {
  const [secret, setSecret] = useState("");
  const [label, setLabel] = useState("JWT_SECRET");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSecret(secret, label);
      setResult(data);
    } 
    catch (e) {
      setError(e.message);
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 sm:p-6 flex flex-col gap-3">
        <label className="text-sm text-slate-300">Nom de la variable</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-600"
          placeholder="SECRET"
        />
        <label className="text-sm text-slate-300 mt-2">Secret à analyser</label>
        <textarea
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          rows={3}
          className="bg-slate-800 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
          placeholder="........."
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !secret}
          className="self-start bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition px-5 py-2 rounded-lg font-semibold text-sm"
        >
          {loading ? "Analyse en cours..." : "Analyser"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <ResultPanel
          title={`Analyse : ${result.label}`}
          score={result.score}
          meta={result.meta}
          issues={result.issues}
          recommendations={result.recommendations}
        />
      )}
    </div>
  );
}
