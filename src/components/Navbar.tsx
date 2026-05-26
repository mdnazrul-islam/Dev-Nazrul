import { useState } from "react";
import { Menu, X, ShieldAlert, Laptop, Briefcase, Phone, ChevronRight, Github, Facebook, Linkedin, MessageCircle } from "lucide-react";
import StylishLogo from "./StylishLogo";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  isAdmin: boolean;
  onLogout?: () => void;
}

export default function Navbar({ currentView, setView, isAdmin, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Laptop },
    { id: "gallery", label: "Projects", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setView("home")}>
            <StylishLogo size="sm" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsOpen(false);
                  }}
                  id={`nav-item-${item.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="h-5 w-px bg-slate-800 mx-3 hidden lg:block" />

            {/* Direct Social Links with premium micro-hovers */}
            <div className="hidden lg:flex items-center gap-1.5 mr-2">
              <a
                href="https://github.com/dev-nazrul-bd"
                target="_blank"
                rel="noreferrer"
                id="header-social-github"
                className="w-8 h-8 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/md-nazrul-islam-482722411"
                target="_blank"
                rel="noreferrer"
                id="header-social-linkedin"
                className="w-8 h-8 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/4nazrul.islam"
                target="_blank"
                rel="noreferrer"
                id="header-social-facebook"
                className="w-8 h-8 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all"
                title="Facebook Connect"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801793840762"
                target="_blank"
                rel="noreferrer"
                id="header-social-whatsapp"
                className="w-8 h-8 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all"
                title="WhatsApp Direct Msg"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Admin toggle shown ONLY if user is already logged in or visiting admin directly */}
            {(isAdmin || currentView === "admin") && (
              <>
                <div className="h-6 w-px bg-slate-800 mx-3" />
                <button
                  onClick={() => setView("admin")}
                  id="nav-item-admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === "admin"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  {isAdmin ? "Admin Panel" : "Login"}
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={onLogout}
                id="nav-item-logout"
                className="ml-2 text-xs text-rose-450 hover:text-rose-300 hover:underline px-2 py-1 transition-all"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            {isAdmin && (
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                Admin
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="mobile-nav" className="md:hidden bg-slate-900 border-b border-slate-800 shadow-xl overflow-hidden px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                id={`mobile-nav-item-${item.id}`}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
          {(isAdmin || currentView === "admin") && (
            <>
              <div className="h-px bg-slate-800 my-2" />
              <button
                onClick={() => {
                  setView("admin");
                  setIsOpen(false);
                }}
                id="mobile-nav-item-admin"
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === "admin"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  <span>{isAdmin ? "Admin Panel" : "Admin Login"}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                if (onLogout) onLogout();
                setIsOpen(false);
              }}
              id="mobile-nav-item-logout"
              className="w-full text-left px-4 py-3 rounded-xl text-base text-rose-400 hover:bg-rose-500/10 font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
