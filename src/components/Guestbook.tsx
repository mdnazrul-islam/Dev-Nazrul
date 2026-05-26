import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, limit, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { MessageSquare, Users, Trash2, Send, Check, Loader2, Heart } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  role: string;
  message: string;
  createdAt: any;
}

interface GuestbookProps {
  isAdmin?: boolean;
}

export default function Guestbook({ isAdmin = false }: GuestbookProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Submission values
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("Visitor");
  const [message, setMessage] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Baseline template comments to show if the Firestore collection is empty
  const templateComments: Comment[] = [
    {
      id: "temp-1",
      name: "Tanvir Rahman",
      role: "Fellow Developer",
      message: "Truly impressive portfolio, Nazrul! The real-time Firestore synchronization and deep Android telemetry integration is beautiful.",
      createdAt: { toDate: () => new Date("2026-05-24T10:30:00Z") }
    },
    {
      id: "temp-2",
      name: "Sabrina Chowdhury",
      role: "Client",
      message: "Collaborating with Nazrul was an absolute pleasure. He finalized our Smart Agro tracking App layout efficiently and with unmatched expertise.",
      createdAt: { toDate: () => new Date("2026-05-23T14:45:00Z") }
    }
  ];

  // Load real-time comments directly from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: Comment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.name,
          role: data.role,
          message: data.message,
          createdAt: data.createdAt
        });
      });
      setComments(loaded);
      setLoading(false);
    }, (err) => {
      console.warn("Could not setup real-time guestbook listener. Falling back to baseline testimonials.", err);
      setComments(templateComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccess(false);

    try {
      const data = {
        name: name.trim(),
        role: role,
        message: message.trim(),
        createdAt: serverTimestamp() // Must match rule validator `createdAt == request.time`
      };

      await addDoc(collection(db, "guestbook"), data);
      
      setName("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error("Guestbook signature write failed:", err);
      setErrorMessage("Could not broadcast signature. Only valid properties matching Firestore access restrictions are permitted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this guestbook comment?")) return;
    try {
      await deleteDoc(doc(db, "guestbook", id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Unauthorized action. Only system administrators can delete comments.");
    }
  };

  const getRoleBadgeColor = (roleStr: string) => {
    switch (roleStr) {
      case "Client":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Fellow Developer":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Tech Recruiter":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700/80";
    }
  };

  // Combine real database comments with templates if database list is empty
  const activeCommentsList = comments.length > 0 ? comments : templateComments;

  return (
    <div id="guestbook-element-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      
      {/* Visual glowing aura */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-505/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Left Column: Signature submission form */}
      <div className="lg:col-span-4 space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-505/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" /> Signatures Map
          </div>
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight">Virtual Guestbook Wall</h3>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            Leave an encouraging word, share a greeting, or endorse my skills. Your feedback will stream instantly on the signature wall!
          </p>
        </div>

        {/* Guestbook Sign form structure */}
        <form onSubmit={handleSignSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-left">
          
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Your Name:</label>
            <input 
              type="text" 
              required
              maxLength={100}
              placeholder="e.g. Sabrina Chowdhury"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-3 py-2 text-xs outline-none font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Your Association:</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-3 py-2 text-xs outline-none font-sans cursor-pointer"
            >
              <option value="Visitor">General Visitor</option>
              <option value="Client">Client</option>
              <option value="Fellow Developer">Fellow Developer</option>
              <option value="Tech Recruiter">Tech Recruiter</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Message / Endorsement:</label>
            <textarea 
              required
              rows={4}
              maxLength={1000}
              placeholder="Write a message or testimonial..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-3 py-2 text-xs outline-none font-sans resize-none"
            />
          </div>

          {errorMessage && (
            <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg leading-normal font-mono">
              {errorMessage}
            </p>
          )}

          {success && (
            <p className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg leading-normal font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Signature stream broadcast successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 font-mono"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Broadcasting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Post Signature
              </>
            )}
          </button>

        </form>
      </div>

      {/* Grid Right Column: Signatures scroll wall */}
      <div className="lg:col-span-8 flex flex-col h-[420px] bg-slate-950/50 border border-slate-850 rounded-2xl p-5 sm:p-6 text-left">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h4 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">Signatures Wall</h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Showcasing {activeCommentsList.length} recent signatures
          </span>
        </div>

        {loading ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <Loader2 className="w-7 h-7 text-indigo-400 animate-spin mb-2" />
            <p className="text-xs font-mono text-slate-450">Streaming signature database...</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto space-y-3.5 pr-2 scrollbar-thin">
            {activeCommentsList.map((comment) => (
              <div 
                key={comment.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl relative group hover:border-slate-800 transition-all"
              >
                {/* Upper Metadata alignment */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="space-y-0.5">
                    <span className="font-sans font-extrabold text-xs text-white block">
                      {comment.name}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${getRoleBadgeColor(comment.role)}`}>
                      {comment.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-505 block">
                      {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }) : "Recent"}
                    </span>

                    {/* Admin Moderative Actions */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-rose-400 hover:text-rose-350 p-1 rounded hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete Signature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main signature payload text */}
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-slate-900 pt-3 mt-4 text-center">
          <p className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
            Signatures Wall powered by <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500" /> Firestore database live streams.
          </p>
        </div>

      </div>

    </div>
  );
}
