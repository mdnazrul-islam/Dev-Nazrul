import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PWAInstallPrompt() {
  const [installerLink, setInstallerLink] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    // Fetch custom app installer URL link from firestore doc settings
    const fetchInstallerLink = async () => {
      try {
        const installerDocRef = doc(db, "settings", "installer");
        const snap = await getDoc(installerDocRef);
        if (snap.exists() && snap.data().installerLink) {
          setInstallerLink(snap.data().installerLink);
        }
      } catch (e) {
        console.warn("Could not load custom installer link:", e);
      }
    };
    fetchInstallerLink();

    // Trigger visibility after 4.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("pwa-prompt-dismissed", "true");
    } catch {}
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem("pwa-prompt-dismissed") === "true") {
        setIsVisible(false);
      }
    } catch {}
  }, []);

  if (!isVisible) return null;

  // Uses default APK download landing link if not configured in the Admin settings
  const targetDownloadUrl = installerLink || "#";

  return (
    <div 
      className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 animate-fade-in text-left"
      id="pwa-install-banner"
    >
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800/80 p-4.5 rounded-2xl shadow-2xl relative text-slate-100 flex gap-4 overflow-hidden">
        
        {/* Subtle top decoration accent line bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
        
        {/* Logo Icon Layer with guaranteed CSS fallback matching custom design rules */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center overflow-hidden font-sans font-extrabold text-indigo-400 text-sm shadow-inner">
            {!imgError ? (
              <img 
                src="/logo.png" 
                alt="DN" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-extrabold text-xs tracking-wider text-indigo-400 uppercase">DN</span>
            )}
          </div>
        </div>

        {/* Dynamic Installer Content Block */}
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider">OFFICIAL APP</h4>
              <h3 className="text-sm font-sans font-bold text-slate-100 tracking-tight leading-none mt-0.5">Dev Nazrul (official)</h3>
            </div>
            {/* Close Trigger Button */}
            <button 
              onClick={handleDismiss}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 -mt-1 -mr-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            পোর্টালে দ্রুত এবং অফলাইনে প্রবেশ করতে <b>"Dev Nazrul"</b> অ্যাপটি আপনার ফোনে ইনস্টল করে রাখুন!
          </p>
          
          <div className="flex items-center gap-2 pt-1">
            {installerLink ? (
              <a
                href={targetDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-550 cursor-pointer text-center"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                যুক্ত করুন (Install)
              </a>
            ) : (
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800/40 w-full justify-between">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  ইনস্টলেশন লিংক শিগগিরই আসছে
                </span>
              </div>
            )}
            
            <button
              onClick={handleDismiss}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl text-slate-300 transition-all cursor-pointer"
            >
              না থাক
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
