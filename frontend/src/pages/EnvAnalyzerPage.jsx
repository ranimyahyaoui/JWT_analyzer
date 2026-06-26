import { useState, useRef } from "react";
import { analyzeEnv } from "../api.js";
import ResultPanel from "../components/ResultPanel.jsx";

export default function EnvAnalyzerPage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeEnv(content);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setContent(ev.target.result);
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 sm:p-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <label className="text-sm text-slate-300">Contenu du fichier .env</label>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".env,text/plain"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              Importer un fichier
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="bg-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
          placeholder={"JWT_SECRET=changeme\nDB_PASSWORD=12345\nAPI_KEY=abcdef..."}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !content}
          className="self-start bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition px-5 py-2 rounded-lg font-semibold text-sm"
        >
          {loading ? "Analyse en cours..." : "Analyser le fichier"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 flex items-center justify-between flex-wrap gap-2">
            <span className="text-slate-300 text-sm">{result.summary}</span>
            {result.score !== null && (
              <span className="text-sm font-semibold text-slate-100">
                Score global (pire variable) : <span className="text-cyan-400">{result.score}/100</span>
              </span>
            )}
          </div>
          {result.results.map((r, idx) => (
            <ResultPanel
              key={idx}
              title={`Variable : ${r.label}`}
              score={r.score}
              meta={r.meta}
              issues={r.issues}
              recommendations={r.recommendations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
