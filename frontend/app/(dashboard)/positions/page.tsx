"use client";

import CrudPage from "@/components/CrudPage";

export default function PositionsPage() {
  return (
    <CrudPage
      title="Postes"
      endpoint="/position"
      columns={[
        { key: "title", label: "Intitule" },
        { key: "departement", label: "Departement", render: (row) => row.departement?.name ?? "-" },
      ]}
      formFields={[
        { name: "title", label: "Intitule du poste", type: "text", required: true },
        {
          name: "departementId",
          label: "Departement",
          type: "select",
          required: true,
          optionsEndpoint: "/api/departements",
          optionLabel: (d) => d.name,
        },
      ]}
    />
  );
}