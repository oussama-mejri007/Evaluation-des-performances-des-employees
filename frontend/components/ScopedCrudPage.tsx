"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import FormFieldInput, { FieldConfig } from "./FormFieldInput";
import { ColumnConfig } from "./CrudPage";
import { Plus, Trash2, Layers, AlertCircle, RefreshCw, Filter } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  scopeLabel: string;
  scopeOptionsEndpoint: string;
  scopeOptionLabel: (item: any) => string;
  scopeParamName: string;
  listPath: (scopeId: string) => string;
  createEndpoint: string;
  deleteEndpoint?: (id: string) => string;
  columns: ColumnConfig[];
  formFields: FieldConfig[];
  idField?: string;
}

export default function ScopedCrudPage({
  title,
  description,
  scopeLabel,
  scopeOptionsEndpoint,
  scopeOptionLabel,
  scopeParamName,
  listPath,
  createEndpoint,
  deleteEndpoint,
  columns,
  formFields,
  idField = "id",
}: Props) {
  const [scopeOptions, setScopeOptions] = useState<any[]>([]);
  const [scopeId, setScopeId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(scopeOptionsEndpoint).then(setScopeOptions).catch((e) => setError(e.message));
    formFields.forEach((field) => {
      if (field.optionsEndpoint) {
        api
          .get(field.optionsEndpoint)
          .then((data) => setDynamicOptions((prev) => ({ ...prev, [field.name]: data })))
          .catch(() => {});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!scopeId) {
      setItems([]);
      return;
    }
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeId]);

  async function loadItems() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(listPath(scopeId));
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(name: string, value: any) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scopeId) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post(createEndpoint, { [scopeParamName]: scopeId, ...formData });
      setFormData({});
      await loadItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;
    try {
      await api.delete(deleteEndpoint ? deleteEndpoint(id) : `${createEndpoint}/${id}`);
      await loadItems();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-slate-400 max-w-2xl">{description}</p>}
        </div>

        {scopeId && (
          <button
            onClick={loadItems}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 border border-white/10 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            <span>Actualiser</span>
          </button>
        )}
      </div>

      {/* Scope Selector Card */}
      <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Sélectionner le périmètre ({scopeLabel})
            </h2>
            <p className="text-xs text-slate-400">Sélectionnez une entrée pour afficher ses données associées.</p>
          </div>
        </div>

        <div className="min-w-[280px]">
          <select
            value={scopeId}
            onChange={(e) => setScopeId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-2.5 text-sm text-slate-100 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="" className="bg-[#0f172a] text-slate-400">
              Sélectionner un {scopeLabel}...
            </option>
            {scopeOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#0f172a] text-slate-200">
                {scopeOptionLabel(opt)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-300 backdrop-blur-xl">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {scopeId ? (
        <>
          {/* Creation Form Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <Plus className="h-4 w-4" />
              </div>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-300">
                Ajouter une donnée pour ce {scopeLabel}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {formFields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {field.label}
                    {field.required && <span className="text-rose-400 ml-1">*</span>}
                  </label>
                  <FormFieldInput
                    field={field}
                    value={formData[field.name]}
                    dynamicOptions={dynamicOptions[field.name]}
                    onChange={updateField}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>{submitting ? "Enregistrement..." : "Ajouter au profil"}</span>
              </button>
            </div>
          </form>

          {/* Table Container */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h3 className="font-display text-sm font-bold text-white">Éléments Associés ({items.length})</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {columns.map((col) => (
                      <th key={col.key} className="whitespace-nowrap px-6 py-4">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
                        <div className="inline-flex items-center gap-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                          <span>Chargement des données...</span>
                        </div>
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
                        <p className="text-sm font-medium">Aucun élément associé trouvé.</p>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        key={item[idField]}
                        className="transition-colors duration-150 hover:bg-white/[0.03]"
                      >
                        {columns.map((col) => (
                          <td key={col.key} className="whitespace-nowrap px-6 py-4 text-slate-200">
                            {col.render ? col.render(item) : String(item[col.key] ?? "-")}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(item[idField])}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/20 transition hover:bg-rose-500/20 hover:text-rose-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#111827]/40 p-12 text-center backdrop-blur-xl">
          <p className="text-sm font-medium text-slate-400">
            Veuillez choisir un <strong className="text-white">{scopeLabel}</strong> ci-dessus pour afficher et gérer ses éléments.
          </p>
        </div>
      )}
    </div>
  );
}