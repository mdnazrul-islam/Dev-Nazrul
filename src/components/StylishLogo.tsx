import React from "react";
import { Sparkles } from "lucide-react";

interface StylishLogoProps {
  size?: "sm" | "lg";
}

export default function StylishLogo({ size = "sm" }: StylishLogoProps) {
  // A beautiful, high-performance, responsive pure-vector crest SVG (size: under 3KB)
  const LogoSvg = ({ className = "w-full h-full" }) => (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-transform duration-500 group-hover:scale-105`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Modern gradients */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="cyanGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cybernetic Grid Canvas */}
      <circle cx="50" cy="50" r="46" fill="#020617" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" />

      {/* Outer Hexagonal Shield */}
      <path
        d="M50 8 L85 28 V68 L50 88 L15 68 V28 Z"
        stroke="url(#indigoGradient)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="#090D1A"
      />
      
      {/* Dynamic Circuit Corner Nodes */}
      <circle cx="50" cy="8" r="2.5" fill="#6366F1" filter="url(#glowEffect)" />
      <circle cx="85" cy="28" r="1.5" fill="#22D3EE" />
      <circle cx="15" cy="28" r="1.5" fill="#22D3EE" />
      <circle cx="50" cy="88" r="2.5" fill="#6366F1" />

      {/* Core Crest Ring */}
      <circle cx="50" cy="50" r="28" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="50 15 10 5" />

      {/* Monogram Monolith "DN" (Dev Nazrul) */}
      <g transform="translate(28, 30)">
        {/* Letter 'D' Path */}
        <path
          d="M6 6 V34 H18 C28 34 32 28 32 20 C32 12 28 6 18 6 H6 Z"
          stroke="url(#goldGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowEffect)"
        />
        <path
          d="M11 12 V28 H17 C22 28 25 24 25 20 C25 16 22 12 17 12 H11 Z"
          fill="url(#indigoGradient)"
          opacity="0.25"
        />

        {/* Letter 'N' Path overlay */}
        <path
          d="M23 6 V34 M23 12 L37 30 V6"
          stroke="url(#cyanGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Core Power center dot */}
        <circle cx="17" cy="20" r="2" fill="#22D3EE" filter="url(#glowEffect)" />
      </g>

      {/* Cyberpunk Accents */}
      <path d="M43 80 H57" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="80" x2="35" y2="80" stroke="#334155" strokeWidth="1.5" />
      <line x1="65" y1="80" x2="70" y2="80" stroke="#334155" strokeWidth="1.5" />
    </svg>
  );

  if (size === "lg") {
    return (
      <div id="stylish-logo-large" className="flex flex-col items-center justify-center text-center space-y-4 cursor-pointer select-none group">
        <div className="relative">
          {/* Ambient Glowing Aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
          
          <div className="relative w-28 h-28 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl p-1">
            <LogoSvg />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="relative font-sans font-black text-4xl tracking-tight text-white flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-white via-indigo-150 to-indigo-400 bg-clip-text text-transparent">
              Dev Nazrul
            </span>
            <Sparkles className="w-5.5 h-5.5 text-indigo-400 animate-pulse fill-indigo-400/25" />
          </h2>
          <span className="font-mono text-[10px] text-indigo-450 tracking-[0.35em] uppercase font-bold block pt-1">
            Fullstack & IoT Specialist
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="stylish-logo-small" className="flex items-center gap-3 cursor-pointer select-none group">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full blur-sm opacity-50 group-hover:opacity-95 transition duration-350"></div>
        <div className="relative w-11 h-11 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
          <LogoSvg />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-black text-base tracking-tight text-white leading-none group-hover:text-indigo-400 transition-all flex items-center gap-0.5">
          Dev Nazrul
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse fill-indigo-400/25" />
        </span>
        <span className="font-mono text-[9px] text-slate-400 tracking-wider uppercase font-semibold mt-1">
          Fullstack Expert
        </span>
      </div>
    </div>
  );
}
