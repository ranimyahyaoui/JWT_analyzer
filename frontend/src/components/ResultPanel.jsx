import ScoreGauge from "./ScoreGauge.jsx";
import IssueList from "./IssueList.jsx";
import RecommendationList from "./RecommendationList.jsx";
import MetaInfo from "./MetaInfo.jsx";

export default function ResultPanel({ title, score, meta, issues, recommendations, decoded }) {
  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100">{title}</h3>
        <ScoreGauge score={score} />
      </div>

      <MetaInfo meta={meta} />

      {decoded && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-800/60 p-3 overflow-auto">
            <div className="text-xs text-slate-400 mb-1">Header</div>
            <pre className="text-xs text-cyan-300 whitespace-pre-wrap break-all">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-3 overflow-auto">
            <div className="text-xs text-slate-400 mb-1">Payload</div>
            <pre className="text-xs text-amber-300 whitespace-pre-wrap break-all">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Problèmes détectés</h4>
        <IssueList issues={issues} />
      </div>

      <RecommendationList recommendations={recommendations} />
    </div>
  );
}
