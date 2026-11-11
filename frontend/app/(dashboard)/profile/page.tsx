"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

const Icons = {
  User: () => (
    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states pour modification profil
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    // Récupérer les détails de l'employé correspondant à l'utilisateur connecté
    api.get("/employee")
      .then((employees: any[]) => {
        const emp = employees.find((e) => e.email?.toLowerCase() === user.email.toLowerCase());
        if (emp) {
          setEmployeeData(emp);
          // Récupérer les compétences associées
          api.get(`/employee-skill?employeeId=${emp.id}`)
            .then((skills) => setUserSkills(Array.isArray(skills) ? skills : []))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (user?.id) {
        await api.put(`/api/users/${user.id}`, { firstName, lastName });
      }
      // Mettre à jour le localStorage localement
      const updatedUser = { ...user, firstName, lastName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Impossible de mettre à jour le profil." });
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : user?.email ?? "Utilisateur";

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto select-none">
      {/* Banner & Cover Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/60 p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/0 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-1 shadow-2xl shadow-indigo-500/30">
              <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#0b0f19] text-2xl font-extrabold text-white">
                {displayName[0].toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#0b0f19] shadow-[0_0_10px_#34d399]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                  {displayName}
                </h1>
                <span className="rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                  {user?.role ?? "EMPLOYEE"}
                </span>
              </div>
              <p className="text-sm text-slate-300">{user?.email}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <Icons.CheckCircle />
                <span>Compte vérifié &amp; actif</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 border border-rose-500/20 transition hover:bg-rose-500/20"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Informations & Paramètres */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Colonne Gauche: Formulaire de modification */}
        <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-2xl space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <Icons.User />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white">Informations Personnelles</h2>
              <p className="text-xs text-slate-400">Consultez et mettez à jour vos informations de compte</p>
            </div>
          </div>

          {message && (
            <div
              className={`rounded-2xl p-4 text-xs font-medium border backdrop-blur-xl ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Adresse Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full rounded-xl border border-white/10 bg-[#0f172a]/50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-500">L'email ne peut être modifié directement.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-105 disabled:opacity-50"
              >
                <span>{saving ? "Enregistrement..." : "Sauvegarder"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Colonne Droite: Cartouche RH & Statistiques */}
        <div className="space-y-6">
          {/* Card Rôle & Sécurité */}
          <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20">
                <Icons.Shield />
              </div>
              <h3 className="font-display text-sm font-bold text-white">Droits &amp; Accès</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Rôle attribué</span>
                <span className="font-bold text-purple-400">{user?.role ?? "EMPLOYEE"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Authentification</span>
                <span className="font-medium text-emerald-400">JWT Sécurisé</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Session active</span>
                <span className="font-medium text-cyan-400">En cours</span>
              </div>
            </div>
          </div>

          {/* Card Poste & Compétences rattachées */}
          <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/20">
                <Icons.Briefcase />
              </div>
              <h3 className="font-display text-sm font-bold text-white">Fiche RH Associée</h3>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">Chargement des données RH...</p>
            ) : employeeData ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Département</span>
                  <span className="font-bold text-white">{employeeData.departement?.name ?? "Non assigné"}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Poste actuel</span>
                  <span className="font-bold text-cyan-400">{employeeData.position?.title ?? "Non défini"}</span>
                </div>

                {userSkills.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-slate-400 block font-semibold">Compétences maîtrisées ({userSkills.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {userSkills.map((sk: any, i: number) => (
                        <span key={i} className="rounded-lg bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold text-indigo-300 border border-indigo-500/20">
                          {sk.skill?.name ?? "Compétence"} (Niv. {sk.level}/5)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Aucune fiche employé liée à cet email pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
