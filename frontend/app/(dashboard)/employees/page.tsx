"use client";

import CrudPage from "@/components/CrudPage";

export default function EmployeesPage() {
  return (
    <CrudPage
      title="Employees"
      endpoint="/employee"
      columns={[
        { key: "firstName", label: "Prenom" },
        { key: "lastName", label: "Nom" },
        { key: "departement", label: "Departement", render: (row) => row.departement?.name ?? "-" },
        { key: "position", label: "Poste", render: (row) => row.position?.title ?? "-" },
        { key: "manager", label: "Manager", render: (row) => (row.manager ? `${row.manager.firstName} ${row.manager.lastName}` : "-") },
      ]}
      formFields={[
        { name: "firstName", label: "Prenom", type: "text", required: true },
        { name: "lastName", label: "Nom", type: "text", required: true },
        {
          name: "departementId",
          label: "Departement",
          type: "select",
          required: true,
          optionsEndpoint: "/api/departements",
          optionLabel: (d) => d.name,
        },
        {
          name: "positionId",
          label: "Poste",
          type: "select",
          required: true,
          optionsEndpoint: "/position",
          optionLabel: (p) => p.title,
        },
        {
          name: "managerId",
          label: "Manager (optionnel)",
          type: "select",
          optionsEndpoint: "/employee",
          optionLabel: (e) => `${e.firstName} ${e.lastName}`,
        },
      ]}
    />
  );
}