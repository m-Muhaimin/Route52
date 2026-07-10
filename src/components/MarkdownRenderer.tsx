import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body select-text space-y-1 text-xs">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-sm font-bold font-headline mt-4 mb-2 text-on-surface">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold font-headline mt-3 mb-1.5 text-on-surface">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[11px] font-bold font-headline mt-2.5 mb-1 text-on-surface">
              {children}
            </h3>
          ),
          // Paragraph
          p: ({ children }) => (
            <p className="text-xs leading-relaxed text-on-surface-variant/90 mb-2 last:mb-0">
              {children}
            </p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2 space-y-1 text-xs">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 space-y-1 text-xs">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs text-on-surface-variant/90 leading-relaxed">
              {children}
            </li>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-3 italic my-2 text-on-surface-variant/80">
              {children}
            </blockquote>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2 font-medium"
            >
              {children}
            </a>
          ),
          // Bold & Emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-on-surface">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border border-outline-variant/60 rounded-lg">
              <table className="w-full border-collapse text-[11px] bg-surface-container-low/40">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-container-high/60 border-b border-outline-variant/60">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-outline-variant/40 p-2 text-left font-bold text-on-surface">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-outline-variant/40 p-2 text-on-surface-variant">
              {children}
            </td>
          ),
          // Code rendering (block vs inline)
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            
            // Check if it's block-level code or inline code
            const isBlock = match || String(children).includes("\n");

            if (isBlock) {
              const language = match ? match[1] : "code";
              const codeText = String(children).replace(/\n$/, "");
              return <CodeBlock language={language} code={codeText} />;
            } else {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-[#1b1b23] border border-outline-variant/80 font-mono text-[11px] text-[#c0c1ff]"
                  {...rest}
                >
                  {children}
                </code>
              );
            }
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  // Simple, elegant syntax highlighting for demonstration languages
  const highlightCode = (rawCode: string, lang: string) => {
    const l = lang.toLowerCase();
    if (l === "python" || l === "py") {
      return rawCode.split("\n").map((line, i) => {
        let formatted = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // Highlight comments
        if (formatted.includes("#")) {
          const parts = formatted.split("#");
          const codePart = parts[0];
          const commentPart = parts.slice(1).join("#");
          formatted = `${codePart}<span class="text-slate-500 font-normal">#${commentPart}</span>`;
        } else {
          // Highlight strings
          formatted = formatted.replace(
            /("[^"]*")/g,
            '<span class="text-[#5eead4]">$1</span>'
          );
          formatted = formatted.replace(
            /('[^']*')/g,
            '<span class="text-[#5eead4]">$1</span>'
          );

          // Highlight functions def name(...)
          formatted = formatted.replace(
            /\b(def|class)\s+(\w+)/g,
            '$1 <span class="text-[#fde047]">$2</span>'
          );

          // Highlight keywords
          const keywords = [
            "import",
            "from",
            "async",
            "def",
            "while",
            "True",
            "False",
            "return",
            "print",
            "await",
            "for",
            "in",
            "try",
            "except",
            "as",
            "if",
            "else",
            "elif"
          ];
          keywords.forEach((kw) => {
            const regex = new RegExp(`\\b${kw}\\b`, "g");
            formatted = formatted.replace(
              regex,
              `<span class="text-[#818cf8]">${kw}</span>`
            );
          });

          // Highlight numbers
          formatted = formatted.replace(
            /\b(\d+)\b/g,
            '<span class="text-[#f87171]">$1</span>'
          );
        }

        return (
          <div key={i} dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }} />
        );
      });
    }

    if (l === "javascript" || l === "js" || l === "typescript" || l === "ts" || l === "tsx") {
      return rawCode.split("\n").map((line, i) => {
        let formatted = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // Comments
        if (formatted.includes("//")) {
          const parts = formatted.split("//");
          formatted = `${parts[0]}<span class="text-slate-500 font-normal">//${parts.slice(1).join("//")}</span>`;
        } else {
          // Strings
          formatted = formatted.replace(
            /("[^"]*")/g,
            '<span class="text-[#5eead4]">$1</span>'
          );
          formatted = formatted.replace(
            /('[^']*')/g,
            '<span class="text-[#5eead4]">$1</span>'
          );
          formatted = formatted.replace(
            /(`[^`]*`)/g,
            '<span class="text-[#5eead4]">$1</span>'
          );

          // Keywords
          const keywords = [
            "const",
            "let",
            "var",
            "function",
            "async",
            "await",
            "return",
            "import",
            "export",
            "default",
            "from",
            "if",
            "else",
            "for",
            "while",
            "true",
            "false"
          ];
          keywords.forEach((kw) => {
            const regex = new RegExp(`\\b${kw}\\b`, "g");
            formatted = formatted.replace(
              regex,
              `<span class="text-[#818cf8]">${kw}</span>`
            );
          });

          // Numbers
          formatted = formatted.replace(
            /\b(\d+)\b/g,
            '<span class="text-[#f87171]">$1</span>'
          );
        }

        return (
          <div key={i} dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }} />
        );
      });
    }

    // Default formatting
    return rawCode.split("\n").map((line, i) => <div key={i}>{line || " "}</div>);
  };

  return (
    <div id="code-block" className="my-3 bg-[#0f172a] border border-outline-variant/60 rounded-lg overflow-hidden font-mono text-[11px]">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-1.5 border-b border-outline-variant/60 bg-[#13131b] select-none">
        <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-[10px] active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Area */}
      <pre className="p-3 overflow-x-auto leading-relaxed text-on-surface select-text bg-[#090e0a]/40">
        <code className="block whitespace-pre">
          {highlightCode(code, language)}
        </code>
      </pre>
    </div>
  );
}
