"use client";

import { useCategory } from "@/contexts/CategoryContext";

/**
 * サイドバーコンポーネント（プロフェッショナルなSaaS管理画面風）
 */
const MENUS = [
  { label: "Dashboard", icon: "📊", id: "all" },
  { label: "Computers", icon: "💻", id: "computers" },
  { label: "Electronics", icon: "📱", id: "electronics" },
  { label: "Gaming", icon: "🎮", id: "videogames" },
  { label: "Kitchen", icon: "☕", id: "kitchen" },
  { label: "Health", icon: "💊", id: "hpc" },
  { label: "Beauty", icon: "✨", id: "beauty" },
  { label: "Food", icon: "🛒", id: "food" },
  { label: "Office", icon: "📁", id: "office" },
];

export default function Sidebar() {
  const { selectedCategory, setSelectedCategory } = useCategory();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border flex flex-col z-50">
      <div className="h-14 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-white tracking-tight">
          <div className="w-5 h-5 bg-primary rounded-sm"></div>
          XIORA <span className="text-text-dim font-normal">Analytics</span>
        </div>
      </div>

      <div className="p-3 space-y-0.5 overflow-y-auto flex-1">
        <div className="px-3 py-2 text-xs font-medium text-text-dim uppercase tracking-wider">
          Market Overview
        </div>
        {MENUS.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCategory(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left group ${
              selectedCategory === item.id
                ? "bg-surfaceHighlight text-white"
                : "text-text-muted hover:bg-surfaceHighlight hover:text-white"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surfaceHighlight flex items-center justify-center text-xs font-medium text-text-muted">
            You
          </div>
          <div className="text-xs">
            <div className="text-white font-medium">Owner</div>
            <div className="text-text-dim">Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
