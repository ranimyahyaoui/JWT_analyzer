export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${
            active === tab.id
              ? "bg-cyan-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
