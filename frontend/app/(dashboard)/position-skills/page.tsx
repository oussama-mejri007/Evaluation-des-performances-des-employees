"use client";

import ScopedCrudPage from "@/components/ScopedCrudPage";

export default function PositionSkillsPage() {
  return (
    <ScopedCrudPage
      title="Competences attendues par poste"
      scopeLabel="Poste"
      scopeOptionsEndpoint="/position"
      scopeOptionLabel={(p) => p.title}
      scopeParamName="positionId"
      listPath={(id) => `/position-skill/position/${id}`}
      createEndpoint="/position-skill"
      columns={[
        { key: "skill", label: "Competence", render: (row) => row.skill?.name ?? "-" },
        { key: "levelRequired", label: "Niveau requis (1-5)" },
      ]}
      formFields={[
        {
          name: "skillId",
          label: "Competence",
          type: "select",
          required: true,
          optionsEndpoint: "/skill",
          optionLabel: (s) => s.name,
        },
        { name: "levelRequired", label: "Niveau requis (1-5)", type: "number", required: true },
      ]}
    />
  );
}