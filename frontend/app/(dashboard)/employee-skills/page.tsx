"use client";

import ScopedCrudPage from "@/components/ScopedCrudPage";

export default function EmployeeSkillsPage() {
  return (
    <ScopedCrudPage
      title="Competences des employees"
      scopeLabel="Employe"
      scopeOptionsEndpoint="/employee"
      scopeOptionLabel={(e) => `${e.firstName} ${e.lastName}`}
      scopeParamName="employeeId"
      listPath={(id) => `/employee-skill/employee/${id}`}
      createEndpoint="/employee-skill"
      columns={[
        { key: "skill", label: "Competence", render: (row) => row.skill?.name ?? "-" },
        { key: "level", label: "Niveau (1-5)" },
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
        { name: "level", label: "Niveau (1-5)", type: "number", required: true },
      ]}
    />
  );
}