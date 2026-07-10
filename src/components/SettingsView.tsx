import React, { useState, useEffect } from "react";
import { Save, RefreshCw, Sliders, User, Lock, Key, AlertCircle, CheckCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface SettingsViewProps {
  onSave: (settings: {
    model: string;
    systemPrompt: string;
  }) => void;
  initialModel: string;
  initialSystemPrompt: string;
  user: any;
}

export default function SettingsView({
  onSave,
  initialModel,
  initialSystemPrompt,
  user
}: SettingsViewProps) {
  // AI Settings states
  const [model, setModel] = useState(initialModel);
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [savedPreferences, setSavedPreferences] = useState(false);

  // Profile states
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Load user name
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
    } else {
      setFullName(localStorage.getItem("route52_guest_name") || "Guest User");
    }
  }, [user]);

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      model,
      systemPrompt
    });
    setSavedPreferences(true);
    setTimeout(() => setSavedPreferences(false), 2500);
  };

  const handleResetPreferences = () => {
    setModel("v4.0-pro-engine");
    setSystemPrompt(
      "You are Route'52, a helpful and knowledgeable Bangla native assistant designed to assist users in both Bangla and English with extreme accuracy and coding expertise."
    );
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    // If changing password, validate matches
    if (password && password !== confirmPassword) {
      setProfileMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (password && password.length < 6) {
      setProfileMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setIsUpdatingProfile(true);

    try {
      if (user && isSupabaseConfigured()) {
        const updateData: any = {
          data: { full_name: fullName }
        };
        if (password) {
          updateData.password = password;
        }

        const { error } = await supabase.auth.updateUser(updateData);
        if (error) throw error;

        setProfileMessage({ type: "success", text: "Profile updated successfully!" });
        setPassword("");
        setConfirmPassword("");
      } else {
        // Guest mode profile update
        localStorage.setItem("route52_guest_name", fullName);
        setProfileMessage({ type: "success", text: "Guest display name updated!" });
      }
    } catch (err: any) {
      console.error("Profile update failed:", err);
      setProfileMessage({ type: "error", text: err.message || "An error occurred while updating profile." });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 select-text space-y-6">
      {/* Header Info - Highly Compact */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/25">
          <Sliders className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-headline font-bold text-on-surface leading-tight">
            Settings & Customization
          </h2>
          <p className="text-[11px] text-on-surface-variant/80">
            Manage your personal profile, secure credentials, and AI assistant behavior.
          </p>
        </div>
      </div>

      {/* Profile & Security Management Card */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
          <User className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider font-mono">
            User Profile & Security
          </span>
        </div>

        {profileMessage && (
          <div
            className={`flex items-start gap-2 p-2.5 rounded-lg text-xs border ${
              profileMessage.type === "success"
                ? "bg-green-500/10 border-green-500/25 text-green-400"
                : "bg-red-500/10 border-red-500/25 text-red-400"
            }`}
          >
            {profileMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            )}
            <span>{profileMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-3">
          {user ? (
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-on-surface-variant/90">
                Email Address (Account ID)
              </label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface-variant/65 font-mono cursor-not-allowed"
              />
            </div>
          ) : (
            <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg text-[11px] text-amber-400/90 leading-relaxed">
              <strong>Notice:</strong> You are currently in Guest Mode. Your chats are saved locally on this browser. Sign in using the button on the top header to sync your chat history and enable passwords.
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-on-surface-variant/90">
              {user ? "Full / Display Name" : "Guest Display Name"}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/70 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="e.g. Mahbub Alam"
            />
          </div>

          {user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-on-surface-variant/90 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-primary/75" />
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/70 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-on-surface-variant/90 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-primary/75" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/70 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-4 py-1.5 bg-primary text-on-primary hover:opacity-95 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-primary/10 disabled:opacity-50"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Model Parameters - Compact Card */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
          <Key className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider font-mono">
            Assistant Behavior & Preferences
          </span>
        </div>

        <form onSubmit={handlePreferencesSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-on-surface-variant/90">
                Active AI Engine Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/70 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="v4.0-pro-engine">v4.0 Pro Engine (Default)</option>
                <option value="gpt-4o">GPT-4o Pro</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-on-surface-variant/90">
                Response Quality
              </label>
              <select className="w-full bg-surface-container-lowest border border-outline-variant/70 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer">
                <option>Highest Fidelity (Double-pass reasoning)</option>
                <option>Balanced Speed & Depth</option>
                <option>Ultra-fast Streaming (Raw outputs)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-on-surface-variant/90">
              System Instructions
            </label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/70 rounded-lg px-2.5 py-1.5 text-xs text-on-surface placeholder-[#2d3d33] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              placeholder="You are Route'52, a Bangla native assistant..."
            />
          </div>

          {/* Buttons - Compact Row */}
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={handleResetPreferences}
              className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-highest border border-outline-variant/60 text-on-surface rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-on-primary hover:opacity-95 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-primary/20"
            >
              <Save className="w-3.5 h-3.5" />
              {savedPreferences ? "Preferences Saved!" : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
