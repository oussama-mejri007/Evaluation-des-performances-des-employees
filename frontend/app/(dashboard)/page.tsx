"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { 
  Users, 
  Award, 
  FileText, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  BrainCircuit, 
  CheckCircle2 
} from "lucide-react";

const CYAN = "#06b6d4";
const PINK = "#ec4899";
const PURPLE = "#8b5cf6";
const BLUE = "#3b82f6";
const DONUT_COLORS = [CYAN, PINK, PURPLE, BLUE, "#f59e0b", "#10b981"];

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  departement?: { name: string };
}

interface Evaluation {
  id: string;
  type: "SELF" | "MANAGER";
  score?: number;
  CreatedAt?: string;
  createdAt?: string;
}

interface Skill {
  id: string;
  name: string;
  category?: string;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/employee").catch(() => []),
      api.get("/evaluation").catch(() => []),
      api.get("/skill").catch(() => []),
      api.get("/api/departements").catch(() => []),
      api.get("/position").catch(() => []),
      api.get("/evaluation-campaign").catch(() => []),
    ]).then(([emp, evals, sk, dep, pos, camp]) => {
      setEmployees(emp);
      setEvaluations(evals);
      setSkills(sk);
      setDepartments(dep);
      setPositions(pos);
      setCampaigns(camp);
      setLoaded(true);
    });
  }, []);

  const avgScore =
    evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + (e.score ?? 0), 0) / evaluations.length).toFixed(1)
      : "-";

  const employeesByDept = Object.entries(
    employees.reduce((acc: Record<string, number>, e) => {
      const name = e.departement?.name ?? "Non assigné";
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const evaluationsByType = Object.entries(
    evaluations.reduce((acc: Record<string, number>, e) => {
      acc[e.type] = (acc[e.type] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name: name === "SELF" ? "Auto-évaluation" : "Manager", value }));

  const skillsByCategory = Object.entries(
    skills.reduce((acc: Record<string, number>, s) => {
      const cat = s.category || "Autre";
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const evaluationsOverTime = Object.entries(
    evaluations.reduce((acc: Record<string, { count: number; totalScore: number }>, e) => {
      const dateStr = (e as any).CreatedAt || (e as any).createdAt;
      const month = dateStr ? new Date(dateStr).toLocaleDateString("fr-FR", { month: "short" }) : "Récents";
      if (!acc[month]) acc[month] = { count: 0, totalScore: 0 };
      acc[month].count += 1;
      acc[month].totalScore += e.score ?? 0;
      return acc;
    }, {}),
  ).map(([month, v]) => ({ month, moyenne: v.count ? +(v.totalScore / v.count).toFixed(1) : 0, nombre: v.count }));

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : user?.email;

  const heroCards = [
    { 
      label: "Effectif Total", 
      value: employees.length, 
      subText: "Collaborateurs actifs", 
      icon: Users, 
      gradient: "from-blue-600/20 via-indigo-600/20 to-purple-600/20",
      borderColor: "border-indigo-500/30",
      iconBg: "bg-indigo-500/20 text-indigo-400"
    },
    { 
      label: "Note Moyenne RH", 
      value: avgScore !== "-" ? `${avgScore} / 20` : "-", 
      subText: "Performance globale", 
      icon: Award, 
      gradient: "from-cyan-600/20 via-teal-600/20 to-emerald-600/20",
      borderColor: "border-cyan-500/30",
      iconBg: "bg-cyan-500/20 text-cyan-400"
    },
    { 
      label: "Évaluations Réalisées", 
      value: evaluations.length, 
      subText: "Fiches enregistrées", 
      icon: FileText, 
      gradient: "from-purple-600/20 via-fuchsia-600/20 to-pink-600/20",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/20 text-purple-400"
    },
    { 
      label: "Campagnes Actives", 
      value: campaigns.length, 
      subText: "Sessions d'évaluation", 
      icon: TrendingUp, 
      gradient: "from-pink-600/20 via-rose-600/20 to-orange-600/20",
      borderColor: "border-pink-500/30",
      iconBg: "bg-pink-500/20 text-pink-400"
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/0 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Plateforme GPEC &amp; Intelligence Artificielle</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">{displayName}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Supervisez les compétences de vos équipes, suivez les évaluations de performance et générez des recommandations personnalisées assistées par IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/training-recommendations"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Recommandations IA</span>
            </Link>
            <Link
              href="/evaluations"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/20"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Évaluations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {heroCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 border ${card.borderColor} backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {card.label}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} shadow-inner`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="font-display text-3xl font-extrabold text-white tracking-tight">
                  {loaded ? card.value : "..."}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{card.subText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line Chart: Score Evolution */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl lg:col-span-2 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-white">Évolution des Évaluations</h3>
              <p className="text-xs text-slate-400">Note moyenne attribuée par mois d'évaluation</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 border border-white/5">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              <span>Progression globale</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={evaluationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 20]} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}
                labelStyle={{ color: "#f8fafc", fontWeight: "bold" }}
              />
              <Line 
                type="monotone" 
                dataKey="moyenne" 
                name="Note moyenne (/20)" 
                stroke={CYAN} 
                strokeWidth={3} 
                dot={{ r: 5, fill: CYAN, strokeWidth: 2, stroke: "#0f172a" }} 
                activeDot={{ r: 8, fill: "#38bdf8" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart: Evaluation Types */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="mb-6">
            <h3 className="font-display text-base font-bold text-white">Répartition des Évaluations</h3>
            <p className="text-xs text-slate-400">Auto-évaluations vs Évaluations Manager</p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={evaluationsByType} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={65} 
                outerRadius={95} 
                paddingAngle={4}
              >
                {evaluationsByType.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut: Employees by Department */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-white">Effectif par Département</h3>
              <p className="text-xs text-slate-400">Ventilation des collaborateurs par pôle</p>
            </div>
            <Building2 className="h-4 w-4 text-indigo-400" />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={employeesByDept} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={60} 
                outerRadius={90} 
                paddingAngle={4}
              >
                {employeesByDept.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Skills by Category */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-white">Compétences par Catégorie</h3>
              <p className="text-xs text-slate-400">Volume de compétences référencées</p>
            </div>
            <Briefcase className="h-4 w-4 text-pink-400" />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={skillsByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }} />
              <Bar dataKey="value" name="Compétences" fill={PINK} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real Live Metrics Footer Bar */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-indigo-950/40 to-slate-900/80 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="font-semibold text-white">Résumé de la Base de Données :</span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <strong className="text-cyan-400 font-bold">{departments.length}</strong> Départements
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <strong className="text-indigo-400 font-bold">{positions.length}</strong> Postes
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <strong className="text-purple-400 font-bold">{employees.length}</strong> Employés
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <strong className="text-pink-400 font-bold">{skills.length}</strong> Compétences
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <strong className="text-emerald-400 font-bold">{campaigns.length}</strong> Campagnes
            </span>
          </div>

          <Link
            href="/chat"
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            <span>Interroger l'Assistant RH</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}