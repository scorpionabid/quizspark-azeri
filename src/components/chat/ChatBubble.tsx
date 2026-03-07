import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { az } from "date-fns/locale";

interface ChatBubbleProps {
    content: string;
    isOwn: boolean;
    timestamp: string;
}

export function ChatBubble({ content, isOwn, timestamp }: ChatBubbleProps) {
    return (
        <div className={cn(
            "flex w-full mb-4",
            isOwn ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                isOwn
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none border border-border/50"
            )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                <p className={cn(
                    "text-[10px] mt-1 opacity-70",
                    isOwn ? "text-right" : "text-left"
                )}>
                    {format(new Date(timestamp), "HH:mm", { locale: az })}
                </p>
            </div>
        </div>
    );
}
