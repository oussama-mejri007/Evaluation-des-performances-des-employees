"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { Bot, User, Send, Sparkles, MessageSquare, AlertCircle, Lightbulb, Target, BookOpen, TrendingUp } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Message {
  id: string;
  sender: "USER" | "BOT";
  content: string;
  createdAt: string;
}

// Composant de rendu Markdown structuré pour le Chatbot
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Titres en gras (ex: **Titre** ou ### Titre)
        if (trimmed.startsWith("###") || trimmed.startsWith("##") || (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("\n"))) {
          const titleText = trimmed.replace(/^#+\s*/, "").replace(/^\*\*/, "").replace(/\*\*$/, "");
          return (
            <h4 key={idx} className="font-display font-bold text-white text-sm mt-3 mb-1 flex items-center gap-1.5 border-b border-white/10 pb-1">
              {titleText}
            </h4>
          );
        }

        // Listes à puces (- ou *)
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletContent = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2 my-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0 shadow-[0_0_6px_#22d3ee]" />
              <span className="text-slate-200">
                {parseInlineBold(bulletContent)}
              </span>
            </div>
          );
        }

        // Listes numérotées (ex: 1. , 2. )
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s+(.*)/);
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-2 my-1">
                <span className="font-bold text-cyan-400 text-xs mt-0.5 min-w-[18px]">{match[1]}</span>
                <span className="text-slate-200">{parseInlineBold(match[2])}</span>
              </div>
            );
          }
        }

        // Paragraphe standard
        return (
          <p key={idx} className="text-slate-200">
            {parseInlineBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper pour parser **texte en gras**
function parseInlineBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function ChatPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/employee").then(setEmployees).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function startConversation() {
    if (!employeeId) return;
    setError(null);
    try {
      const conv = await api.post("/chat-conversation", { employeeId });
      setConversationId(conv.id);
      setMessages([]);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleSendQuery(queryText: string) {
    if (!conversationId || !queryText.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await api.post(`/chat-message/${conversationId}`, { content: queryText });
      setMessages((prev) => [...prev, res.userMessage, res.botMessage]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput("");
    await handleSendQuery(text);
  }

  const selectedEmp = employees.find((e) => e.id === employeeId);

  const suggestedQueries = [
    { label: "Mes compétences clés", icon: Lightbulb, query: "Fais-moi un résumé clair de mes compétences actuelles." },
    { label: "Formations recommandées", icon: BookOpen, query: "Quelles sont les formations qui me sont recommandées ?" },
    { label: "Mes objectifs SMART", icon: Target, query: "Quels sont mes objectifs SMART actuels et mes échéances ?" },
    { label: "Évolution de carrière", icon: TrendingUp, query: "Quelle est ma prochaine étape d'évolution de carrière ?" },
  ];

  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Header Bar */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Assistant Virtuel RH
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-400 border border-purple-500/20">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>RAG Structuré</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Posez des questions sur le profil, les évaluations, formations et objectifs SMART des collaborateurs.
          </p>
        </div>

        {/* Employee selector card */}
        <div className="flex items-center gap-3 bg-[#111827]/80 p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Collaborateur</span>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0f172a] text-slate-400 font-medium">
                Sélectionner un employé...
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#0f172a] text-slate-100 font-medium py-2">
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={startConversation}
            disabled={!employeeId}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-105 disabled:opacity-40"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Nouvelle Session</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex-shrink-0 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm text-rose-300 backdrop-blur-xl">
          <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Chat Box Container */}
      <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-white/10 bg-[#111827]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {!conversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-xl shadow-purple-500/20">
              <div className="h-full w-full bg-[#0b0f19] rounded-[22px] flex items-center justify-center">
                <Bot className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-display text-lg font-bold text-white">Assistant RH prêt</h3>
              <p className="text-xs text-slate-400">
                Sélectionnez un employé dans le menu en haut pour démarrer une session de questions-réponses structurée.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Conversation Active Header */}
            <div className="flex-shrink-0 border-b border-white/10 px-6 py-3 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">
                  Session active pour : <strong className="text-white">{selectedEmp?.firstName} {selectedEmp?.lastName}</strong>
                </span>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-dark">
              {messages.length === 0 ? (
                <div className="text-center py-8 space-y-6">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Posez votre question à l'Assistant RH.</p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Cliquez sur une suggestion ci-dessous ou saisissez directement votre question dans le champ.
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
                    {suggestedQueries.map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSendQuery(item.query)}
                          className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/10 text-left transition hover:bg-white/10 hover:border-indigo-500/40 group"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{item.label}</p>
                            <p className="text-[11px] text-slate-400 truncate">{item.query}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "BOT" && (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={`max-w-2xl rounded-2xl px-5 py-4 shadow-xl ${
                        msg.sender === "USER"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none text-sm font-medium"
                          : "bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.sender === "BOT" ? (
                        <FormattedMessage content={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.sender === "USER" && (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {sending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg animate-pulse">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-slate-900/90 border border-white/10 px-5 py-3.5 text-xs text-slate-400 flex items-center gap-3 shadow-xl">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>L'assistant structure la réponse RH...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Form Bar */}
            <form onSubmit={sendMessage} className="flex-shrink-0 border-t border-white/10 p-4 bg-[#0d1220] flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question (ex: Quelles sont mes compétences et objectifs ?)..."
                className="flex-1 rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                <span>{sending ? "Envoi..." : "Envoyer"}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}