import { useState } from "react";
import Tabs from "./components/Tabs.jsx";
import SecretAnalyzerPage from "./pages/SecretAnalyzerPage.jsx";
import JwtAnalyzerPage from "./pages/JwtAnalyzerPage.jsx";
import EnvAnalyzerPage from "./pages/EnvAnalyzerPage.jsx";

const TABS = [
  { id: "secret", label: " Secret" },
  { id: "jwt", label: " JWT complet" },
  { id: "env", label: " Fichier .env" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("secret");

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-100">JWT Analyzer</h1>
            <p className="text-xs text-slate-400">Analyse de secrets + JWT + fichier .env</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {activeTab === "secret" && <SecretAnalyzerPage />}
        {activeTab === "jwt" && <JwtAnalyzerPage />}
        {activeTab === "env" && <EnvAnalyzerPage />}
      </main>

      <footer className="text-center text-xs text-slate-600 py-6">
        Pour des raisons de sécurité et confidentialité ,pas de  donnée analysée stockée par ce serveur.
      </footer>
    </div>
  );
}
