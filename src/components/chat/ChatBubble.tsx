import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
    content: string;
    isOwn: boolean;
    timestamp: string;
    isRead?: boolean;
}

export function ChatBubble({ content, isOwn, timestamp, isRead }: ChatBubbleProps) {
    return (
        <div className={cn(
            "flex w-full mb-4",
            isOwn ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm transition-all",
                isOwn
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none border border-border/50"
            )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                <div className={cn(
                    "text-[10px] mt-1 opacity-70 flex items-center gap-1",
                    isOwn ? "justify-end" : "justify-start"
                )}>
                    <span>{format(new Date(timestamp), "HH:mm", { locale: az })}</span>
                    {isOwn && (
                        <span>
                            {isRead ? (
                                <CheckCheck className="h-3 w-3 text-primary-foreground" />
                            ) : (
                                <Check className="h-3 w-3 text-primary-foreground/60" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
