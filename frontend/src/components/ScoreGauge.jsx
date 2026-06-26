export default function ScoreGauge({ score }) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let color = "#dc2626"; 
  if (score >= 80) color = "#16a34a";
  else if (score >= 60) color = "#65a30d";
  else if (score >= 40) color = "#ca8a04"; 
  else if (score >= 20) color = "#ea580c"; 

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.6s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="-mt-20 flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-slate-400">/ 100</span>
      </div>
    </div>
  );
}
