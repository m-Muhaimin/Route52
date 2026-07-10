import React from "react";
import {
  Compass,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  User,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { Thread } from "../types";
import { isSupabaseConfigured } from "../lib/supabase";

interface SidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  currentView: "chat" | "settings" | "help";
  user: any;
  onSignOut: () => void;
}

export default function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  onOpenSettings,
  onOpenHelp,
  currentView,
  user,
  onSignOut
}: SidebarProps) {
  return (
    <aside className="flex flex-col h-screen w-56 bg-surface-container-low border-r border-outline-variant p-3 gap-1.5 sticky top-0 flex-shrink-0 select-none z-40">
      {/* Brand Header - Compact Sizing */}
      <div className="flex items-center gap-2 px-1.5 py-2 mb-1">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <Compass className="text-on-primary w-4.5 h-4.5 animate-spin-slow" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-headline font-black text-on-surface tracking-tight leading-none">
            Route'52
          </span>
          <span className="font-mono text-[9px] text-primary/80 tracking-wider uppercase font-semibold">
            Bangla Assistant
          </span>
        </div>
      </div>

      {/* Navigation - Extremely Denser Items */}
      <nav className="flex-1 mt-1 flex flex-col gap-0.5 overflow-y-auto pr-0.5">
        <button
          onClick={onNewChat}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-left cursor-pointer ${
            currentView === "chat" && !activeThreadId
              ? "text-primary font-bold bg-secondary-container/50 border border-primary/20"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-semibold">New Chat</span>
        </button>

        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-left cursor-pointer ${
            currentView === "settings"
              ? "text-primary font-bold bg-secondary-container/50 border border-primary/20"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs font-semibold">Settings</span>
        </button>

        {/* Dynamic Recent Threads */}
        {threads.length > 0 && (
          <div className="mt-4">
            <span className="px-2 text-[9px] font-mono tracking-wider text-on-surface-variant/50 uppercase block mb-1">
              Conversations
            </span>
            <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto pr-0.5">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-[11px] transition-colors duration-200 cursor-pointer truncate ${
                    activeThreadId === thread.id
                      ? "bg-surface-container-highest text-primary border-l-2 border-primary pl-2 font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40"
                  }`}
                >
                  <MessageSquare className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{thread.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer - Compacted */}
      <div className="mt-auto flex flex-col gap-0.5 pt-2 border-t border-outline-variant/30">
        <button
          onClick={onOpenHelp}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-left cursor-pointer ${
            currentView === "help"
              ? "text-primary font-bold bg-secondary-container/50 border border-primary/20"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">Help & Docs</span>
        </button>

        {user && (
          <button
            onClick={onSignOut}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-left cursor-pointer mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-semibold">Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
