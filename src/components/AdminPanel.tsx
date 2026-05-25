import React, { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy,
  query
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { uploadToCloudinary } from "../cloudinary";
import { Project, Message, VersionLog } from "../types";
import { 
  Lock, Mail, Key, ShieldAlert, Plus, Layers, Inbox, Settings, 
  Trash2, Edit, Loader2, UploadCloud, CheckCircle, RefreshCcw, LogOut, Check, ChevronDown
} from "lucide-react";

interface AdminPanelProps {
  onAdminStateChange: (isAdminLoggedIn: boolean) => void;
}

export default function AdminPanel({ onAdminStateChange }: AdminPanelProps) {
  // Authentication states
  const [email, setEmail] = useState("nazrul.islam.uli019@gmail.com");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cloudinary Local Settings
  const [cloudName, setCloudName] = useState(() => localStorage.getItem("cloudinary_cloud_name") || "ddtf1d2yk");
  const [uploadPreset, setUploadPreset] = useState(() => localStorage.getItem("cloudinary_upload_preset") || "portfolio_preset");

  // Admin section views: "projects" | "add" | "messages" | "settings"
  const [activeTab, setActiveTab] = useState<"projects" | "add" | "messages" | "settings">("projects");

  // Data storage states
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbSuccess, setDbSuccess] = useState("");
  const [dbError, setDbError] = useState("");

  // Project Editing structure state
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State for creating/editing projects
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "Web" as "Web" | "App",
    techStack: "",
    imageUrl: "",
    videoUrl: "",
    liveLink: "",
    apkLink: "",
    guide: "",
  });

  // Version Logging state for a project
  const [activeLogProject, setActiveLogProject] = useState<Project | null>(null);
  const [versionForm, setVersionForm] = useState({
    version: "",
    date: new Date().toISOString().split("T")[0],
    changes: "",
  });

  // Client-side image upload tracker states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      const adminVerified = currentUser?.email === "nazrul.islam.uli019@gmail.com";
      onAdminStateChange(adminVerified);
    });
    return () => unsubscribe();
  }, [onAdminStateChange]);

  // Load database entities when authorized
  useEffect(() => {
    if (user && user.email === "nazrul.islam.uli019@gmail.com") {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setDbLoading(true);
    setDbError("");
    try {
      // 1. Fetch Projects
      const projectsCollection = collection(db, "projects");
      const projQuery = query(projectsCollection, orderBy("createdAt", "desc"));
      const projSnap = await getDocs(projQuery);
      const projList: Project[] = [];
      projSnap.forEach((docSnap) => {
        projList.push({ id: docSnap.id, ...docSnap.data() } as Project);
      });
      setProjects(projList);

      // 2. Fetch Inbox messages
      const msgsCollection = collection(db, "messages");
      const msgQuery = query(msgsCollection, orderBy("createdAt", "desc"));
      const msgSnap = await getDocs(msgQuery);
      const msgList: Message[] = [];
      msgSnap.forEach((docSnap) => {
        msgList.push({ id: docSnap.id, ...docSnap.data() } as Message);
      });
      setMessages(msgList);
    } catch (err: any) {
      console.error("Fetch Data Error:", err);
      // Reporting via strict standard FireStore handler
      try {
        handleFirestoreError(err, OperationType.LIST, "projects / messages");
      } catch (processed) {
        setDbError("Authorization restricted. Verify security rules or administrator permission.");
      }
    } finally {
      setDbLoading(false);
    }
  };

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setSuccessMsg("");

    if (!email || !password) {
      setAuthError("Email and details are required.");
      setAuthLoading(false);
      return;
    }

    try {
      if (isRegisterMode) {
        // Creates account if first-time project builder setup
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Administrator account created successfully! Signing in...");
        setIsRegisterMode(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth Fail:", err);
      setAuthError(err?.message || "Invalid credentials or Firebase configuration error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      onAdminStateChange(false);
      setUser(null);
    } catch (err) {
      console.error("Sign Out Error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Persists Cloudinary values directly to LocalStorage
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cloudinary_cloud_name", cloudName);
    localStorage.setItem("cloudinary_upload_preset", uploadPreset);
    setDbSuccess("Cloudinary configurations saved successfully.");
    setTimeout(() => setDbSuccess(""), 3000);
  };

  // Direct Unsigned Trigger to Cloudinary Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setImageFile(file);
    setUploadingImage(true);
    setDbError("");

    try {
      const secureUrl = await uploadToCloudinary(file, cloudName, uploadPreset);
      setProjectForm((prev) => ({ ...prev, imageUrl: secureUrl }));
      setDbSuccess("Image uploaded successfully and direct secure link returned!");
      setTimeout(() => setDbSuccess(""), 4000);
    } catch (err: any) {
      console.error("Asset upload failure", err);
      setDbError(`Cloudinary Failed: ${err.message || "Ensure Cloud name & portfolio_preset is unsigned"}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Field change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  // Save Project (Add New / Update Existing)
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbLoading(true);
    setDbError("");
    setDbSuccess("");

    if (!projectForm.title || !projectForm.description || !projectForm.imageUrl) {
      setDbError("Title, Description, and Cloudinary showcase image URL are required.");
      setDbLoading(false);
      return;
    }

    const techArray = projectForm.techStack
      ? projectForm.techStack.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const projectPayload = {
      title: projectForm.title,
      description: projectForm.description,
      category: projectForm.category,
      techStack: techArray,
      imageUrl: projectForm.imageUrl,
      videoUrl: projectForm.videoUrl || null,
      liveLink: projectForm.category === "Web" ? (projectForm.liveLink || null) : null,
      apkLink: projectForm.category === "App" ? (projectForm.apkLink || null) : null,
      guide: projectForm.guide || null,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingProject?.id) {
        // Edit update block
        const projDocRef = doc(db, "projects", editingProject.id);
        await updateDoc(projDocRef, projectPayload);
        setDbSuccess("Project changes committed securely.");
      } else {
        // Add new payload
        const newProjPayload = {
          ...projectPayload,
          versionLogs: [],
          createdAt: serverTimestamp(),
        };
        const projectsCollection = collection(db, "projects");
        await addDoc(projectsCollection, newProjPayload);
        setDbSuccess("New showcase project created successfully.");
      }

      // Reset forms and exit editing view
      setProjectForm({
        title: "",
        description: "",
        category: "Web",
        techStack: "",
        imageUrl: "",
        videoUrl: "",
        liveLink: "",
        apkLink: "",
        guide: "",
      });
      setEditingProject(null);
      setImageFile(null);
      setActiveTab("projects");
      fetchData();
    } catch (err: any) {
      console.error("Save Data error:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, "projects");
      } catch (processed) {
        setDbError("Insecure operations or credentials. Database rules rejected.");
      }
    } finally {
      setDbLoading(false);
    }
  };

  // Put project details into Editing form
  const handleEditInit = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      techStack: project.techStack ? project.techStack.join(", ") : "",
      imageUrl: project.imageUrl,
      videoUrl: project.videoUrl || "",
      liveLink: project.liveLink || "",
      apkLink: project.apkLink || "",
      guide: project.guide || "",
    });
    setActiveTab("add");
  };

  // Delete Project from showcase
  const handleDeleteProj = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this showcase project?")) return;
    setDbLoading(true);
    setDbError("");
    try {
      await deleteDoc(doc(db, "projects", id));
      setDbSuccess("Project removed from showcase.");
      fetchData();
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
      } catch (processed) {
        setDbError("Database rules rejected deletion.");
      }
    } finally {
      setDbLoading(false);
    }
  };

  // Inbox message deleters
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inbox message?")) return;
    setDbLoading(true);
    setDbError("");
    try {
      await deleteDoc(doc(db, "messages", id));
      setDbSuccess("Message removed.");
      fetchData();
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `messages/${id}`);
      } catch (processed) {
        setDbError("Access denied or messages read-only.");
      }
    } finally {
      setDbLoading(false);
    }
  };

  // Version Changelog additions
  const handleVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogProject || !activeLogProject.id) return;
    if (!versionForm.version || !versionForm.changes) {
      alert("Please provide version number and change list details.");
      return;
    }

    setDbLoading(true);
    setDbError("");

    const newLogItem: VersionLog = {
      version: versionForm.version.trim(),
      date: versionForm.date,
      changes: versionForm.changes.split(",").map((c) => c.trim()).filter(Boolean),
    };

    const updatedLogs = activeLogProject.versionLogs 
      ? [newLogItem, ...activeLogProject.versionLogs]
      : [newLogItem];

    try {
      const projDocRef = doc(db, "projects", activeLogProject.id);
      await updateDoc(projDocRef, {
        versionLogs: updatedLogs,
        updatedAt: serverTimestamp(),
      });

      setDbSuccess(`Version v${newLogItem.version} log appended successfully.`);
      setVersionForm({ version: "", date: new Date().toISOString().split("T")[0], changes: "" });
      setActiveLogProject(null);
      fetchData();
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `projects/${activeLogProject.id}`);
      } catch (processed) {
        setDbError("Failed to update version log. Permission denied.");
      }
    } finally {
      setDbLoading(false);
    }
  };

  // Standard visual login UI wrapper if not logged in
  if (!user || user.email !== "nazrul.islam.uli019@gmail.com") {
    return (
      <div id="admin-login-view" className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        <div id="admin-login-header" className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-extrabold text-2xl tracking-tight text-white">Admin Console</h2>
          <p className="text-slate-450 text-xs sm:text-sm font-mono tracking-wide">
            PORTFOLIO SECURED ROUTE
          </p>
        </div>

        {/* Warning Indicator */}
        <div className="mb-4 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl p-4 text-xs font-mono space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            ADMIN PRIVILEGE ACCESS
          </div>
          <p className="leading-snug">
            Authorized Email: <b className="text-white">nazrul.islam.uli019@gmail.com</b>
          </p>
          <p className="text-slate-400">
            If you are running this for the first time, check standard auth registry. If you don't have an Auth record, toggle the "Admin Signup" toggle.
          </p>
        </div>

        {authError && (
          <div className="v-error border border-rose-500/30 bg-rose-500/10 text-rose-400 rounded-xl p-3.5 mb-4 text-xs leading-normal font-mono">
            {authError}
          </div>
        )}

        {successMsg && (
          <div className="v-success border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-xl p-3.5 mb-4 text-xs font-mono">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono font-bold text-slate-450 tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-450" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nazrul.islam.uli019@gmail.com"
                className="w-full bg-slate-950/80 border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono font-bold text-slate-450 tracking-wider mb-1">
              Secure Key (Password)
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-450" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-3.5 px-6 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/30 font-mono tracking-widest text-xs uppercase disabled:opacity-50"
          >
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRegisterMode ? (
              "Initialize Admin Signup"
            ) : (
              "Login to Panel"
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs text-indigo-400 hover:underline font-mono"
          >
            {isRegisterMode ? "Switch to standard Admin Login" : "No Auth Record? Register Admin Account"}
          </button>
        </div>
      </div>
    );
  }

  // Authorised View Panel Layout
  return (
    <div id="authorized-admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white font-sans">
      
      {/* Admin Dashboard header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            ADMIN ACCREDITED
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Control Panel</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">MD. NAZRUL ISLAM PORTFOLIO ENGINE</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            id="admin-refresh-btn"
            disabled={dbLoading}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:grid hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCcw className={`w-4 h-4 ${dbLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleSignOut}
            id="admin-logout-btn"
            className="flex items-center gap-2 bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 px-4 py-2.5 rounded-xl border border-slate-700/85 hover:border-rose-500/20 text-xs sm:text-sm font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {dbError && (
        <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{dbError}</span>
        </div>
      )}

      {dbSuccess && (
        <div className="p-4 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
          <span>{dbSuccess}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs bar */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/60 p-2 border border-slate-800/80 rounded-2xl">
        <button
          onClick={() => {
            setActiveTab("projects");
            setEditingProject(null);
          }}
          className={`px-4 py-3.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "projects"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          Showcase Projects ({projects.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("add");
            setEditingProject(null);
            setProjectForm({
              title: "",
              description: "",
              category: "Web",
              techStack: "",
              imageUrl: "",
              videoUrl: "",
              liveLink: "",
              apkLink: "",
              guide: "",
            });
          }}
          className={`px-4 py-3.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "add" && !editingProject
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Showcase
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-3.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "messages"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Inbox className="w-4 h-4" />
          Inquiries Inbox ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-3.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4" />
          CDN Configurations
        </button>
      </div>

      {/* Tab: Project lists and Update versions */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <h3 className="font-sans font-bold text-lg text-slate-200">Current Showcase Portfolio</h3>
          
          {dbLoading && projects.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-3" />
              <p className="text-sm font-mono text-slate-400">Syncing documents from Firestore...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl py-16 text-center max-w-xl mx-auto space-y-4">
              <Layers className="w-12 h-12 text-slate-650 mx-auto" />
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-350">Showcase list is empty</p>
                <p className="text-xs text-slate-500 font-mono">You haven't showcased any app or web project yet.</p>
              </div>
              <button
                onClick={() => setActiveTab("add")}
                className="inline-flex items-center gap-2 text-xs uppercase font-mono font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Create your first project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {proj.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        v{proj.versionLogs && proj.versionLogs[0] ? proj.versionLogs[0].version : "1.0.0"}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-white text-base truncate mb-1">{proj.title}</h4>
                    <p className="font-sans text-xs text-slate-400 line-clamp-2 mb-4 leading-normal">{proj.description}</p>
                    
                    {/* Render tech array list */}
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack?.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">{t}</span>
                      ))}
                      {proj.techStack && proj.techStack.length > 3 && (
                        <span className="text-[10px] font-mono text-slate-500">+{proj.techStack.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800/60">
                    
                    {/* Trigger version updates logs */}
                    <div>
                      {activeLogProject?.id === proj.id ? (
                        <form onSubmit={handleVersionSubmit} className="bg-slate-950 rounded-lg p-3 border border-indigo-500/20 space-y-2 mt-2">
                          <p className="text-[10px] uppercase font-mono text-indigo-400 font-bold">New Version Log</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="1.0.2"
                              value={versionForm.version}
                              onChange={(e) => setVersionForm({ ...versionForm, version: e.target.value })}
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none text-white font-mono"
                            />
                            <input
                              type="date"
                              required
                              value={versionForm.date}
                              onChange={(e) => setVersionForm({ ...versionForm, date: e.target.value })}
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none text-white font-mono"
                            />
                          </div>
                          <textarea
                            required
                            placeholder="Changes (comma separated, e.g. Fixed crash, Added Dark mode)"
                            value={versionForm.changes}
                            onChange={(e) => setVersionForm({ ...versionForm, changes: e.target.value })}
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none text-white resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="bg-indigo-600 text-white font-bold font-mono text-[10px] px-2 py-1 rounded hover:bg-indigo-500"
                            >
                              Append Log
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveLogProject(null)}
                              className="bg-slate-850 text-slate-300 text-[10px] px-2 py-1 rounded font-mono hover:bg-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveLogProject(proj);
                            setVersionForm({
                              version: "",
                              date: new Date().toISOString().split("T")[0],
                              changes: "",
                            });
                          }}
                          className="w-full py-1 text-center bg-slate-950 border border-slate-850 hover:border-indigo-500/25 rounded-lg text-indigo-400 hover:text-indigo-300 font-mono text-xs tracking-wide cursor-pointer transition-all"
                        >
                          + Append Version Log
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                      <button
                        onClick={() => handleEditEditInit(proj)}
                        className="flex-1 flex items-center justify-center gap-1 bg-slate-800 text-indigo-400 hover:bg-indigo-500/10 py-2 rounded-xl transition-all border border-slate-700 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Modify
                      </button>
                      <button
                        onClick={() => handleDeleteProj(proj.id!)}
                        className="p-2 text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-650 rounded-xl transition-all border border-rose-500/20 cursor-pointer"
                        title="Delete showcase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Helper trigger editing initialization */}
      {editingProject && activeTab !== "add" && (() => {
        handleEditInit(editingProject);
        return null;
      })()}

      {/* Tab: Create or Edit Project Form */}
      {activeTab === "add" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h4 className="font-sans font-extrabold text-xl text-white">
              {editingProject ? `Modify Project: ${editingProject.title}` : "Publish New Portfolio Project"}
            </h4>
            <p className="text-slate-450 text-xs font-mono mt-1">
              {editingProject ? "Re-saving edits updates Firestore fields directly" : "Fill out details to sync directly to Cloud Firestore collection"}
            </p>
          </div>

          <form onSubmit={projectFormSubmitWrapper} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category */}
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Category</label>
                <select
                  name="category"
                  value={projectForm.category}
                  onChange={handleFormChange}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="Web">Web (Hosted System Website)</option>
                  <option value="App">App (Native Mobile APK Package)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Health Sync Analytics Dashboard"
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-medium"
                />
              </div>

              {/* Tech Stack */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Tech Stack (Comma-Separated)</label>
                <input
                  type="text"
                  name="techStack"
                  value={projectForm.techStack}
                  onChange={handleFormChange}
                  placeholder="React, Next.js, Firebase Auth, Tailwind, TypeScript, Node.js"
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-mono"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Description Details</label>
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleFormChange}
                  placeholder="Describe details, challenges solved, architecture overview..."
                  required
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm resize-none whitespace-pre-wrap leading-relaxed"
                />
              </div>

              {/* CLOUDINARY FILE UPLOAD SEGMENT */}
              <div className="md:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="block text-xs uppercase font-mono tracking-wider font-bold text-indigo-400 mb-1 font-bold">
                  Direct Cloudinary Asset Uploader
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  
                  {/* File trigger drag area */}
                  <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/30 rounded-xl p-6 text-center cursor-pointer block bg-slate-900/60 hover:bg-slate-900 transition-all">
                    <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs text-slate-350 block font-bold">Select showcase image file</span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Loads directly to Cloudinary: {cloudName}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Showcase or load link fields manually */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-505">
                      Cloudinary Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={projectForm.imageUrl}
                      onChange={handleFormChange}
                      placeholder="https://res.cloudinary.com/..."
                      required
                      className="w-full bg-slate-900 border border-slate-800 py-3 px-4 text-xs font-mono outline-none rounded-xl text-indigo-300 focus:border-indigo-500"
                    />
                    {uploadingImage && (
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading directly to CDN cloud bucket...
                      </div>
                    )}
                    {imageFile && !uploadingImage && (
                      <div className="text-[10px] text-slate-505 font-mono">
                        Selected Asset: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Walkthrough Video URL (Youtube/Vimeo)</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={projectForm.videoUrl}
                  onChange={handleFormChange}
                  placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-mono"
                />
              </div>

              {/* Conditional Web Link / Apk Link inputs */}
              {projectForm.category === "Web" ? (
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Live Preview URL Website</label>
                  <input
                    type="url"
                    name="liveLink"
                    value={projectForm.liveLink}
                    onChange={handleFormChange}
                    placeholder="https://myportfolioproject.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">APK Download Link</label>
                  <input
                    type="url"
                    name="apkLink"
                    value={projectForm.apkLink}
                    onChange={handleFormChange}
                    placeholder="https://example-drive.com/my-apk-package.apk"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-mono"
                  />
                </div>
              )}

              {/* Step-by-step User Guide */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Detailed User Guide</label>
                <textarea
                  name="guide"
                  value={projectForm.guide}
                  onChange={handleFormChange}
                  placeholder="Introduce step-by-step installation instructions, environment keys, CLI variables, or commands needed to run..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm resize-none whitespace-pre-wrap leading-relaxed"
                />
              </div>

            </div>

            <div className="flex sm:justify-end gap-3 pt-6 border-t border-slate-850">
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setActiveTab("projects");
                }}
                className="flex-1 sm:flex-initial bg-slate-800 px-6 py-3.5 rounded-xl hover:bg-slate-750 font-semibold text-xs tracking-wider uppercase font-mono text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={dbLoading}
                className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all text-xs tracking-wider uppercase font-mono cursor-pointer disabled:opacity-50"
              >
                {dbLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : editingProject ? (
                  "Commit Document Edits"
                ) : (
                  "Publish Project Portfolio"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Inbox Messages List */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <h3 className="font-sans font-bold text-lg text-slate-200">Customer Communication Inbox</h3>
            <span className="text-xs bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono">
              Total Messages: {messages.length}
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="border border-dashed border-slate-850 rounded-2xl py-16 text-center max-w-xl mx-auto space-y-4">
              <Inbox className="w-12 h-12 text-slate-650 mx-auto" />
              <p className="text-base font-bold text-slate-350">Inbox is empty</p>
              <p className="text-xs text-slate-500 font-mono">Feedback submitted via portfolio portal connects directly here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-all">
                  <div className="space-y-2 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs sm:text-sm">
                      <span className="font-bold text-slate-100">{msg.name}</span>
                      <span className="text-indigo-400">{msg.email}</span>
                      <span className="text-slate-500 text-xs">
                        Submitted: {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-4xl whitespace-pre-wrap font-medium">
                      {msg.message}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(msg.id!)}
                    className="p-2.5 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500/30 transition-all cursor-pointer inline-flex items-center self-end md:self-center"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: CDN Configuration Settings manager */}
      {activeTab === "settings" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h4 className="font-sans font-extrabold text-xl text-white">Cloudinary CDN Settings</h4>
            <p className="text-slate-450 text-xs font-mono mt-1">
              Customize storage variables below for smooth background media streaming and layouts.
            </p>
          </div>

          <form onSubmit={handleSettingsSave} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Cloud Name</label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-indigo-300 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5 font-bold">Unsigned Upload Preset</label>
              <input
                type="text"
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-indigo-300 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-xs tracking-wider uppercase font-mono cursor-pointer"
            >
              Verify & Save Variables
            </button>
          </form>
        </div>
      )}

    </div>
  );

  // Small helpers inside UI bounds to resolve conditional triggers
  function handleEditEditInit(project: Project) {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      techStack: project.techStack ? project.techStack.join(", ") : "",
      imageUrl: project.imageUrl,
      videoUrl: project.videoUrl || "",
      liveLink: project.liveLink || "",
      apkLink: project.apkLink || "",
      guide: project.guide || "",
    });
    setActiveTab("add");
  }

  function projectFormSubmitWrapper(e: React.FormEvent) {
    handleProjectSubmit(e);
  }
}
