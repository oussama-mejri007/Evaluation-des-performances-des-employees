"use client";

import { useEffect, useState } from "react";
import ScopedCrudPage from "@/components/ScopedCrudPage";
import api from "@/lib/api";
import { Target, Sparkles, AlertCircle, CheckCircle2, Award } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

export default function ObjectivesPage() {
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
      const res = await api.post(`/objective/generate/${employeeId}`, {});
      setCreatedCount(res.created?.length ?? 0);
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Objectifs SMART
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SMART AI Generator</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Définissez et générez des objectifs professionnels Spécifiques, Mesurables, Atteignables, Réalistes et Temporellement définis.
          </p>
        </div>
      </div>

      {/* AI SMART Generator Card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Générateur d'Objectifs SMART par IA
            </h2>
            <p className="text-xs text-slate-400">
              Sélectionnez un employé pour formuler automatiquement des objectifs adaptés à son poste et compétences.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-300">
              Sélectionner l'Employé <span className="text-cyan-400">*</span>
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
            >
              <option value="" className="bg-[#0f172a] text-slate-400 font-medium">
                -- Choisissez un employé dans la liste --
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#0f172a] text-slate-100 font-medium py-2">
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!employeeId || generating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40 disabled:opacity-40"
          >
            <Sparkles className={`h-4 w-4 ${generating ? "animate-spin text-cyan-300" : ""}`} />
            <span>{generating ? "Génération par l'IA..." : "Générer les Objectifs SMART"}</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm text-rose-300 backdrop-blur-xl">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {createdCount !== null && !error && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>
              {createdCount} objectif{createdCount > 1 ? "s" : ""} SMART généré{createdCount > 1 ? "s" : ""} avec succès ! Vous pouvez les consulter ci-dessous.
            </span>
          </div>
        )}
      </div>

      {/* Main Scoped Component for Objectives */}
      <ScopedCrudPage
        key={refreshKey}
        title="Liste des Objectifs SMART par Collaborateur"
        scopeLabel="Employé"
        scopeOptionsEndpoint="/employee"
        scopeOptionLabel={(e) => `${e.firstName} ${e.lastName}`}
        scopeParamName="employeeId"
        listPath={(id) => `/objective?employeeId=${id}`}
        createEndpoint="/objective"
        columns={[
          {
            key: "title",
            label: "Titre de l'Objectif",
            render: (row) => (
              <span className="font-semibold text-cyan-300">{row.title}</span>
            )
          },
          {
            key: "progress",
            label: "Progression",
            render: (row) => (
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, row.progress || 0)}%` }}
                  />
                </div>
                <span className="font-bold text-xs text-slate-300">{row.progress || 0}%</span>
              </div>
            )
          },
          {
            key: "generatedByAi",
            label: "Généré par IA",
            render: (row) => (
              row.generatedByAi ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-400 border border-purple-500/20">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span>IA</span>
                </span>
              ) : (
                <span className="text-slate-500 text-xs">Manuel</span>
              )
            )
          },
          {
            key: "timeBound",
            label: "Échéance",
            render: (row) => (
              row.timeBound ? (
                <span className="text-xs text-slate-300">
                  {new Date(row.timeBound).toLocaleDateString("fr-FR")}
                </span>
              ) : "-"
            )
          }
        ]}
        formFields={[
          { name: "title", label: "Titre de l'objectif", type: "text", required: true },
          { name: "description", label: "Description globale", type: "textarea", required: true },
          { name: "specific", label: "Spécifique (Ce qui doit être fait)", type: "textarea" },
          { name: "measurable", label: "Mesurable (Indicateurs clés)", type: "textarea" },
          { name: "achievable", label: "Atteignable (Moyens attribués)", type: "textarea" },
          { name: "relevant", label: "Pertinent (Alignement stratégique)", type: "textarea" },
          { name: "timeBound", label: "Date d'échéance", type: "date" },
        ]}
      />
    </div>
  );
}