import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PWAInstallPrompt() {
  const [installerLink, setInstallerLink] = useState<string>("");
  const [appIconUrl, setAppIconUrl] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    // Fetch custom app installer URL link & custom icon URL from firestore settings doc
    const fetchSettings = async () => {
      try {
        const installerDocRef = doc(db, "settings", "installer");
        const snap = await getDoc(installerDocRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.installerLink) {
            setInstallerLink(data.installerLink);
          }
          if (data.appIconUrl) {
            setAppIconUrl(data.appIconUrl);
          }
        }
      } catch (e) {
        console.warn("Could not load custom installer settings:", e);
      }
    };
    fetchSettings();

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

  // Uses default landing APK if not set
  const targetDownloadUrl = installerLink || "#";
  const displayIconUrl = appIconUrl || "/logo.png";

  return (
    <div 
      className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 animate-fade-in text-left"
      id="pwa-install-banner"
    >
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-2xl relative text-slate-100 flex gap-4 overflow-hidden">
        
        {/* Top visual gradient border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-505 via-purple-500 to-cyan-400" />
        
        {/* Absolute Top Right Close Trigger */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-900 cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo / Custom App Icon container */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center overflow-hidden font-sans font-extrabold text-indigo-400 text-sm shadow-inner">
            {!imgError ? (
              <img 
                src={displayIconUrl} 
                alt="DN" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-extrabold text-xs tracking-wider text-indigo-400 uppercase">DN</span>
            )}
          </div>
        </div>

        {/* Dynamic Installer Content Block in English */}
        <div className="flex-grow space-y-3 pr-4">
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">OFFICIAL MOBILE CLIENT</h4>
            <h3 className="text-sm font-sans font-bold text-slate-100 tracking-tight leading-none">Dev Nazrul App</h3>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Install the <b>"Dev Nazrul"</b> application on your mobile device for rapid, offline-capable access to our entire developer portfolio.
          </p>
          
          <div className="pt-1.5 w-full">
            {installerLink ? (
              <a
                href={targetDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-550 cursor-pointer text-center"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                Install App
              </a>
            ) : (
              <div className="text-[10px] font-mono text-slate-450 flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800/40 w-full justify-between">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  Installation bundle coming soon
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
