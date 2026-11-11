"use client";

import CrudPage from "@/components/CrudPage";

export default function DepartementsPage() {
  return (
    <CrudPage
      title="Departements"
      endpoint="/api/departements"
      columns={[{ key: "name", label: "Nom" }]}
      formFields={[{ name: "name", label: "Nom du departement", type: "text", required: true }]}
    />
  );
}