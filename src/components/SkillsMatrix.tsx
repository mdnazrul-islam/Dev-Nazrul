import React, { useState } from "react";
import { Cpu, Terminal, Sparkles, Layout, Database, Smartphone, CheckCircle } from "lucide-react";

interface SkillItem {
  name: string;
  level: number; // 0 to 100
  description: string;
}

interface SkillCategory {
  title: string;
  id: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

export default function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState<string>("mobile");

  const categories: SkillCategory[] = [
    {
      title: "Frontend Engineering",
      id: "frontend",
      icon: <Layout className="w-4 h-4 text-sky-400" />,
      skills: [
        { name: "Next.js (App Router)", level: 95, description: "Advanced routing, SSG/SSR optimization, and custom middleware handlers" },
        { name: "React & TypeScript", level: 92, description: "Declarative UI rendering, customized hooks, and bulletproof static type safety" },
        { name: "Tailwind CSS & Motion", level: 96, description: "Fluid layouts, theme variables matching, and state-driven animations" },
        { name: "State Managers (Zustand, Redux)", level: 88, description: "Clean store management, hydration backups, and action dispatches" }
      ]
    },
    {
      title: "Backend & Systems",
      id: "backend",
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      skills: [
        { name: "Node.js & Express", level: 90, description: "High-throughput servers, custom express middleware, and secure proxy integrations" },
        { name: "REST APIs & JSON Tunnels", level: 93, description: "Standardized request route schemas, JWT authentication, and rate-limiting safeguards" },
        { name: "Firebase (Auth, DB & Rules)", level: 95, description: "Serverless triggers, custom auth validation, and hardened path security policies" },
        { name: "Cloudinary Admin SDK", level: 85, description: "Unsigned storage presets, asset compression, and signed dynamic upload streams" }
      ]
    },
    {
      title: "Mobile App Development",
      id: "mobile",
      icon: <Smartphone className="w-4 h-4 text-indigo-400" />,
      skills: [
        { name: "Native Android SDK Development", level: 87, description: "Kotlin/Java backend workflows, dynamic Gradle builds, and APK packaging" },
        { name: "React Native Integration", level: 89, description: "Single code-base cross-platform builds, fast HMR sync, and custom native styling" },
        { name: "Bluetooth Pairing & BLE Telemetry", level: 80, description: "Direct low-energy sensor telemetry reading, local SQLite background caches" }
      ]
    }
  ];

  const allSkills = categories.flatMap(cat => cat.skills);

  return (
    <div id="skills-matrix-section" className="relative bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-indigo-505/5 rounded-full blur-3xl pointer-events-none" />

      {/* Specialty Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-900/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold tracking-wider uppercase">
            <Cpu className="w-3 h-3" /> Toolset Matrix
          </div>
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight">Technical Mastery & Stack</h3>
          <p className="text-xs text-slate-400 max-w-lg font-sans">
            A comprehensive, interactive analysis of my software engineering capabilities and real-world technology proficiencies.
          </p>
        </div>

        {/* Dynamic Controls Toggles */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-end">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Specialties
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === cat.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.icon}
              {cat.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Display Cards / Progress Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {categories
          .filter((cat) => activeTab === "all" || cat.id === activeTab)
          .map((cat) => (
            <div key={cat.id} className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/40">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-2.5">
                {cat.icon}
                <span className="font-sans font-bold text-xs tracking-wider uppercase text-slate-350">{cat.title}</span>
              </div>
              <div className="space-y-4">
                {cat.skills.map((skill, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-100 font-bold">{skill.name}</span>
                      <span className="text-indigo-400 font-extrabold">{skill.level}%</span>
                    </div>
                    {/* Visual Bar tracks */}
                    <div className="w-full bg-slate-900 border border-slate-800/80 rounded-full h-2 overflow-hidden relative">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 h-full rounded-full duration-1000 transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      
    </div>
  );
}
