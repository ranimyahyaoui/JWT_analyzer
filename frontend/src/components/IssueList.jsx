const SEVERITY_STYLES = {
  critical: { bg: "bg-red-950/40", border: "border-red-600", text: "text-red-400", label: "Critique" },
  high: { bg: "bg-orange-950/40", border: "border-orange-600", text: "text-orange-400", label: "Élevé" },
  medium: { bg: "bg-yellow-950/40", border: "border-yellow-600", text: "text-yellow-400", label: "Moyen" },
  low: { bg: "bg-blue-950/40", border: "border-blue-600", text: "text-blue-400", label: "Faible" },
  info: { bg: "bg-slate-800/40", border: "border-slate-600", text: "text-slate-400", label: "Info" },
};

export default function IssueList({ issues = [] }) {
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-green-600 bg-green-950/30 p-4 text-green-400">
        Aucun problème détecté.
      </div>
    );
  }

  const sorted = [...issues].sort((a, b) => {
    const order = ["critical", "high", "medium", "low", "info"];
    return order.indexOf(a.severity) - order.indexOf(b.severity);
  });

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((issue, idx) => {
        const style = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.info;
        return (
          <div key={idx} className={`rounded-lg border ${style.border} ${style.bg} p-3 sm:p-4`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="font-semibold text-sm sm:text-base">{issue.title}</h4>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${style.text} border ${style.border}`}>
                {style.label}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">{issue.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
