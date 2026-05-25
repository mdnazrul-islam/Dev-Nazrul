import React from "react";
import { Sparkles, Terminal } from "lucide-react";

interface StylishLogoProps {
  size?: "sm" | "lg";
}

export default function StylishLogo({ size = "sm" }: StylishLogoProps) {
  if (size === "lg") {
    return (
      <div id="stylish-logo-large" className="flex flex-col items-center justify-center text-center space-y-3 cursor-pointer select-none group">
        <div className="relative">
          {/* Ambient Glowing Aura */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
            <span className="bg-gradient-to-tr from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent italic tracking-wider font-mono">
              DN
            </span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-indigo-600 border border-slate-950 flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="relative font-sans font-black text-4xl tracking-tight text-white flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
              Dev Nazrul
            </span>
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse fill-indigo-400/25" />
          </h2>
          <span className="font-mono text-xs text-indigo-400 tracking-[0.3em] uppercase font-semibold">
            Fullstack Specialist
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="stylish-logo-small" className="flex items-center gap-3 cursor-pointer select-none group">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-lg blur-sm opacity-40 group-hover:opacity-90 transition duration-350"></div>
        <div className="relative w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-base text-white">
          <span className="bg-gradient-to-tr from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tight font-mono">
            DN
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-black text-base tracking-tight text-white leading-none group-hover:text-indigo-400 transition-all flex items-center gap-0.5">
          Dev Nazrul
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse fill-indigo-400/25" />
        </span>
        <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase font-semibold mt-1">
          Fullstack Expert
        </span>
      </div>
    </div>
  );
}
