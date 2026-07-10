import React, { useState } from "react";
import { X, Lock, Mail, Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Supabase credentials are not configured. Please go to Settings to add your URL and Anon Key.");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password
        });
        if (signUpErr) throw signUpErr;
        setSuccessMsg("Registration successful! Check your email or try signing in.");
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) throw signInErr;
        if (data.user) {
          onSuccess(data.user);
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-text">
      <div className="bg-surface-container-low border border-outline-variant w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
        {/* Top Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-tertiary to-primary"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-headline font-bold text-lg text-on-surface">
              {isSignUp ? "Create Deep Sea Account" : "Access Secure Dashboard"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!isConfigured && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-400 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Supabase Credentials Not Set</p>
                <p className="mt-1">
                  You can still register and test authentication once you set your custom **Supabase URL** and **Anon Key** inside the **Settings** panel.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-3 text-green-400 text-xs leading-relaxed">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#0d0d15] border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-[#0d0d15] border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing request...</span>
                </>
              ) : (
                <span>{isSignUp ? "Sign Up" : "Sign In to Deep Sea"}</span>
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-primary hover:underline font-medium cursor-pointer"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need a secure account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
