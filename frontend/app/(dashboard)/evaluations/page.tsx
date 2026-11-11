"use client";

import { useState } from "react";
import CrudPage from "@/components/CrudPage";
import api from "@/lib/api";
import { Award, Sparkles, AlertCircle } from "lucide-react";

export default function EvaluationsPage() {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Fiches d'Évaluation de Performance
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/20">
              <Award className="h-3.5 w-3.5 text-cyan-400" />
              <span>Évaluation 360°</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Saisissez les évaluations et générez automatiquement la synthèse des forces et axes d'amélioration par IA.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-300 backdrop-blur-xl">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <CrudPage
        title="Répertoire des Évaluations"
        endpoint="/evaluation"
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
            key: "campaign",
            label: "Campagne",
            render: (row) =>
              row.campaign ? (
                <span className="font-semibold text-cyan-300">{row.campaign.name}</span>
              ) : (
                "-"
              ),
          },
          {
            key: "type",
            label: "Type",
            render: (row) => (
              <span className="rounded-md bg-white/5 px-2 py-1 text-xs font-bold text-slate-300 border border-white/10">
                {row.type === "SELF" ? "Auto-évaluation" : "Manager"}
              </span>
            ),
          },
          {
            key: "score",
            label: "Note",
            render: (row) =>
              row.score !== undefined ? (
                <span className="font-extrabold text-sm text-emerald-400">{row.score} / 20</span>
              ) : (
                "-"
              ),
          },
          {
            key: "managerComment",
            label: "Commentaire Manager",
            render: (row) =>
              row.managerComment ? (
                <span className="block max-w-xs text-xs text-slate-300 truncate" title={row.managerComment}>
                  {row.managerComment}
                </span>
              ) : (
                <span className="text-slate-500 text-xs">-</span>
              ),
          },
          {
            key: "aiSummary",
            label: "Synthèse IA",
            render: (row) =>
              row.aiSummary ? (
                <span className="block max-w-xs text-xs text-slate-200 line-clamp-2">{row.aiSummary}</span>
              ) : (
                <span className="text-slate-500 text-xs italic">Non généré</span>
              ),
          },
          {
            key: "aiStrengths",
            label: "Points Forts (IA)",
            render: (row) =>
              row.aiStrengths ? (
                <span className="block max-w-xs text-xs text-emerald-300 line-clamp-2">{row.aiStrengths}</span>
              ) : (
                <span className="text-slate-500 text-xs">-</span>
              ),
          },
        ]}
        formFields={[
          {
            name: "campaignId",
            label: "Campagne d'évaluation",
            type: "select",
            required: true,
            optionsEndpoint: "/evaluation-campaign",
            optionLabel: (c) => c.name,
          },
          {
            name: "employeeId",
            label: "Employé à évaluer",
            type: "select",
            required: true,
            optionsEndpoint: "/employee",
            optionLabel: (e) => `${e.firstName} ${e.lastName}`,
          },
          {
            name: "managerId",
            label: "Manager Évaluateur",
            type: "select",
            optionsEndpoint: "/employee",
            optionLabel: (e) => `${e.firstName} ${e.lastName}`,
          },
          {
            name: "type",
            label: "Type d'évaluation",
            type: "select",
            required: true,
            options: [
              { label: "Auto-évaluation", value: "SELF" },
              { label: "Évaluation manager", value: "MANAGER" },
            ],
          },
          { name: "score", label: "Note attribuée (/20)", type: "number" },
          { name: "managerComment", label: "Commentaire détaillé du manager", type: "textarea" },
        ]}
        rowActions={(row, reload) => (
          <button
            onClick={async () => {
              setError(null);
              setGeneratingId(row.id);
              try {
                await api.post(`/evaluation/${row.id}/generate-ai`, {});
                reload();
              } catch (e: any) {
                setError(e.message);
              } finally {
                setGeneratingId(null);
              }
            }}
            disabled={generatingId === row.id || !row.managerComment}
            title={!row.managerComment ? "Veuillez ajouter un commentaire manager d'abord" : ""}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 transition hover:bg-indigo-500/20 disabled:opacity-40"
          >
            <Sparkles className={`h-3.5 w-3.5 text-cyan-400 ${generatingId === row.id ? "animate-spin" : ""}`} />
            <span>{generatingId === row.id ? "Analyse..." : "Synthèse IA"}</span>
          </button>
        )}
      />
    </div>
  );
}