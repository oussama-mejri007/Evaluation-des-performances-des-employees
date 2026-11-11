"use client";

import CrudPage from "@/components/CrudPage";

export default function SkillsPage() {
  return (
    <CrudPage
      title="Referentiel de competences"
      endpoint="/skill"
      columns={[
        { key: "name", label: "Nom" },
        { key: "category", label: "Categorie" },
      ]}
      formFields={[
        { name: "name", label: "Nom de la competence", type: "text", required: true },
        { name: "category", label: "Categorie", type: "text" },
      ]}
    />
  );
}