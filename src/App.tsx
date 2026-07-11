import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Loader2,
  Sparkles,
  Info,
  X
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageBubble from "./components/MessageBubble";
import SettingsView from "./components/SettingsView";
import HelpView from "./components/HelpView";
import AuthModal from "./components/AuthModal";
import { Thread, Message, QuickAction } from "./types";
import { loadThreads, saveThreads } from "./lib/chatStorage";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

export default function App() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>("async-queue-demo");
  const [currentView, setCurrentView] = useState<"chat" | "settings" | "help">("chat");
  
  // Input states
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Authentication states
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Settings states
  const [webhookUrl, setWebhookUrl] = useState(() => {
    const saved = localStorage.getItem("route52_webhook");
    const oldDefaults = [
      "https://n8n-m1if.muhaimin.dev/webhook/bd-native-agent-chat/chat",
      "https://n8n-m1if.muhaimin.dev/webhook/3572f7fd-e15d-4208-87a3-1bef0c7d2312/chat"
    ];
    if (!saved || oldDefaults.includes(saved)) {
      localStorage.setItem("route52_webhook", "https://n8n-m1if.muhaimin.dev/webhook/9db2cf03-b24c-43aa-9940-af3d80fd8a58/chat");
      return "https://n8n-m1if.muhaimin.dev/webhook/9db2cf03-b24c-43aa-9940-af3d80fd8a58/chat";
    }
    return saved;
  });
  const [activeModel, setActiveModel] = useState(() => {
    return localStorage.getItem("route52_model") || "v4.0-pro-engine";
  });
  const [systemPrompt, setSystemPrompt] = useState(() => {
    return localStorage.getItem("route52_system_prompt") || "You are Route'52, a helpful and knowledgeable Bangla native assistant designed to assist users in both Bangla and English with extreme accuracy and coding expertise.";
  });

  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    return localStorage.getItem("route52_supabase_url") || (import.meta as any).env.VITE_SUPABASE_URL || "";
  });
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => {
    return localStorage.getItem("route52_supabase_anon_key") || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";
  });

  // Mobile menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  // Scroll position change handler
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const threshold = 150;
    const isNear = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
    isNearBottomRef.current = isNear;
  };

  // Listen to Supabase Auth State Changes
  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Get current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Listen to changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [supabaseUrl, supabaseAnonKey]);

  // Load threads on mount or when user changes
  useEffect(() => {
    async function loadAllThreads() {
      if (user && isSupabaseConfigured()) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from("conversation_history")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;

          if (data && data.length > 0) {
            const loaded: Thread[] = data.map((row: any) => ({
              id: row.session_id,
              title: row.data?.title || "Conversation",
              createdAt: row.created_at || row.data?.createdAt,
              messages: row.data?.messages || []
            }));
            setThreads(loaded);
            if (!activeThreadId || !loaded.some(t => t.id === activeThreadId)) {
              setActiveThreadId(loaded[0].id);
            }
          } else {
            setThreads([]);
          }
        } catch (err) {
          console.error("Failed to load threads from Supabase:", err);
          // Fallback to local
          const loaded = loadThreads();
          setThreads(loaded);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Fallback to local
        const loaded = loadThreads();
        setThreads(loaded);
        if (loaded.length > 0 && !activeThreadId) {
          setActiveThreadId(loaded[0].id);
        }
      }
    }

    loadAllThreads();
  }, [user, supabaseUrl, supabaseAnonKey]);

  // Save/Upsert Thread to Supabase
  const syncThreadToSupabase = async (thread: Thread, userId: string) => {
    if (!isSupabaseConfigured()) return;
    try {
      // Check if thread exists
      const { data: existing, error: fetchErr } = await supabase
        .from("conversation_history")
        .select("id")
        .eq("session_id", thread.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      const payload = {
        session_id: thread.id,
        user_id: userId,
        data: {
          title: thread.title,
          createdAt: thread.createdAt,
          messages: thread.messages
        }
      };

      if (existing) {
        const { error: updateErr } = await supabase
          .from("conversation_history")
          .update(payload)
          .eq("session_id", thread.id)
          .eq("user_id", userId);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("conversation_history")
          .insert([payload]);
        if (insertErr) throw insertErr;
      }
    } catch (err) {
      console.error("Supabase sync failed:", err);
    }
  };

  // Save threads when updated
  const updateThreads = (newThreads: Thread[], threadToSync?: Thread) => {
    setThreads(newThreads);
    saveThreads(newThreads);

    // Sync to Supabase if logged in
    if (user && threadToSync) {
      syncThreadToSupabase(threadToSync, user.id);
    }
  };

  // Scroll to bottom when message list changes (unless user scrolled up)
  useEffect(() => {
    if (isNearBottomRef.current) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [threads, isLoading]);

  // Always force scroll to bottom when changing threads
  useEffect(() => {
    isNearBottomRef.current = true;
    chatBottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [activeThreadId]);

  // Adjust textarea height on input change
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${Math.min(textRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Handle Thread Select
  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    setCurrentView("chat");
    setMobileMenuOpen(false);
  };

  // Handle New Chat Trigger
  const handleNewChat = () => {
    setActiveThreadId(null);
    setCurrentView("chat");
    setMobileMenuOpen(false);
  };

  // View Navigation Helpers
  const handleOpenSettings = () => {
    setCurrentView("settings");
    setMobileMenuOpen(false);
  };

  const handleOpenHelp = () => {
    setCurrentView("help");
    setMobileMenuOpen(false);
  };

  // Save Config Settings
  const handleSaveSettings = (config: {
    model: string;
    systemPrompt: string;
  }) => {
    setActiveModel(config.model);
    setSystemPrompt(config.systemPrompt);

    localStorage.setItem("route52_model", config.model);
    localStorage.setItem("route52_system_prompt", config.systemPrompt);
  };

  // Sign out helper
  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
      setUser(null);
      setActiveThreadId(null);
      setCurrentView("chat");
      setThreads(loadThreads());
    }
  };

  // Helper to parse n8n response safely
  const parseResponse = (data: any): string => {
    if (Array.isArray(data)) {
      if (data.length > 0) return parseResponse(data[0]);
      return "No response received from the n8n endpoint.";
    }
    if (typeof data === "object" && data !== null) {
      const candidates = ["reply", "output", "response", "text", "message", "content", "data"];
      for (const key of candidates) {
        if (typeof data[key] === "string" && data[key].trim()) {
          return data[key];
        }
        if (typeof data[key] === "object" && data[key] !== null) {
          const nested = parseResponse(data[key]);
          if (nested && !nested.startsWith("No message") && !nested.startsWith("{")) {
            return nested;
          }
        }
      }
      for (const key of Object.keys(data)) {
        if (typeof data[key] === "string" && data[key].trim()) {
          return data[key];
        }
      }
      return JSON.stringify(data, null, 2);
    }
    if (typeof data === "string") {
      return data;
    }
    return "No message body found in n8n response.";
  };

  // Send Message Logic
  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = (textToSend || input).trim();
    if (!finalMsg && attachedFiles.length === 0) return;

    setInput("");
    setIsLoading(true);
    isNearBottomRef.current = true;

    // Format attached files if any
    let contentWithAttachments = finalMsg;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => `\`[File: ${f.name} (${f.size})]\``).join(" ");
      contentWithAttachments = `${fileNames}\n\n${finalMsg}`;
      setAttachedFiles([]);
    }

    const userMessageId = `u-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: contentWithAttachments,
      timestamp: "Just now"
    };

    let currentThreadId = activeThreadId;
    let updatedThreadList = [...threads];
    let activeThreadObj: Thread;

    // Create a new thread if none is active or if active thread is not present in the threads list
    const threadExists = threads.some((t) => t.id === currentThreadId);
    if (!currentThreadId || !threadExists) {
      currentThreadId = `t-${Date.now()}`;
      const title = finalMsg.substring(0, 30) + (finalMsg.length > 30 ? "..." : "");
      activeThreadObj = {
        id: currentThreadId,
        title: title || "New Conversation",
        createdAt: new Date().toISOString(),
        messages: [userMessage]
      };
      updatedThreadList = [activeThreadObj, ...updatedThreadList];
      setActiveThreadId(currentThreadId);
      updateThreads(updatedThreadList, activeThreadObj);
    } else {
      // Append to active thread
      updatedThreadList = threads.map((t) => {
        if (t.id === currentThreadId) {
          activeThreadObj = {
            ...t,
            messages: [...t.messages, userMessage]
          };
          return activeThreadObj;
        }
        return t;
      });
      updateThreads(updatedThreadList, activeThreadObj!);
    }

    // Create assistant message with loading/initial state
    const botMessageId = `b-${Date.now()}`;
    let botReplyText = "";
    
    const initialBotMessage: Message = {
      id: botMessageId,
      role: "assistant",
      content: "",
      timestamp: "Just now"
    };

    // Append user message AND the placeholder assistant message to threads
    let currentThreadsWithBot = updatedThreadList.map((t) => {
      if (t.id === currentThreadId) {
        return {
          ...t,
          messages: [...t.messages, initialBotMessage]
        };
      }
      return t;
    });
    setThreads(currentThreadsWithBot);

    try {
      // Call Express Proxy Backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contentWithAttachments,
          sessionId: currentThreadId,
          customWebhookUrl: webhookUrl
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            let contentToParse = trimmedLine;
            if (contentToParse.startsWith("data:")) {
              contentToParse = contentToParse.slice(5).trim();
              if (contentToParse === "[DONE]") continue;
            }

            // Attempt to parse chunk as JSON
            try {
              const parsed = JSON.parse(contentToParse);
              if (typeof parsed === "object" && parsed !== null) {
                const chunk = parsed.chunk || parsed.text || parsed.output || parsed.response || parsed.message || parsed.content || parsed.reply || "";
                if (chunk) {
                  botReplyText += chunk;
                } else {
                  // Fallback: search for any non-empty string fields
                  let found = "";
                  for (const key of Object.keys(parsed)) {
                    if (typeof parsed[key] === "string" && parsed[key].trim()) {
                      found = parsed[key];
                      break;
                    }
                  }
                  if (found) {
                    botReplyText += found;
                  } else {
                    botReplyText += JSON.stringify(parsed);
                  }
                }
              } else {
                botReplyText += String(parsed);
              }
            } catch (_) {
              // Non-JSON chunk, treat as raw text
              botReplyText += (trimmedLine.startsWith("data:") ? contentToParse : trimmedLine) + "\n";
            }

            // Update state dynamically to enable live typing updates
            currentThreadsWithBot = currentThreadsWithBot.map((t) => {
              if (t.id === currentThreadId) {
                return {
                  ...t,
                  messages: t.messages.map((m) => {
                    if (m.id === botMessageId) {
                      return { ...m, content: botReplyText.trim() };
                    }
                    return m;
                  })
                };
              }
              return t;
            });
            setThreads(currentThreadsWithBot);
          }
        }

        // Parse remaining buffer
        if (buffer) {
          const trimmedLine = buffer.trim();
          if (trimmedLine) {
            let contentToParse = trimmedLine;
            if (contentToParse.startsWith("data:")) {
              contentToParse = contentToParse.slice(5).trim();
            }

            try {
              const parsed = JSON.parse(contentToParse);
              if (typeof parsed === "object" && parsed !== null) {
                const chunk = parsed.chunk || parsed.text || parsed.output || parsed.response || parsed.message || parsed.content || parsed.reply || "";
                if (chunk) {
                  botReplyText += chunk;
                } else {
                  let found = "";
                  for (const key of Object.keys(parsed)) {
                    if (typeof parsed[key] === "string" && parsed[key].trim()) {
                      found = parsed[key];
                      break;
                    }
                  }
                  botReplyText += found || JSON.stringify(parsed);
                }
              } else {
                botReplyText += String(parsed);
              }
            } catch (_) {
              botReplyText += trimmedLine.startsWith("data:") ? contentToParse : trimmedLine;
            }
          }
        }

        if (!botReplyText.trim()) {
          botReplyText = "Response stream completed without text content.";
        }

        // Final save to storage
        let finalThreadObj: Thread;
        const finalThreads = currentThreadsWithBot.map((t) => {
          if (t.id === currentThreadId) {
            finalThreadObj = {
              ...t,
              messages: t.messages.map((m) => {
                if (m.id === botMessageId) {
                  return { ...m, content: botReplyText.trim() };
                }
                return m;
              })
            };
            return finalThreadObj;
          }
          return t;
        });
        updateThreads(finalThreads, finalThreadObj!);
      } else {
        // Fallback for standard JSON responses
        const rawData = await response.json();
        botReplyText = parseResponse(rawData);

        let finalThreadObj: Thread;
        const finalThreads = currentThreadsWithBot.map((t) => {
          if (t.id === currentThreadId) {
            finalThreadObj = {
              ...t,
              messages: t.messages.map((m) => {
                if (m.id === botMessageId) {
                  return { ...m, content: botReplyText };
                }
                return m;
              })
            };
            return finalThreadObj;
          }
          return t;
        });
        updateThreads(finalThreads, finalThreadObj!);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Failed to connect to the n8n webhook.**\n\nError detail: \`${err.message || "Unknown Connection Failure"}\`\n\nPlease check your n8n server settings and verify your Webhook URL inside the **Settings** menu.`,
        timestamp: "Just now"
      };

      let finalThreadObj: Thread;
      const finalThreads = updatedThreadList.map((t) => {
        if (t.id === currentThreadId) {
          finalThreadObj = {
            ...t,
            messages: [...t.messages, errorMessage]
          };
          return finalThreadObj;
        }
        return t;
      });
      updateThreads(finalThreads, finalThreadObj!);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard Enter handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Trigger from standard card select
  const handleSelectAction = (action: QuickAction) => {
    setInput(action.prompt);
    textRef.current?.focus();
  };

  // Handle Drag & Drop file attachment
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      attachFileObjects(files);
    }
  };

  const attachFileObjects = (files: FileList) => {
    const newAttachments = Array.from(files).map((f) => {
      const sizeKB = Math.round(f.size / 1024);
      const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)}MB` : `${sizeKB}KB`;
      return { name: f.name, size: sizeText };
    });
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
  };

  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      attachFileObjects(e.target.files);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Mock microphone toggler
  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setInput("Listening for speech input...");
      setTimeout(() => {
        setInput("How to configure n8n chat agents?");
        setIsRecording(false);
      }, 2500);
    }
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="bg-background text-on-background min-h-screen flex font-sans overflow-hidden w-full relative"
    >
      {/* File dragging cover overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary z-50 backdrop-blur-sm pointer-events-none flex items-center justify-center">
          <div className="bg-surface-container-highest border border-outline-variant p-8 rounded-2xl text-center flex flex-col items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Paperclip className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Drop your file here
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Add file attachments to your Deep Sea AI session
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
      />

      {/* Responsive Sidebar Backing */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300"
        />
      )}

      {/* Left Navigation Sidebar */}
      <div
        className={`fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={handleSelectThread}
          onNewChat={handleNewChat}
          onOpenSettings={handleOpenSettings}
          onOpenHelp={handleOpenHelp}
          currentView={currentView}
          user={user}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Top Header */}
        <Header
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          user={user}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* View Routing */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {/* Cosmic Ambient Background Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary filter blur-[120px] rounded-full transition-transform duration-1000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#0b2413] filter blur-[100px] rounded-full transition-transform duration-1000"></div>
          </div>

          <div className="relative flex-1 flex flex-col z-10 w-full overflow-hidden h-full">
            {currentView === "settings" && (
              <div className="flex-1 overflow-y-auto">
                <SettingsView
                  onSave={handleSaveSettings}
                  initialModel={activeModel}
                  initialSystemPrompt={systemPrompt}
                  user={user}
                />
              </div>
            )}
            {currentView === "help" && (
              <div className="flex-1 overflow-y-auto">
                <HelpView />
              </div>
            )}

            {currentView === "chat" && (
              <div className="flex-1 flex flex-col relative overflow-hidden h-full">
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto"
                >
                  {!activeThreadId || !activeThread || activeThread.messages.length === 0 ? (
                    /* Welcome Landing state */
                    <div className="min-h-full flex items-center justify-center py-4 px-3 md:px-8">
                      <WelcomeScreen
                        onSelectAction={handleSelectAction}
                        user={user}
                        onOpenAuth={() => setIsAuthModalOpen(true)}
                      />
                    </div>
                  ) : (
                    /* Active message logs */
                    <div className="px-3 md:px-8 py-4 space-y-4 max-w-3xl mx-auto w-full select-text pb-36">
                      {activeThread.messages.map((message, index) => {
                        const isMsgStreaming = isLoading && 
                          message.role === "assistant" && 
                          index === activeThread.messages.length - 1;

                        return (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isStreaming={isMsgStreaming}
                            onRegenerate={
                              message.role === "assistant" && !message.content.startsWith("⚠️")
                                ? () => handleSendMessage(activeThread.messages[activeThread.messages.length - 2]?.content)
                                : undefined
                            }
                          />
                        );
                      })}

                      {/* Simulated typing loading indicators - only show if the bot message is completely empty or not created yet */}
                      {isLoading && (!activeThread.messages[activeThread.messages.length - 1] || !activeThread.messages[activeThread.messages.length - 1].content) && (
                        <div className="flex gap-3 w-full animate-pulse select-none">
                          <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                          </div>
                          <div className="bg-surface-container text-on-surface px-4 py-2.5 rounded-xl rounded-tl-none border border-outline-variant text-xs font-mono flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-300"></span>
                            <span className="text-on-surface-variant font-sans text-xs ml-1">
                              Computing parameters...
                            </span>
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} className="h-4" />
                    </div>
                  )}
                </div>

                {/* Sticky Bottom Input Bar (Chat view only) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#090e0a] via-[#090e0a]/95 to-transparent pt-6 pb-4 px-3 md:px-8 pointer-events-none z-20">
                  <div className="max-w-2xl mx-auto relative group pointer-events-auto">
                    {/* Atmospheric Input Background Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-2xl blur opacity-35 group-focus-within:opacity-75 transition duration-1000"></div>

                    {/* Input Container */}
                    <div className="relative flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl p-1.5 shadow-2xl focus-within:border-primary/80 transition-all">
                      
                      {/* Attached files chips list inside input bar */}
                      {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-1 px-2 pb-1.5 pt-1 border-b border-outline-variant/40 mb-1">
                          {attachedFiles.map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 px-2 py-0.5 bg-surface-container-high/60 border border-outline-variant/50 rounded-lg text-[11px] font-mono text-on-surface-variant hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                            >
                              <Paperclip className="w-3 h-3 text-primary" />
                              <span className="truncate max-w-[100px]">{file.name}</span>
                              <span className="text-[9px] text-on-surface-variant/40">
                                {file.size}
                              </span>
                              <button
                                onClick={() => handleRemoveAttachment(i)}
                                className="text-on-surface-variant/50 hover:text-red-400 p-0.5 rounded-full transition-colors cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Main input body */}
                      <div className="flex items-center">
                        <button
                          onClick={handleFileAttachClick}
                          className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high cursor-pointer flex items-center justify-center flex-shrink-0"
                          title="Attach files (Drag & drop supported)"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        <textarea
                          ref={textRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          rows={1}
                          className="flex-1 bg-transparent border-none focus:outline-none text-on-surface placeholder-on-surface-variant/55 text-xs py-1.5 px-2 resize-none max-h-32 focus:ring-0"
                          placeholder={
                            attachedFiles.length > 0
                              ? "Describe the attached files..."
                              : (!activeThreadId || !activeThread || activeThread.messages.length === 0)
                              ? "Ask anything..."
                              : "Ask follow-up or type a new prompt..."
                          }
                        />

                        <div className="flex items-center gap-1 pr-0.5 flex-shrink-0">
                          <button
                            onClick={handleMicToggle}
                            className={`p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center ${
                              isRecording
                                ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                            }`}
                            title="Voice dictation"
                          >
                            {isRecording ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim() && attachedFiles.length === 0}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              input.trim() || attachedFiles.length > 0
                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:opacity-95 active:scale-95 cursor-pointer"
                                : "bg-surface-container text-on-surface-variant/40 border border-outline-variant/30 cursor-not-allowed"
                            }`}
                            title="Send message"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Small visual metadata tags */}
                    <div className="flex justify-center mt-2.5 gap-4 opacity-60 select-none">
                      <span className="text-[11px] font-mono text-on-surface-variant/70 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        {activeModel === "v4.0-pro-engine" ? "GPT-4o Deep Thinking" : "Active Model"}
                      </span>
                      <span className="text-[11px] font-mono text-on-surface-variant/70 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        AI may hallucinate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Supabase Auth Modal Overlay */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(loggedInUser) => setUser(loggedInUser)}
        />
      )}
    </div>
  );
}
