import React, { useState } from "react";
import { Sparkles, ThumbsUp, ThumbsDown, RotateCcw, Copy, Check } from "lucide-react";
import { Message } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
  key?: any;
  message: Message;
  onRegenerate?: () => void;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, onRegenerate, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [liked, setLiked] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  if (isUser) {
    return (
      <div className="flex flex-col items-end animate-fade-in select-text">
        <div className="max-w-[90%] md:max-w-[75%] bg-secondary-container/70 text-on-surface px-3.5 py-2.5 rounded-xl rounded-tr-none border border-outline-variant/60 shadow-sm transition-all duration-200 hover:border-outline/40">
          <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>
        </div>
        <span className="text-[10px] font-mono text-on-surface-variant/50 mt-1 px-1 select-none">
          {message.timestamp}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 w-full animate-fade-in select-text">
      {/* Bot Avatar - Compact Rounded */}
      <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 mt-0.5 border border-outline-variant/50 shadow-sm select-none">
        <Sparkles className="w-3.5 h-3.5 text-primary fill-current animate-pulse" />
      </div>

      {/* Bot Message Card - Compact padding & text */}
      <div className="flex-1 max-w-[95%] md:max-w-[85%] bg-surface-container/70 text-on-surface px-3.5 py-2.5 rounded-xl rounded-tl-none border border-outline-variant/60 shadow-sm transition-all duration-200">
        <div className="text-xs leading-relaxed prose-sm">
          <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
        </div>

        {!isStreaming && (
          <>
            {/* Timestamp */}
            <div className="mt-2 text-[10px] font-mono text-on-surface-variant/50 select-none">
              {message.timestamp}
            </div>

            {/* Action Row - Highly Compact */}
            <div className="flex gap-1.5 mt-3 select-none">
              <button
                onClick={() => setLiked(liked === true ? null : true)}
                className={`p-1.5 rounded-lg text-xs transition-all duration-200 border cursor-pointer active:scale-95 ${
                  liked === true
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant/80 border-outline-variant/40"
                }`}
                title="Like output"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>

              <button
                onClick={() => setLiked(liked === false ? null : false)}
                className={`p-1.5 rounded-lg text-xs transition-all duration-200 border cursor-pointer active:scale-95 ${
                  liked === false
                    ? "bg-red-500/10 text-red-400 border-red-500/40"
                    : "bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant/80 border-outline-variant/40"
                }`}
                title="Dislike output"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>

              <button
                onClick={handleCopy}
                className="bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant/80 px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors border border-outline-variant/40 flex items-center gap-1 cursor-pointer active:scale-95"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-primary animate-pulse" />
                    <span className="text-primary text-[10px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant/80 px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors border border-outline-variant/40 flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Regenerate output"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="text-[10px]">Retry</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
