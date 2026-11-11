"use client";

import { useEffect, useState } from "react";
import ScopedCrudPage from "@/components/ScopedCrudPage";
import api from "@/lib/api";
import { Sparkles, Brain, AlertCircle, CheckCircle2 } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

export default function CareerRecommendationsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCount, setCreatedCount] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.get("/employee").then(setEmployees).catch((e) => setError(e.message));
  }, []);

  async function handleGenerate() {
    if (!employeeId) return;
    setGenerating(true);
    setError(null);
    setCreatedCount(null);
    try {
      const res = await api.post(`/career-recommendation/generate/${employeeId}`, {});
      setCreatedCount(res.created?.length ?? 0);
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Recommandations d'Évolution de Carrière
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-400 border border-purple-500/20">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Career Plan AI</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Proposez des trajectoires de promotion et plans de progression personnalisés par l'IA.
          </p>
        </div>
      </div>

      {/* AI Generator Card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/50 p-6 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Générateur de Recommandation de Carrière
            </h2>
            <p className="text-xs text-slate-400">
              Analyse le poste actuel, l'historique d'évaluations et suggère des ouvertures de poste réalistes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-300">Employé concerné</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0f172a] px-4 py-2.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="" className="bg-[#0f172a] text-slate-400">
                Sélectionner un employé...
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#0f172a] text-slate-200">
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!employeeId || generating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-purple-500/40 disabled:opacity-40"
          >
            <Sparkles className={`h-4 w-4 ${generating ? "animate-spin text-cyan-300" : ""}`} />
            <span>{generating ? "Génération en cours..." : "Générer le Plan de Carrière"}</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm text-rose-300 backdrop-blur-xl">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {createdCount !== null && !error && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{createdCount} proposition(s) d'évolution de carrière ont été générée(s) avec succès.</span>
          </div>
        )}
      </div>

      {/* Main Scoped Component */}
      <ScopedCrudPage
        key={refreshKey}
        title="Plans de Carrière par Collaborateur"
        scopeLabel="Employé"
        scopeOptionsEndpoint="/employee"
        scopeOptionLabel={(e) => `${e.firstName} ${e.lastName}`}
        scopeParamName="employeeId"
        listPath={(id) => `/career-recommendation?employeeId=${id}`}
        createEndpoint="/career-recommendation"
        columns={[
          {
            key: "suggestedRole",
            label: "Poste Suggeré",
            render: (row) => (
              <span className="font-semibold text-purple-300">{row.suggestedRole}</span>
            )
          },
          { key: "progressionPlan", label: "Plan de Progression & Étapes" },
        ]}
        formFields={[
          { name: "suggestedRole", label: "Poste suggéré", type: "text", required: true },
          { name: "progressionPlan", label: "Plan de progression", type: "textarea", required: true },
        ]}
      />
    </div>
  );
}