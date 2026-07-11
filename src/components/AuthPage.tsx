import React, { useState } from "react";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  Bot,
  Zap,
  Globe,
  ArrowRight,
  ShieldCheck,
  History,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthPageProps {
  onSuccess: (user: any) => void;
  onEnterAsGuest: () => void;
}

export default function AuthPage({ onSuccess, onEnterAsGuest }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("সুপাবেস ক্রেডেনশিয়াল সেট আপ করা নেই। সেটিংস প্যানেল থেকে আপনার Supabase URL ও Anon Key যুক্ত করুন, অথবা গেস্ট হিসেবে প্রবেশ করুন।");
      return;
    }

    setError(null);
    setSuccessMsg(null);
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
        setSuccessMsg("নিবন্ধন সফল হয়েছে! অনুগ্রহ করে লগইন করুন অথবা ইমেল যাচাই করুন।");
        // Reset form to login or clear
        setFullName("");
        setPassword("");
        setIsSignUp(false);
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) throw signInErr;
        if (data.user) {
          onSuccess(data.user);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "অথেনটিকেশন প্রক্রিয়ায় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050806] text-on-background flex flex-col md:flex-row font-sans relative overflow-hidden select-none">
      
      {/* Background Decorative Cyber Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary filter blur-[150px] rounded-full animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-tertiary filter blur-[130px] rounded-full animate-pulse duration-[6000ms]"></div>
      </div>

      {/* LEFT COLUMN: Atmospheric Branding & Visual Showcase */}
      <div className="flex-1 lg:flex-[1.2] relative overflow-hidden flex flex-col justify-between p-8 lg:p-14 border-b md:border-b-0 md:border-r border-outline-variant/30 z-10 bg-[#060a07]/80 backdrop-blur-md">
        
        {/* Top Branding Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-5 h-5 text-on-primary" />
          </div>
          <div>
            <h2 className="font-headline font-black text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-white uppercase">
              Route'52
            </h2>
            <p className="text-[9px] font-mono font-medium text-primary/80 uppercase tracking-widest mt-0.5">
              বাংলাদেশ-নেটিভ AI
            </p>
          </div>
        </div>

        {/* Middle Core Hero Text & Interactive Feature Badges */}
        <div className="my-10 md:my-auto space-y-8 max-w-xl">
          <div className="space-y-4">
            {/* Live Indicator */}
            <div className="inline-flex items-center px-2.5 py-0.5 bg-primary/10 border border-primary/25 rounded-full gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full absolute"></span>
              <span className="font-mono text-[9px] font-bold text-primary tracking-wider uppercase">
                Active Client Portal
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-on-surface leading-[1.15]">
              প্রযুক্তির সাথে <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-white">
                মায়ের ভাষার মেলবন্ধন
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed font-normal">
              Route'52 কেবল একটি অনুবাদক নয়, এটি সম্পূর্ণ সংস্কৃতি-সংবেদনশীল উপায়ে বাংলাদেশি ভাবাবেগ, ইতিহাস ও প্রয়োজন বুঝে কাজ করতে প্রস্তুত এক উন্নত কৃত্রিম বুদ্ধিমত্তা।
            </p>
          </div>

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <div className="flex gap-3 items-start p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20 hover:border-primary/20 transition-all duration-300">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-on-surface">বাংলাদেশি সংস্কৃতি-সংবেদনশীল</h4>
                <p className="text-[10px] text-on-surface-variant/70 leading-normal">স্বাভাবিক ও সাবলীল বাংলা ভাষা বোঝে এবং উত্তর দেয়।</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20 hover:border-tertiary/20 transition-all duration-300">
              <div className="p-2 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-on-surface">ক্লাউড সিঙ্ক্রোনাইজেশন</h4>
                <p className="text-[10px] text-on-surface-variant/70 leading-normal">আপনার চ্যাট এবং থ্রেড হিস্ট্রি নিরাপদে মেঘে সুরক্ষিত থাকে।</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20 hover:border-primary/20 transition-all duration-300">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-on-surface">গতিশীল n8n ইন্টিগ্রেশন</h4>
                <p className="text-[10px] text-on-surface-variant/70 leading-normal">লাইভ n8n AI চ্যাট ওয়েবহুকের মাধ্যমে রিয়েল-টাইম প্রসেসিং।</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20 hover:border-tertiary/20 transition-all duration-300">
              <div className="p-2 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-on-surface">অফলাইন গেস্ট মোড</h4>
                <p className="text-[10px] text-on-surface-variant/70 leading-normal">লগইন ছাড়াই লোকাল ব্রাউজারে সুরক্ষিত ডেটা নিয়ে ব্যবহারের সুবিধা।</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info banner */}
        <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant/40 pt-4 md:pt-0 border-t md:border-0 border-outline-variant/20">
          <span>SYSTEM ENGINE: v4.0-PRO</span>
          <span>SECURED WITH LOCAL SHIELD</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Login/Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 z-10 bg-[#050806] relative">
        <div className="w-full max-w-md space-y-7">
          
          {/* Header Description */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-headline text-xl sm:text-2xl font-black text-on-surface tracking-tight">
              {isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "ক্লাউড সিঙ্ক পোর্টালে প্রবেশ করুন"}
            </h2>
            <p className="text-[11.5px] text-on-surface-variant/80 max-w-sm leading-relaxed">
              {isSignUp 
                ? "আপনার সমস্ত চ্যাট ইতিহাস মেঘের উপর সুরক্ষিত রাখতে এবং যেকোনো ডিভাইস থেকে অ্যাক্সেস করতে প্রয়োজনীয় তথ্য দিন।" 
                : "আপনার পূর্বের আলোচনা এবং সেটিংস ফিরে পেতে আপনার অ্যাকাউন্টে লগইন করুন।"}
            </p>
          </div>

          {/* Configuration Banner warning if Supabase keys are absent */}
          {!isConfigured && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-amber-400 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">সুপাবেস এখনো কনফিগার করা নেই</p>
                <p className="mt-1">
                  ক্লাউড সিঙ্ক্রোনাইজেশন ব্যবহার করতে আপনাকে সেটিংস থেকে আপনার **Supabase URL** এবং **Anon Key** প্রদান করতে হবে। আপাতত আপনি নির্দ্বিধায় **গেস্ট মোড** ব্যবহার করে সম্পূর্ণ অফলাইনে চ্যাট চালিয়ে যেতে পারেন!
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-red-400 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex gap-3 text-green-400 text-xs leading-relaxed">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Core Auth Submit Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-on-surface-variant/90 uppercase tracking-widest font-mono">
                  পূর্ণ নাম (Full Name)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="উদাঃ শেখ সিয়াম রহমান"
                    className="w-full bg-[#070b08] border border-outline-variant/60 rounded-xl pl-11 pr-4 py-3 text-xs text-on-surface placeholder-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant/90 uppercase tracking-widest font-mono">
                ইমেল ঠিকানা (Email Address)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="yourname@domain.com"
                  className="w-full bg-[#070b08] border border-outline-variant/60 rounded-xl pl-11 pr-4 py-3 text-xs text-on-surface placeholder-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant/90 uppercase tracking-widest font-mono">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-[#070b08] border border-outline-variant/60 rounded-xl pl-11 pr-4 py-3 text-xs text-on-surface placeholder-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 active:scale-[0.99] font-headline"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>প্রক্রিয়া করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "ক্লাউড পোর্টালে প্রবেশ করুন"}</span>
                </>
              )}
            </button>
          </form>

          {/* Form Divider & Helper Actions */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/30">
            <div className="flex flex-col gap-2.5 text-center">
              
              {/* Form Toggle button */}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-primary hover:underline font-semibold cursor-pointer"
              >
                {isSignUp 
                  ? "ইতিমধ্যেই অ্যাকাউন্ট আছে? লগইন করুন" 
                  : "নতুন ব্যবহারকারী? একটি অ্যাকাউন্ট তৈরি করুন"}
              </button>

              {/* Guest Access Option */}
              <button
                type="button"
                onClick={onEnterAsGuest}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary/30 text-on-surface rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>গেস্ট হিসেবে প্রবেশ করুন (অফলাইন মোড)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

          {/* Setup tips and notice */}
          <div className="flex items-start gap-2.5 text-[10.5px] text-on-surface-variant/55 bg-surface-container-low/20 p-3 rounded-xl border border-outline-variant/10">
            <HelpCircle className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              সুপাবেস হচ্ছে একটি রিয়েল-টাইম ক্লাউড ডেটাবেস। নিজের ডেটাবেস সেট আপ করতে সেটিংস থেকে VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY কনফিগার করুন।
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
