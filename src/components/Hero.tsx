import { Phone, Mail, Linkedin, Facebook, ArrowUpRight, Github } from "lucide-react";

interface HeroProps {
  onExploreProjects: () => void;
  onContactMe: () => void;
}

export default function Hero({ onExploreProjects, onContactMe }: HeroProps) {
  // Configured skill sets with fine-tuned specific styling
  const keySkills = [
    { name: "Next.js", color: "from-slate-100 to-slate-400 text-slate-900 border-slate-700 bg-slate-800" },
    { name: "React & TypeScript", color: "from-sky-400 to-indigo-500 text-sky-400 border-sky-500/20 bg-sky-950/20" },
    { name: "Tailwind CSS", color: "from-cyan-400 to-blue-500 text-cyan-400 border-cyan-500/20 bg-cyan-950/20" },
    { name: "Firebase (Auth & Firestore)", color: "from-amber-400 to-orange-500 text-amber-400 border-amber-500/20 bg-amber-950/20" },
    { name: "Cloudinary Cloud Hosting", color: "from-blue-400 to-purple-500 text-blue-400 border-blue-500/20 bg-blue-950/20" },
    { name: "Node.js & Express", color: "from-green-400 to-emerald-500 text-green-400 border-green-500/20 bg-green-950/20" },
  ];

  return (
    <div id="hero-section" className="relative overflow-hidden bg-radial from-slate-900 via-slate-950 to-black text-white py-16 sm:py-24 border-b border-slate-800">
      
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          
          <div className="md:w-3/5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              AVAILABLE FOR FULLSTACK CLIENT APPS
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
              Md. Nazrul Islam
            </h1>

            <p className="font-sans text-xl text-indigo-400 font-semibold tracking-wide">
              Professional Full-stack Developer & Technical Engineer
            </p>

            <p className="font-sans text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Highly passionate about crafting state-of-the-art secure single-page operations, high-performance dashboard analytics web apps, and native android application packages (APKs) with complex Cloud storage and database automations. Let's engineer your concepts.
            </p>

            {/* Quick social & phone contacts */}
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-xs sm:text-sm font-mono text-slate-400">
              <a 
                href="https://wa.me/8801793840762" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-green-400 transition-colors bg-slate-800/40 p-2 rounded-lg border border-slate-800"
              >
                <Phone className="w-4 h-4 text-green-500" />
                <span>+8801793840762</span>
              </a>
              <a 
                href="mailto:nazrul.islam.uli019@gmail.com" 
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors bg-slate-800/40 p-2 rounded-lg border border-slate-800"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>nazrul.islam.uli019@gmail.com</span>
              </a>
            </div>

            {/* View redirection triggers */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-2">
              <button
                onClick={onExploreProjects}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-600/50 transition-all cursor-pointer"
              >
                Explore Projects
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={onContactMe}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Get In Touch
              </button>
            </div>
          </div>

          {/* Graphical Skill Accent Box */}
          <div className="md:w-2/5 mt-12 md:mt-0 p-6 sm:p-8 rounded-2xl bg-gradient-to-ee from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative">
            <h3 className="font-sans font-bold text-lg text-slate-200 mb-4 tracking-tight">Technical Toolset</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {keySkills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border ${skill.color}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/60">
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Connect on Professional platforms:
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.linkedin.com/in/md-nazrul-islam-482722411" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="LinkedIn Profile"
                  className="w-10 h-10 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-white border border-indigo-500/20 flex items-center justify-center transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.facebook.com/4nazrul.islam" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Facebook Profile"
                  className="w-10 h-10 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-white border border-indigo-500/20 flex items-center justify-center transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="GitHub Account"
                  className="w-10 h-10 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-white border border-indigo-500/20 flex items-center justify-center transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
