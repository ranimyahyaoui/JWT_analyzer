export default function MetaInfo({ meta }) {
  if (!meta) return null;
  const items = [
    { label: "Longueur", value: meta.length !== undefined ? `${meta.length} caractères` : null },
    { label: "Entropie totale", value: meta.entropyBitsTotal !== undefined ? `${meta.entropyBitsTotal} bits` : null },
    { label: "Entropie/caractère", value: meta.entropyPerChar !== undefined ? `${meta.entropyPerChar} bits` : null },
    { label: "Catégories de caractères", value: meta.charsetClasses !== undefined ? `${meta.charsetClasses} / 4` : null },
  ].filter((i) => i.value !== null);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-lg bg-slate-800/60 p-3 text-center">
          <div className="text-xs text-slate-400">{item.label}</div>
          <div className="font-semibold text-slate-100 mt-1">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
