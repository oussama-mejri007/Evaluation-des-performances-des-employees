"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#080c14] text-slate-400 font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-lg shadow-indigo-500/20" />
          <p className="text-sm tracking-wide text-slate-300">Chargement de la plateforme RH...</p>
        </div>
      </div>
    );
  }

  // Obtenir le nom de la page pour le breadcrumb
  const pageTitles: Record<string, string> = {
    "/": "Tableau de bord Général",
    "/profile": "Mon Profil Utilisateur",
    "/departements": "Gestion des Départements",
    "/positions": "Postes & Fiches de Fonction",
    "/employees": "Annuaire des Collaborateurs",
    "/skills": "Référentiel des Compétences",
    "/employee-skills": "Cartographie des Compétences",
    "/position-skills": "Exigences de Compétences par Poste",
    "/campaigns": "Campagnes d'Évaluation de Performance",
    "/evaluations": "Fiches d'Évaluation",
    "/objectives": "Gestion des Objectifs SMART",
    "/training-recommendations": "Recommandations de Formations par IA",
    "/career-recommendations": "Plans d'Évolution de Carrière",
    "/chat": "Assistant Virtuel RH Conversationnel",
  };

  const currentTitle = pageTitles[pathname] || "Espace RH";

  return (
    <div className="flex h-screen w-screen bg-[#080c14] text-slate-100 overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0f19]/80 px-8 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <h2 className="font-display text-sm font-semibold text-white tracking-wide">
              {currentTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Status Pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Système IA en ligne</span>
            </div>

            {/* Clickable User Greeting Avatar linking to /profile */}
            <Link
              href="/profile"
              title="Accéder à mon profil"
              className="group flex items-center gap-3 border-l border-white/10 pl-4 transition hover:opacity-90"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">
                  {user.firstName ? `${user.firstName} ${user.lastName ?? ""}` : user.email}
                </p>
                <p className="text-[10px] text-cyan-400 font-medium">{user.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold text-white text-xs shadow-md transition group-hover:scale-105 group-hover:shadow-indigo-500/30">
                {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* Content Body Area */}
        <main className="flex-1 overflow-y-auto bg-[#080c14] scrollbar-dark">
          {children}
        </main>
      </div>
    </div>
  );
}