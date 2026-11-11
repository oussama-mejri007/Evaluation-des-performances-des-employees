"use client";

import { useEffect, useState } from "react";
import CrudPage from "@/components/CrudPage";
import api from "@/lib/api";
import { Sparkles, BrainCircuit, AlertCircle, CheckCircle2, Award } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Gap {
  skillName: string;
  currentLevel: number;
  expectedLevel: number;
}

export default function TrainingRecommendationsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message?: string; gaps?: Gap[]; created?: any[] } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.get("/employee").then(setEmployees).catch((e) => setError(e.message));
  }, []);

  async function handleGenerate() {
    if (!employeeId) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post(`/training-recommendation/generate/${employeeId}`, {});
      setResult(res);
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
              Recommandations de Formation par IA
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Skill Gap AI</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Détectez automatiquement les écarts de compétences et suggérez des modules de formation adaptés.
          </p>
        </div>
      </div>

      {/* AI Analysis Generator Card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 p-6 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Analyseur d'Écarts de Compétences (Skill Gap Analysis)
            </h2>
            <p className="text-xs text-slate-400">
              Sélectionnez un employé pour comparer son profil au poste occupé et générer des recommandations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-300">Employé à analyser</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0f172a] px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40 disabled:opacity-40"
          >
            <Sparkles className={`h-4 w-4 ${generating ? "animate-spin text-cyan-300" : ""}`} />
            <span>{generating ? "Analyse IA en cours..." : "Lancer l'Analyse & Générer"}</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm text-rose-300 backdrop-blur-xl">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="rounded-2xl border border-white/10 bg-[#0d1220] p-5 space-y-4 shadow-inner">
            {result.message && <p className="text-sm font-medium text-slate-300">{result.message}</p>}

            {result.gaps && result.gaps.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Écarts Détectés ({result.gaps.length})</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.gaps.map((gap, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 border border-white/5 text-xs">
                      <span className="font-semibold text-white">{gap.skillName}</span>
                      <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-rose-400 font-bold border border-rose-500/20">
                        Niveau {gap.currentLevel}/5 (attendu {gap.expectedLevel}/5)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.created && result.created.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{result.created.length} suggestions de formation ont été générées et enregistrées ci-dessous.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Crud Component */}
      <CrudPage
        key={refreshKey}
        title="Répertoire des Recommandations de Formation"
        endpoint="/training-recommendation"
        columns={[
          {
            key: "employee",
            label: "Employé",
            render: (row) =>
              row.employee ? (
                <span className="font-semibold text-white">
                  {row.employee.firstName} {row.employee.lastName}
                </span>
              ) : (
                "-"
              ),
          },
          { 
            key: "title", 
            label: "Intitulé de la Formation",
            render: (row) => (
              <span className="font-semibold text-cyan-300">{row.title}</span>
            )
          },
          { key: "reason", label: "Justification RH & IA" },
        ]}
        formFields={[
          {
            name: "employeeId",
            label: "Employé",
            type: "select",
            required: true,
            optionsEndpoint: "/employee",
            optionLabel: (e) => `${e.firstName} ${e.lastName}`,
          },
          { name: "title", label: "Titre de la formation", type: "text", required: true },
          { name: "reason", label: "Raison de la recommandation", type: "textarea", required: true },
        ]}
      />
    </div>
  );
}