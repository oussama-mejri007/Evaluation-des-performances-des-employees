"use client";

import CrudPage from "@/components/CrudPage";

export default function CampaignsPage() {
  return (
    <CrudPage
      title="Campagnes d'evaluation"
      endpoint="/evaluation-campaign"
      columns={[
        { key: "name", label: "Nom" },
        { key: "startDate", label: "Debut", render: (row) => new Date(row.startDate).toLocaleDateString("fr-FR") },
        { key: "endDate", label: "Fin", render: (row) => new Date(row.endDate).toLocaleDateString("fr-FR") },
        { key: "status", label: "Statut" },
      ]}
      formFields={[
        { name: "name", label: "Nom de la campagne", type: "text", required: true },
        { name: "startDate", label: "Date de debut", type: "date", required: true },
        { name: "endDate", label: "Date de fin", type: "date", required: true },
        {
          name: "status",
          label: "Statut",
          type: "select",
          options: [
            { label: "Brouillon", value: "DRAFT" },
            { label: "Active", value: "ACTIVE" },
            { label: "Cloturee", value: "CLOSED" },
          ],
        },
      ]}
    />
  );
}