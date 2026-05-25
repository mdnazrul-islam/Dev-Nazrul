import { useState } from "react";
import { Project } from "../types";
import { ArrowLeft, Globe, Smartphone, Play, LogIn, ChevronDown, ChevronUp, Download, Eye, QrCode } from "lucide-react";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  const [activeAccordion, setActiveAccordion] = useState<"guide" | "changelog" | null>("guide");

  const isApp = project.category === "App";

  // Helper to extract Embeddable YouTube or Vimeo URLs from regular watch links for iframe support
  const getEmbedVideoUrl = (url?: string): string | null => {
    if (!url) return null;
    
    try {
      // YouTube Embed convertor
      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (url.includes("youtube.com/embed/")) {
        return url;
      }
      
      // Vimeo Embed convertor
      if (url.includes("vimeo.com/")) {
        const vId = url.split("vimeo.com/")[1]?.split("?")[0];
        return vId ? `https://player.vimeo.com/video/${vId}` : null;
      }
    } catch (e) {
      console.warn("Invalid video URL format", e);
    }
    
    return null;
  };

  const embedVideoUrl = getEmbedVideoUrl(project.videoUrl);

  const toggleAccordion = (section: "guide" | "changelog") => {
    if (activeAccordion === section) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(section);
    }
  };

  return (
    <div id="project-detail-view" className="bg-slate-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back navigation anchor */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-mono text-indigo-400 hover:text-indigo-300 hover:underline transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all projects
        </button>

        {/* Title and Category Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-white mb-2">
              {project.title}
            </h1>
            <p className="font-mono text-xs text-indigo-400 tracking-wide">
              Created At: {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 self-start sm:self-center px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-widest ${
              isApp
                ? "bg-amber-500 text-slate-950"
                : "bg-indigo-600 text-white border border-indigo-500/20"
            }`}
          >
            {isApp ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {project.category} Showcase
          </span>
        </div>

        {/* Media Layout & Core Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Showcase (Image / Video Embed) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Embedded Video Walkthrough if present, otherwise Cloudinary static image */}
            {embedVideoUrl ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl relative">
                <iframe
                  src={`${embedVideoUrl}?autoplay=0`}
                  title={`${project.title} walk-through`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                <img
                  src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* If Video was displayed, we show the static Cloudinary image just below */}
            {embedVideoUrl && (
              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800/60 p-2.5">
                <p className="text-[10px] font-mono text-slate-400 mb-2.5 uppercase tracking-wider px-1">Static Image Preview:</p>
                <img
                  src={project.imageUrl}
                  alt={`${project.title} Static View`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[300px] object-cover rounded-lg border border-slate-800"
                />
              </div>
            )}

            {/* Description Card */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <h3 className="text-lg font-bold text-slate-200">About the Project</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>

          {/* Right Column: Call to Actions & Accordions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Instant Actions Panel with Live Link or APK QR Code */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
              <h3 className="font-sans font-bold text-base text-slate-200 uppercase tracking-wider text-center border-b border-slate-800 pb-3">
                Project Interactions
              </h3>

              {isApp ? (
                <div id="apk-info-box" className="text-center space-y-4 flex flex-col items-center">
                  {project.apkLink ? (
                    <>
                      {/* Live generated QR Code of the apk download link via standard secure QR API */}
                      <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0f172a&data=${encodeURIComponent(
                            project.apkLink
                          )}`}
                          alt="Download Link QR Code"
                          className="w-[140px] h-[140px] block"
                        />
                      </div>
                      <p className="text-xs text-slate-400 font-mono max-w-xs leading-normal">
                        Scan the QR Code with your Android phone camera to download the installer directly.
                      </p>

                      <a
                        href={project.apkLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/10 transition-all font-mono text-sm uppercase cursor-pointer"
                      >
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        Download APK Installer
                      </a>
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs font-mono py-4">APK Link not provided by developer</p>
                  )}
                </div>
              ) : (
                <div id="web-info-box" className="space-y-4">
                  {project.liveLink ? (
                    <>
                      <p className="text-xs text-center text-slate-400 font-mono leading-normal">
                        This web portal is in production and live on the internet! Click below to visit.
                      </p>
                      
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all font-mono text-sm uppercase cursor-pointer animate-pulse"
                      >
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                        Visit Live Preview
                      </a>
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs text-center font-mono py-4">Live Link not provided by developer</p>
                  )}
                </div>
              )}

              {/* Technologies Stack tags */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-2 font-bold select-none">
                  Core Technologies used
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 border border-slate-800 text-indigo-400 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* User Guide & Changelogs in distinct elegant Accordions */}
            <div className="space-y-3">
              
              {/* Accordion 1: User Guide */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("guide")}
                  id="accordion-toggle-guide"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-850/50 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-200">
                    Step-by-Step User Guide
                  </span>
                  {activeAccordion === "guide" ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {activeAccordion === "guide" && (
                  <div className="p-4 border-t border-slate-800 text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-line font-medium text-slate-300">
                    {project.guide ? (
                      project.guide
                    ) : (
                      <span className="italic text-slate-500 font-mono text-xs">No configuration or installation guide available.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Changelogs / Version Tracker */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("changelog")}
                  id="accordion-toggle-changelog"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-850/50 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-200">
                    Version Changelog History
                  </span>
                  {activeAccordion === "changelog" ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {activeAccordion === "changelog" && (
                  <div className="p-4 border-t border-slate-800 space-y-4 max-h-[300px] overflow-y-auto">
                    {project.versionLogs && project.versionLogs.length > 0 ? (
                      project.versionLogs.map((log, index) => (
                        <div key={index} className="p-3 bg-slate-950/50 rounded-lg border border-slate-850 space-y-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-mono font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              v{log.version}
                            </span>
                            <span className="text-slate-500 text-xs font-mono">
                              {log.date}
                            </span>
                          </div>
                          
                          {/* Rendering changes array list */}
                          <ul className="list-disc pl-4 space-y-1">
                            {log.changes?.map((ch, idx) => (
                              <li key={idx} className="text-xs text-slate-400">
                                {ch}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <span className="italic text-slate-500 font-mono text-xs block p-2">Initial production release (v1.0.0). No newer update records.</span>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
