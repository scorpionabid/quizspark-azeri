import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

/** Minimal markdown renderer for AI responses (no external deps). */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading h3
    if (/^###\s/.test(line)) {
      nodes.push(<h3 key={i} className="mt-3 mb-1 text-sm font-bold">{line.replace(/^###\s/, "")}</h3>);
      i++;
      continue;
    }
    // Heading h2
    if (/^##\s/.test(line)) {
      nodes.push(<h3 key={i} className="mt-3 mb-1 text-sm font-bold">{line.replace(/^##\s/, "")}</h3>);
      i++;
      continue;
    }
    // Heading h1
    if (/^#\s/.test(line)) {
      nodes.push(<h3 key={i} className="mt-2 mb-1 text-sm font-bold">{line.replace(/^#\s/, "")}</h3>);
      i++;
      continue;
    }
    // Unordered list
    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-1 space-y-0.5 pl-3 list-disc">
          {items.map((item, j) => (
            <li key={j} className="text-sm">{applyInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }
    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-1 space-y-0.5 pl-3 list-decimal">
          {items.map((item, j) => (
            <li key={j} className="text-sm">{applyInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }
    // Empty line
    if (line.trim() === "") {
      nodes.push(<br key={i} />);
      i++;
      continue;
    }
    // Regular paragraph
    nodes.push(<p key={i} className="text-sm">{applyInline(line)}</p>);
    i++;
  }

  return nodes;
}

/** Apply bold/code/italic inline formatting. */
function applyInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Pattern: **bold**, `code`, *italic*
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("**")) {
      parts.push(<strong key={key++}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("`")) {
      parts.push(<code key={key++} className="rounded bg-black/10 dark:bg-white/10 px-1 font-mono text-xs">{m.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={key++}>{m.slice(1, -1)}</em>);
    }
    last = match.index + m.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent/20 text-accent"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="space-y-0.5">{renderMarkdown(message.content)}</div>
        )}
        <span className="mt-1 block text-[10px] opacity-60">
          {message.timestamp instanceof Date
            ? message.timestamp.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })
            : new Date(message.timestamp).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
