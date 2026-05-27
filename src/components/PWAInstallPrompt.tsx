import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share2, PlusSquare } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detect if the app is already running in standalone mode (installed as PWA)
    const isInStandaloneMode = () => {
      try {
        return (
          window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes("android-app://")
        );
      } catch {
        return false;
      }
    };

    if (isInStandaloneMode()) {
      setIsStandalone(true);
      return; // No need to prompt if already installed!
    }

    // 2. Identify if it is an iOS device
    const checkIsIOS = () => {
      try {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
      } catch {
        return false;
      }
    };

    const iosDetected = checkIsIOS();
    setIsIOS(iosDetected);

    // 3. Listen for Android/Chrome standard installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Delay prompt appearance by 6 seconds for high-quality welcome pacing
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 6000);

      return () => clearTimeout(timer);
    };

    // 4. Fallback: If it's an iOS device, show the instruction after 10 seconds (since iOS has no prompt event)
    if (iosDetected) {
      const iosTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      return () => clearTimeout(iosTimer);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If the browser already installed it during this session
    const handleAppInstalled = () => {
      console.log("App was successfully installed!");
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    try {
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to prompt: ${outcome}`);
    } catch (err) {
      console.error("Installation choice reading failed:", err);
    }

    // We've used the prompt, clear it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again in this tab session
    try {
      sessionStorage.setItem("pwa-prompt-dismissed", "true");
    } catch {}
  };

  // Skip rendering if already standalone, or if dismissed in this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem("pwa-prompt-dismissed") === "true") {
        setIsVisible(false);
      }
    } catch {}
  }, []);

  if (isStandalone || !isVisible) return null;

  return (
    <div 
      className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 animate-fade-in"
      id="pwa-install-banner"
    >
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl shadow-2xl relative text-slate-100 flex gap-4 overflow-hidden">
        
        {/* Subtle top decoration bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400" />
        
        {/* Logo Icon Layer */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-1 shadow-inner">
            <img 
              src="/logo.png" 
              alt="Dev Nazrul Theme Icon" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Content Block */}
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xs font-mono font-bold text-indigo-400 tracking-wider">APP INSTALLED</h4>
              <h3 className="text-sm font-sans font-bold text-white tracking-tight leading-none mt-0.5">Dev Nazrul</h3>
            </div>
            {/* Close trigger */}
            <button 
              onClick={handleDismiss}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 -mt-1 -mr-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isIOS ? (
            /* iOS Custom Instruction Details */
            <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
              <p>
                আপনার আইফোনে অ্যাপটি হোম স্ক্রিনে যোগ করতে নিচে দেওয়া শেয়ার বাটন ব্যবহার করুন:
              </p>
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40 text-[11px] font-mono text-indigo-350 space-y-1">
                <div className="flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>১. সাফারি ব্রাউজারের নিচে <b>Share</b> বাটনে ট্যাপ করুন।</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlusSquare className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>২. তালিকা স্ক্রল করে <b>'Add to Home Screen'</b> নির্বাচন করুন।</span>
                </div>
              </div>
            </div>
          ) : (
            /* Android/Chrome Default prompt Trigger UI */
            <div className="space-y-3">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                পোর্টালে দ্রুত ও অফলাইনে প্রবেশ করতে এবং হোম স্ক্রীন থেকে সরাসরি লঞ্চ করতে <b>"Dev Nazrul"</b> অ্যাপটি যুক্ত করে রাখুন!
              </p>
              
              <div className="flex items-center gap-2 pt-1">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="flex-grow inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-indigo-550 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    যুক্ত করুন (Install)
                  </button>
                ) : (
                  /* Custom indicator for browsers with native controls of PWA */
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/40 w-full">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                    <span>আপনার ব্রাউজারের ৩-ডট মেনু থেকে 'Install App' ক্লিক করুন।</span>
                  </div>
                )}
                
                {deferredPrompt && (
                  <button
                    onClick={handleDismiss}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 transition-all cursor-pointer"
                  >
                    না থাক
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
