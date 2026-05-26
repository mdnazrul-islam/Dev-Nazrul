import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Bot, X, Send, Loader2, Sparkles, AlertCircle, RefreshCw, Terminal } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "আসসালামু আলাইকুম! I am Dev Nazrul AI Expert. How can I help you today? Please feel free to ask me about Nazrul's skills, pricing estimates, past IoT/Android telemetry projects, or general software questions!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend.trim() };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);
    setErrorStatus(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send past 8 messages to keep contextual focus and avoid token overflow
        body: JSON.stringify({ messages: updatedMessages.slice(-8) }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive feedback from server proxy.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.text || "I was unable to formulate a response. Please try again." }]);
    } catch (err: any) {
      console.error("AI Assistant error:", err);
      setErrorStatus(err.message || "Connection timed out. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (qn: string) => {
    handleSendMessage(qn);
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "আসসালামু আলাইকুম! I've refreshed our conversation. Ask me anything about Nazrul's experience, cost estimates, or stack capabilities!",
      },
    ]);
    setErrorStatus(null);
  };

  const quickPrompts = [
    { label: "প্রজেক্টের দাম কেমন?", text: "What is your pricing estimates for fullstack Next.js and Kotlin Android apps?" },
    { label: "Android / IoT experience", text: "Can you detail your Android SDK & Bluetooth Low Energy BLE integration experience?" },
    { label: "How to hire?", text: "How can I hire Dev Nazrul or contact him directly on WhatsApp?" },
  ];

  return (
    <div id="ai-assistant-wrapper" className="fixed bottom-12 sm:bottom-16 right-6 z-50">
      
      {/* Small Glowing Toggle Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="ai-assistant-trigger-btn"
          className="relative group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto cursor-pointer border border-indigo-500/20"
        >
          {/* Ripple ambient effect */}
          <span className="absolute -inset-1 rounded-full bg-indigo-500/20 blur pointer-events-none group-hover:scale-110 transition duration-300"></span>
          <Bot className="w-5 h-5 animate-pulse text-indigo-100" />
          <span className="hidden sm:inline font-mono text-[11px] tracking-wider uppercase text-indigo-100">AI Advisor Expert</span>
          {/* Notification bubble */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border border-slate-950 rounded-full animate-bounce"></span>
        </button>
      )}

      {/* Main Chat Assistant Workspace interface */}
      {isOpen && (
        <div
          id="ai-assistant-panel"
          className="w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 border-indigo-500/40"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header Panel */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 border-b border-slate-850 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500 flex items-center justify-center relative">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950"></span>
              </div>
              <div>
                <h4 className="font-sans font-extrabold text-xs text-slate-100 tracking-widest uppercase flex items-center gap-1">
                  DEV NAZRUL AI <span className="text-[9px] text-indigo-400 font-mono font-normal">v3.5</span>
                </h4>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight block">Live Studio Grounding Active</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset History */}
              <button 
                onClick={handleReset}
                className="text-slate-450 hover:text-white p-1 rounded-md hover:bg-slate-900 transition-all cursor-pointer"
                title="Reset Conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-450 hover:text-white p-1 rounded-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages History Scroller Box */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950/30 font-sans text-xs scrollbar-thin">
            {messages.map((m, idx) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"} items-start gap-2 animate-in fade-in duration-300`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-indigo-450" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 shadow-sm text-left ${
                    isAssistant 
                      ? "bg-slate-900/90 border border-slate-800 text-slate-200" 
                      : "bg-indigo-650 text-white font-medium"
                  } whitespace-pre-wrap leading-relaxed`}>
                    {m.content}
                  </div>
                </div>
              );
            })}

            {/* AI Reasoning state Loader */}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                </div>
                <div className="bg-slate-900/60 border border-slate-850 rounded-xl px-3.5 py-3 text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span className="font-mono text-[10px] uppercase">Reasoning stream...</span>
                </div>
              </div>
            )}

            {/* Error presentation alert */}
            {errorStatus && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-450 text-[11px] leading-relaxed flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono font-bold uppercase text-[10px]">Transmission Issue</p>
                  <p className="mt-0.5 text-slate-350">{errorStatus}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-reply Starter Bubbles (Only if message count is low) */}
          {messages.length < 5 && (
            <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-900 flex flex-wrap gap-1.5 z-10 text-left">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(qp.text)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850/80 text-[10px] text-indigo-350 hover:text-indigo-300 rounded-lg border border-slate-800 cursor-pointer text-left transition-all"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Form write input container */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-slate-950 border-t border-slate-900 z-10 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Dev Nazrul AI..."
              maxLength={400}
              className="flex-grow bg-slate-900 border border-slate-800 focus:border-indigo-500 outline-none rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl p-2.5 transition-all text-xs flex-shrink-0 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
