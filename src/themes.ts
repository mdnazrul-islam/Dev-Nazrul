export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  isFruit: boolean;
  image: string; // High-resolution Unsplash image of the item
  accentColor: string; // Tailwind color name for button highlights and text states
  accentClass: string; // Specific accent text color
  bgGradient: string; // Secondary atmospheric glow gradient
}

export const AVAILABLE_THEMES: AppTheme[] = [
  {
    id: "dark",
    name: "Dark",
    emoji: "🌙",
    isFruit: false,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80",
    accentColor: "indigo",
    accentClass: "text-indigo-400 border-indigo-500/25 bg-indigo-500/10",
    bgGradient: "from-indigo-950/20 via-slate-950/30 to-slate-950/40"
  },
  {
    id: "light",
    name: "Light",
    emoji: "☀️",
    isFruit: false,
    image: "https://images.unsplash.com/photo-1542897565-c463a50caa9b?w=1200&auto=format&fit=crop&q=80",
    accentColor: "indigo",
    accentClass: "text-indigo-600 border-indigo-600/20 bg-indigo-600/5",
    bgGradient: "from-indigo-100/10 via-slate-50/20 to-slate-100/10"
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1200&auto=format&fit=crop&q=80",
    accentColor: "rose",
    accentClass: "text-rose-400 border-rose-500/25 bg-rose-500/15",
    bgGradient: "from-red-950/20 via-rose-950/25 to-slate-950/30"
  },
  {
    id: "pineapple",
    name: "Pineapple",
    emoji: "🍍",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1200&auto=format&fit=crop&q=80",
    accentColor: "amber",
    accentClass: "text-amber-400 border-amber-500/25 bg-amber-500/15",
    bgGradient: "from-amber-950/20 via-yellow-950/20 to-slate-950/30"
  },
  {
    id: "mango",
    name: "Mango",
    emoji: "🥭",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1200&auto=format&fit=crop&q=80",
    accentColor: "orange",
    accentClass: "text-orange-400 border-orange-500/25 bg-orange-500/15",
    bgGradient: "from-orange-950/20 via-amber-950/25 to-slate-950/30"
  },
  {
    id: "strawberry",
    name: "Strawberry",
    emoji: "🍓",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1200&auto=format&fit=crop&q=80",
    accentColor: "pink",
    accentClass: "text-pink-400 border-pink-500/25 bg-pink-500/15",
    bgGradient: "from-pink-950/25 via-rose-950/20 to-slate-950/30"
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=1200&auto=format&fit=crop&q=80",
    accentColor: "yellow",
    accentClass: "text-yellow-400 border-yellow-500/25 bg-yellow-550/15",
    bgGradient: "from-yellow-950/20 via-amber-950/20 to-slate-950/35"
  },
  {
    id: "green mango",
    name: "Green Mango",
    emoji: "🍏",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=1200&auto=format&fit=crop&q=80",
    accentColor: "emerald",
    accentClass: "text-emerald-400 border-emerald-500/25 bg-emerald-500/15",
    bgGradient: "from-emerald-950/25 via-teal-950/20 to-slate-950/30"
  },
  {
    id: "orange",
    name: "Orange",
    emoji: "🍊",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1200&auto=format&fit=crop&q=80",
    accentColor: "orange",
    accentClass: "text-orange-400 border-orange-500/25 bg-orange-550/15",
    bgGradient: "from-orange-950/20 via-yellow-950/20 to-slate-950/30"
  },
  {
    id: "cherry",
    name: "Cherry",
    emoji: "🍒",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=1200&auto=format&fit=crop&q=80",
    accentColor: "red",
    accentClass: "text-rose-450 border-rose-550/25 bg-rose-500/15",
    bgGradient: "from-rose-950/25 via-red-950/25 to-slate-950/30"
  },
  {
    id: "ice apple",
    name: "Ice Apple",
    emoji: "🧊",
    isFruit: true,
    image: "https://images.unsplash.com/photo-1508349657574-1113c586aa27?w=1200&auto=format&fit=crop&q=80",
    accentColor: "sky",
    accentClass: "text-sky-400 border-sky-500/25 bg-sky-500/15",
    bgGradient: "from-sky-950/25 via-cyan-950/20 to-slate-950/30"
  }
];
