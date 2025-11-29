"use client";

/**
 * サイドバーコンポーネント（フローティングメニュー風 - Cyberpunk UI）
 */
const CATEGORIES = [
  { id: "all", name: "Overview", icon: "📊" },
  { id: "computers", name: "Computers", icon: "💻" },
  { id: "electronics", name: "Electronics", icon: "⚡" },
  { id: "kitchen", name: "Kitchen", icon: "🍳" },
  { id: "videogames", name: "Gaming", icon: "🎮" },
  { id: "hpc", name: "Health", icon: "💊" },
  { id: "beauty", name: "Beauty", icon: "✨" },
  { id: "food", name: "Food", icon: "🍔" },
  { id: "office", name: "Office", icon: "📝" },
];

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-white/5 bg-[#020617]/50 backdrop-blur-sm p-4">
      <div className="space-y-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              selectedCategory === cat.id
                ? "bg-white/5 text-white shadow-neon-cyan border border-primary/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
