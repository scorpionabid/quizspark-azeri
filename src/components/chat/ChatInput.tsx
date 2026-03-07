import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
    onSend: (content: string) => Promise<void>;
    isSending: boolean;
}

export function ChatInput({ onSend, isSending }: ChatInputProps) {
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = async () => {
        if (!content.trim() || isSending) return;

        await onSend(content.trim());
        setContent("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
            <div className="flex gap-2 items-end max-w-4xl mx-auto">
                <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Mesajınızı yazın..."
                    className="min-h-[44px] max-h-32 resize-none py-3 rounded-2xl bg-muted/30 focus-visible:ring-primary/20 transition-all border-none shadow-inner"
                    rows={1}
                />
                <Button
                    onClick={handleSend}
                    disabled={!content.trim() || isSending}
                    className="h-[44px] w-[44px] rounded-full p-0 flex-shrink-0 shadow-lg transition-transform active:scale-95"
                >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
                </Button>
            </div>
        </div>
    );
}
