"use client";

export interface OptionItem {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "checkbox" | "textarea";
  required?: boolean;
  options?: OptionItem[];
  optionsEndpoint?: string;
  optionLabel?: (item: any) => string;
  optionValueKey?: string;
}

interface Props {
  field: FieldConfig;
  value: any;
  dynamicOptions: any[] | undefined;
  onChange: (name: string, value: any) => void;
}

export default function FormFieldInput({ field, value, dynamicOptions, onChange }: Props) {
  const resolvedOptions: OptionItem[] =
    field.options ||
    (dynamicOptions || []).map((item) => ({
      label: field.optionLabel ? field.optionLabel(item) : item.name ?? item.title ?? item.email ?? item.id,
      value: item[field.optionValueKey || "id"],
    }));

  const baseInputStyles =
    "w-full rounded-xl border border-white/10 bg-[#0f172a]/90 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-inner backdrop-blur-md transition-all duration-200 focus:border-indigo-500 focus:bg-[#0f172a] focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  if (field.type === "select") {
    return (
      <select
        required={field.required}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={`${baseInputStyles} cursor-pointer`}
      >
        <option value="" className="bg-[#0f172a] text-slate-400">
          Sélectionner...
        </option>
        {resolvedOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f172a] text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(field.name, e.target.checked)}
        className="h-5 w-5 rounded-lg border-white/20 bg-[#0f172a] accent-indigo-500 transition cursor-pointer"
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        required={field.required}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        rows={3}
        className={baseInputStyles}
      />
    );
  }

  return (
    <input
      type={field.type || "text"}
      required={field.required}
      value={value ?? ""}
      onChange={(e) => onChange(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
      className={baseInputStyles}
    />
  );
}