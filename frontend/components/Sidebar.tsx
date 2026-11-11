"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// Icons vectoriels SVG intégrés ultra-propres et légers
const Icons = {
  Dashboard: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Building: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0l2 2m-2-2l-2 2" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  CheckSquare: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Brain: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Bot: () => (
    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
};

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType;
  isAi?: boolean;
}

interface NavSection {
  label: string;
  links: NavLink[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Ressources Humaines",
    links: [
      { href: "/", label: "Tableau de Bord", icon: Icons.Dashboard },
      { href: "/departements", label: "Départements", icon: Icons.Building },
      { href: "/positions", label: "Postes & Fonctions", icon: Icons.Briefcase },
      { href: "/employees", label: "Annuaire Employés", icon: Icons.Users },
      { href: "/skills", label: "Référentiel Compétences", icon: Icons.Cpu },
      { href: "/employee-skills", label: "Cartographie Compétences", icon: Icons.Cpu },
      { href: "/position-skills", label: "Exigences par Poste", icon: Icons.Cpu },
    ],
  },
  {
    label: "Performance & GPEC",
    links: [
      { href: "/campaigns", label: "Campagnes d'Évaluation", icon: Icons.CheckSquare },
      { href: "/evaluations", label: "Fiches d'Évaluation", icon: Icons.CheckSquare },
      { href: "/objectives", label: "Objectifs SMART", icon: Icons.Target },
    ],
  },
  {
    label: "Intelligence Artificielle",
    links: [
      { href: "/training-recommendations", label: "Recommandations Formation", icon: Icons.Sparkles, isAi: true },
      { href: "/career-recommendations", label: "Plan de Carrière", icon: Icons.Brain, isAi: true },
      { href: "/chat", label: "Assistant Virtual RH", icon: Icons.Bot, isAi: true },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-72 flex-shrink-0 flex-col bg-[#0b0f19] border-r border-white/10 text-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex-shrink-0 border-b border-white/10 px-6 py-6 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b0f19]">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-indigo-400 text-lg">
                T
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-base tracking-tight text-white">TrustDev HR</h1>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                AI Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">GPEC &amp; Talent Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="scrollbar-dark min-h-0 flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.links.map((link) => {
                const active = pathname === link.href;
                const IconComponent = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                    )}
                    <span
                      className={`flex h-5 w-5 items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                        active ? "text-cyan-300" : link.isAi ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      <IconComponent />
                    </span>
                    <span className="truncate">{link.label}</span>
                    {link.isAi && !active && (
                      <span className="ml-auto rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-400 border border-purple-500/20">
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="flex-shrink-0 border-t border-white/10 p-4 bg-[#0d1220]">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white shadow-inner">
            {user?.firstName ? user.firstName[0].toUpperCase() : user?.email?.[0].toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}` : user?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {user?.role ?? "EMPLOYEE"}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400"
          >
            <Icons.Logout />
          </button>
        </div>
      </div>
    </aside>
  );
}