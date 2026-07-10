import React from "react";
import { HelpCircle, Code, ShieldCheck, CheckCircle, Network } from "lucide-react";

export default function HelpView() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 select-none">
      {/* Header Info - Highly Compact */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/25">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-headline font-bold text-on-surface leading-tight">
            Help & Documentation
          </h2>
          <p className="text-[11px] text-on-surface-variant/80">
            Understanding n8n Chat Webhooks, security routing, and integration payloads.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connection Architecture - Compact Card */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
            <Network className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider font-mono">
              Secure Webhook Architecture
            </span>
          </div>

          <p className="text-xs text-on-surface-variant/90 leading-relaxed">
            To prevent CORS blocks inside the browser frame and protect system credentials, all messages are routed through our server proxy at <code className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant/50 text-primary font-mono text-[10px]">/api/chat</code>.
          </p>

          <div className="p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Client Request (React SPA)
            </div>
            <p className="text-[11px] text-on-surface-variant/70 leading-relaxed pl-3.5">
              Sends local text payload to local server proxy <code className="text-primary font-mono font-medium">/api/chat</code>.
            </p>
            <div className="h-3 border-l border-dashed border-outline-variant/40 ml-2.5"></div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14]"></span>
              Server Proxy (Express Backend)
            </div>
            <p className="text-[11px] text-on-surface-variant/70 leading-relaxed pl-3.5">
              Structures payload, strips browser IDs, and forwards requests to the n8n webhook endpoint safely.
            </p>
            <div className="h-3 border-l border-dashed border-outline-variant/40 ml-2.5"></div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              n8n Chat Trigger Workflow
            </div>
            <p className="text-[11px] text-on-surface-variant/70 leading-relaxed pl-3.5">
              Processes the text through agent workflows and returns the formatted response.
            </p>
          </div>
        </div>

        {/* Payload Structure - Compact Card */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider font-mono">
              n8n Payload Standard
            </span>
          </div>

          <p className="text-xs text-on-surface-variant/90 leading-relaxed">
            The proxy translates standard queries into the format expected by n8n&apos;s official <strong>Chat Trigger</strong> node:
          </p>

          <pre className="p-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg font-mono text-[10px] text-primary overflow-x-auto leading-relaxed shadow-inner">
{`{
  "action": "sendMessage",
  "chatInput": "Your chat question text here",
  "sessionId": "local-session-uuid"
}`}
          </pre>

          <p className="text-[10px] text-on-surface-variant/60 leading-relaxed">
            By mapping both <code className="text-primary font-semibold font-mono">chatInput</code> and session variables, we guarantee continuous state tracking across message threads.
          </p>
        </div>

        {/* Quick Tips - Compact Card */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-outline-variant/40 pb-2 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider font-mono">
              Operational Checklist
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-on-surface-variant/80">
              <strong>Check Webhook Endpoint:</strong> Ensure you configure the active production or dev webhook URL of your n8n workflow under the Settings panel.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-on-surface-variant/80">
              <strong>Keep workflow active:</strong> In n8n, verify the workflow is toggled to &quot;Active&quot; if utilizing the production endpoint path.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-on-surface-variant/80">
              <strong>Markdown Output:</strong> To obtain gorgeous code blocks, instruct your workflow system prompt to output responses in standard Markdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
