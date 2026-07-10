import React from "react";
import { FileText, BarChart2, Terminal, Sparkles, ArrowRight, Lock } from "lucide-react";
import { QUICK_ACTIONS } from "../lib/chatStorage";
import { QuickAction } from "../types";

interface WelcomeScreenProps {
  onSelectAction: (action: QuickAction) => void;
  user: any;
  onOpenAuth: () => void;
}

export default function WelcomeScreen({ onSelectAction, user, onOpenAuth }: WelcomeScreenProps) {
  // Map actions to neon-green themes and icons for ultra high-fidelity styling
  const getActionStyles = (id: string) => {
    switch (id) {
      case "write":
        return {
          icon: <FileText className="w-5 h-5 text-primary" />,
          hoverBorderColor: "hover:border-primary/60",
          hoverTextColor: "group-hover:text-primary"
        };
      case "analyze":
        return {
          icon: <BarChart2 className="w-5 h-5 text-tertiary" />,
          hoverBorderColor: "hover:border-tertiary/60",
          hoverTextColor: "group-hover:text-tertiary"
        };
      case "debug":
        return {
          icon: <Terminal className="w-5 h-5 text-primary" />,
          hoverBorderColor: "hover:border-primary/60",
          hoverTextColor: "group-hover:text-primary"
        };
      case "brainstorm":
        return {
          icon: <Sparkles className="w-5 h-5 text-tertiary" />,
          hoverBorderColor: "hover:border-tertiary/60",
          hoverTextColor: "group-hover:text-tertiary"
        };
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-primary" />,
          hoverBorderColor: "hover:border-primary/60",
          hoverTextColor: "group-hover:text-primary"
        };
    }
  };

  return (
    <div className="w-full max-w-3xl z-10 text-center flex flex-col items-center mx-auto py-6 select-none">
      {/* Active Engine Badge - Highly Compact */}
      <div className="mb-4 inline-flex items-center px-3 py-1 bg-surface-container-low border border-primary/20 rounded-full gap-2 shadow-sm animate-fade-in">
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary"></span>
        <span className="font-mono text-[10px] font-semibold text-primary tracking-wider uppercase">
          Route'52 Bangla AI Active
        </span>
      </div>

      {/* Main Title - Compact Typography */}
      <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight text-on-surface leading-snug">
        আসসালামু আলাইকুম! আমি Route'52
      </h1>
      <p className="text-xs md:text-sm text-on-surface-variant/85 max-w-lg mb-6 leading-relaxed">
        আপনার প্রিয় বাংলা নেটিভ অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি?
      </p>

      {/* Unauthenticated State Hero Card */}
      {!user && (
        <div className="w-full max-w-2xl px-2 mb-6 animate-fade-in">
          <div className="bg-gradient-to-r from-primary/10 to-[#0e2715]/30 border border-primary/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-xl shadow-primary/5 hover:border-primary/50 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 filter blur-2xl rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/10">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                  <span>ক্লাউড হিস্ট্রি এবং সিঙ্ক চালু করুন</span>
                  <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-extrabold">
                    Recommended
                  </span>
                </h3>
                <p className="text-[11.5px] text-on-surface-variant/90 leading-relaxed max-w-lg">
                  আপনি বর্তমানে অতিথি মোডে আছেন। আপনার সব কথোপকথনগুলি মেঘের উপরে সুরক্ষিতভাবে সংরক্ষণ এবং যেকোনো ডিভাইস থেকে অ্যাক্সেস করতে অনুগ্রহ করে অ্যাকাউন্টটি যুক্ত করুন।
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={onOpenAuth}
                className="w-full md:w-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-on-primary rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/35 font-headline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>লগইন / সাইন আপ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Cards Grid - Extremely Compact and Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-2">
        {QUICK_ACTIONS.map((action) => {
          const styles = getActionStyles(action.id);
          return (
            <button
              key={action.id}
              onClick={() => onSelectAction(action)}
              className={`glass-card p-4 text-left rounded-xl transition-all duration-300 group flex flex-col gap-2 border border-outline-variant/60 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/5 cursor-pointer text-inherit ${styles.hoverBorderColor}`}
            >
              {/* Icon Container with glowing ring effect */}
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary/30 transition-colors">
                {styles.icon}
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5">
                <h3 className={`font-headline font-semibold text-xs text-on-surface ${styles.hoverTextColor} transition-colors`}>
                  {action.title}
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {action.description}
                </p>
              </div>

              {/* Try This Hover Accent */}
              <div className={`mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[10px] font-mono font-medium ${styles.hoverTextColor}`}>
                Try this <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
