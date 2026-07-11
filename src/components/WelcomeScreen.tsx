import React, { useState } from "react";
import {
  FileText,
  BarChart2,
  Terminal,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  LogOut,
  ShieldCheck,
  Activity,
  Info
} from "lucide-react";
import { QUICK_ACTIONS } from "../lib/chatStorage";
import { QuickAction } from "../types";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface WelcomeScreenProps {
  onSelectAction: (action: QuickAction) => void;
  user: any;
  onOpenAuth: () => void;
  threadsCount?: number;
  onSignOut?: () => void;
}

export default function WelcomeScreen({
  onSelectAction,
  user,
  onOpenAuth,
  threadsCount = 0,
  onSignOut
}: WelcomeScreenProps) {
  // Authentication states for the integrated right-column form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  // Handle local Sign In / Sign Up
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setAuthError("সুপাবেস কনফিগার করা নেই। অনুগ্রহ করে সেটিংস থেকে সুপাবেস ক্রেডেনশিয়াল যুক্ত করুন।");
      return;
    }

    setAuthError(null);
    setAuthSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split("@")[0]
            }
          }
        });
        if (signUpErr) throw signUpErr;
        setAuthSuccess("নিবন্ধন সফল হয়েছে! অনুগ্রহ করে আপনার ইমেল যাচাই করুন অথবা লগইন করুন।");
        // Clear fields
        setFullName("");
        setPassword("");
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) throw signInErr;
        setAuthSuccess("সাফল্যের সাথে লগইন হয়েছে!");
      }
    } catch (err: any) {
      console.error("Welcome Auth Error:", err);
      setAuthError(err.message || "অথেনটিকেশন প্রক্রিয়ায় একটি ত্রুটি ঘটেছে।");
    } finally {
      setLoading(false);
    }
  };

  // Map actions to neon-green themes and icons for ultra high-fidelity styling
  const getActionStyles = (id: string) => {
    switch (id) {
      case "write":
        return {
          icon: <FileText className="w-4 h-4 text-primary" />,
          hoverBorderColor: "hover:border-primary/60",
          hoverTextColor: "group-hover:text-primary"
        };
      case "analyze":
        return {
          icon: <BarChart2 className="w-4 h-4 text-tertiary" />,
          hoverBorderColor: "hover:border-tertiary/60",
          hoverTextColor: "group-hover:text-tertiary"
        };
      case "debug":
        return {
          icon: <Terminal className="w-4 h-4 text-primary" />,
          hoverBorderColor: "hover:border-primary/60",
          hoverTextColor: "group-hover:text-primary"
        };
      case "brainstorm":
        return {
          icon: <Sparkles className="w-4 h-4 text-tertiary" />,
          hoverBorderColor: "hover:border-tertiary/60",
          hoverTextColor: "group-hover:text-tertiary"
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-primary" />,
          hoverBorderColor: "hover:border-primary/60",
          hoverTextColor: "group-hover:text-primary"
        };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-4 select-none z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Welcome Information, Branding, and Quick Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="text-left space-y-4">
            {/* Active Engine Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-surface-container-low border border-primary/20 rounded-full gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary"></span>
              <span className="font-mono text-[10px] font-semibold text-primary tracking-wider uppercase">
                Route'52 — বাংলাদেশ-নেটিভ AI
              </span>
            </div>

            {/* Title / Description */}
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-on-surface leading-tight">
              আসসালামু আলাইকুম! <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary">
                আমি Route'52
              </span>
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant/90 max-w-xl leading-relaxed">
              আপনার প্রিয় বাংলা ভাষার বুদ্ধিমান সহকারী। প্রাকৃতিক, সাবলীল এবং সংস্কৃতি-সংবেদনশীল উপায়ে বাংলা ও ইংরেজিতে যেকোনো সাহায্য করতে আমি প্রস্তুত।
            </p>
          </div>

          {/* Quick Action Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-on-surface/80 uppercase tracking-widest font-mono">
                সরাসরি শুরু করার কিছু উপায়
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => {
                const styles = getActionStyles(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => onSelectAction(action)}
                    className={`glass-card p-4.5 text-left rounded-xl transition-all duration-300 group flex flex-col gap-2.5 border border-outline-variant/60 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/5 cursor-pointer text-inherit ${styles.hoverBorderColor}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      {/* Icon */}
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary/30 transition-colors">
                        {styles.icon}
                      </div>
                      <span className="text-[9px] font-mono font-medium text-on-surface-variant/50 group-hover:text-primary transition-colors uppercase">
                        {action.id}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className={`font-headline font-semibold text-xs text-on-surface ${styles.hoverTextColor} transition-colors`}>
                        {action.title}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                        {action.description}
                      </p>
                    </div>

                    <div className={`mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[10px] font-mono font-medium ${styles.hoverTextColor}`}>
                      Try prompt <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Beautiful Split Auth Box or User Session Card */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {!user ? (
            /* Unauthenticated state: Integrated Split Sign In / Sign Up Panel */
            <div className="bg-surface-container-low/70 border border-outline-variant/60 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full backdrop-blur-md">
              {/* Top Accent Lines */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-tertiary to-primary"></div>
              
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">
                      {isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "ক্লাউড সিঙ্ক্রোনাইজেশন পোর্টাল"}
                    </h2>
                  </div>
                  <p className="text-[11.5px] text-on-surface-variant leading-relaxed">
                    {isSignUp 
                      ? "আপনার চ্যাট ইতিহাস মেঘের উপরে সুরক্ষিত রাখতে প্রয়োজনীয় তথ্য দিন।" 
                      : "হিস্ট্রি সিঙ্ক, ডিভাইস কানেক্টিভিটি এবং সুরক্ষিত ডাটা অ্যাক্সেস করুন।"}
                  </p>
                </div>

                {/* Configuration Alerts if Supabase is missing */}
                {!isConfigured && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex gap-2.5 text-amber-400 text-[11px] leading-relaxed">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">সুপাবেস সেটআপ প্রয়োজন</p>
                      <p className="mt-0.5">
                        অফলাইন চ্যাট সচল আছে। মেঘে সংরক্ষণ করতে আপনার নিজস্ব **সুপাবেস ক্রেডেনশিয়াল** সেটিংস থেকে যুক্ত করুন।
                      </p>
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex gap-2.5 text-red-400 text-[11px] leading-relaxed">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3.5 flex gap-2.5 text-green-400 text-[11px] leading-relaxed">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {/* Submit Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-semibold text-on-surface-variant/90 uppercase tracking-wider font-mono">
                        ব্যবহারকারীর নাম (Full Name)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/60" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="উদাঃ আবির রহমান"
                          className="w-full bg-[#070b08] border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-on-surface-variant/90 uppercase tracking-wider font-mono">
                      ইমেল ঠিকানা (Email)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="yourname@domain.com"
                        className="w-full bg-[#070b08] border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-on-surface-variant/90 uppercase tracking-wider font-mono">
                      পাসওয়ার্ড (Password)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/60" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full bg-[#070b08] border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/15 disabled:opacity-50 font-headline"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>অপেক্ষা করুন...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Form Mode Toggle footer */}
              <div className="text-center pt-4 border-t border-outline-variant/40 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  {isSignUp 
                    ? "ইতিমধ্যেই অ্যাকাউন্ট আছে? লগইন করুন" 
                    : "নতুন ব্যবহারকারী? একটি সুরক্ষিত অ্যাকাউন্ট তৈরি করুন"}
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated state: Beautiful Integrated Active Session Panel */
            <div className="bg-surface-container-low/70 border border-outline-variant/60 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full backdrop-blur-md">
              {/* Ambient Glowing Spot */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 filter blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-base font-bold shadow-lg shadow-primary/5 select-none shrink-0">
                    {user.user_metadata?.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || "AI"}
                  </div>
                  <div className="space-y-0.5 truncate">
                    <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-primary">
                      সক্রিয় সেশন (Logged In)
                    </p>
                    <h3 className="font-headline font-bold text-sm text-on-surface truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </h3>
                    <p className="text-[11px] font-mono text-on-surface-variant/70 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Environment Sync Stats */}
                <div className="space-y-2.5">
                  <span className="text-[9.5px] font-mono font-bold text-on-surface-variant/80 uppercase tracking-widest">
                    টেলিমেট্রি স্ট্যাটাস
                  </span>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Database Synced Indicator */}
                    <div className="bg-[#070b08]/50 border border-outline-variant/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[11.5px] text-on-surface-variant">ক্লাউড ক্লায়েন্ট ব্যাকআপ</span>
                      </div>
                      <span className="bg-primary/15 text-primary font-mono text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        দ্বিমুখী সিঙ্ক সচল
                      </span>
                    </div>

                    {/* Chat history counter */}
                    <div className="bg-[#070b08]/50 border border-outline-variant/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-tertiary" />
                        <span className="text-[11.5px] text-on-surface-variant">মোট সংরক্ষিত আলোচনা</span>
                      </div>
                      <span className="text-[11.5px] font-mono font-bold text-on-surface">
                        {threadsCount} টি থ্রেড
                      </span>
                    </div>

                    {/* Model Config Details */}
                    <div className="bg-[#070b08]/50 border border-outline-variant/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[11.5px] text-on-surface-variant">প্রসেসিং ইঞ্জিন</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-on-surface bg-surface-container-high border border-outline-variant/55 px-2 py-0.5 rounded-md">
                        v4.0-pro-engine
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action CTAs inside User panel */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onSelectAction({ id: "new-chat", title: "নতুন আলোচনা", description: "", icon: "sparkles", prompt: "হাই Route'52, আমি একটি নতুন বিষয়ে সাহায্য চাই।" })}
                    className="w-full py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/15 active:scale-95 font-headline"
                  >
                    <span>নতুন চ্যাট কথোপকথন শুরু করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onSignOut && (
                    <button
                      onClick={onSignOut}
                      className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface-variant hover:text-red-400 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 font-headline"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>সেশন সমাপ্ত করুন (Sign Out)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Info Disclaimer footer */}
              <div className="text-center pt-4 border-t border-outline-variant/30 mt-6 select-none flex items-center justify-center gap-1.5 opacity-55">
                <Info className="w-3 h-3" />
                <span className="text-[10px] font-mono">Route'52 Local Shield Active</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
