import React from "react";
import { Menu, User, LogIn } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  user: any;
  onOpenAuthModal?: () => void;
}

export default function Header({
  onMenuToggle,
  user,
  onOpenAuthModal
}: HeaderProps) {
  return (
    <header className="bg-surface border-b border-outline-variant/60 flex justify-between items-center px-4 py-2.5 w-full sticky top-0 z-30 backdrop-blur-md bg-opacity-95 select-none">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Brand/title */}
        <h1 className="text-[15px] font-headline font-bold text-on-surface flex items-center gap-2">
          <span className="text-primary font-black tracking-tight">Route'52</span>
          <span className="text-on-surface-variant/75 font-semibold text-xs border-l border-outline-variant/40 pl-2">
            Bangla Native Assistant
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Supabase user indicator */}
        {user ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-semibold text-on-surface">
                {user.email}
              </span>
              <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-wider">
                Secured
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-mono text-xs font-extrabold shadow-md select-none">
              {user.email ? user.email.substring(0, 1).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-[11px] font-semibold cursor-pointer shadow-sm transition-all hover:shadow-primary/20"
          >
            <LogIn className="w-3 h-3" />
            <span>Get Started</span>
          </button>
        )}
      </div>
    </header>
  );
}
