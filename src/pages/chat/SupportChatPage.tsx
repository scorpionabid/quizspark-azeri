import { useAuth } from "@/contexts/AuthContext";
import { useSupportMessages, useSendMessage, useMarkAsRead } from "@/hooks/useChat";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { Loader2, MessageSquare, ShieldCheck, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function SupportChatPage() {
    const { user, profile } = useAuth();
    const { messages, isLoading, supportAdminId } = useSupportMessages();
    const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();
    const { mutate: markAsRead } = useMarkAsRead();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Mark admin messages as read when viewed
    useEffect(() => {
        if (user && messages && messages.length > 0) {
            const hasUnread = messages.some(m => m.receiver_id === user.id && !m.is_read);
            if (hasUnread) {
                const adminId = messages.find(m => m.receiver_id === user.id && !m.is_read)?.sender_id || supportAdminId;
                if (adminId) {
                    markAsRead(adminId);
                }
            }
        }
    }, [user, messages, supportAdminId, markAsRead]);

    const handleSend = async (content: string) => {
        await sendMessage({ content });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl h-[calc(100vh-120px)] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Admin Dəstək</h1>
                            {user?.email && (
                                <Badge variant="secondary" className="text-[11px] font-normal gap-1 hidden sm:inline-flex">
                                    <Mail className="h-3 w-3 opacity-70" />
                                    {user.email}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Suallarınızı birbaşa adminə ünvanlayın</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-success/10 text-success text-[10px] px-3 py-1 rounded-full border border-success/20 font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3" />
                    Təhlükəsiz Yazışma
                </div>
            </motion.div>

            <div className="flex-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden shadow-xl flex flex-col mb-4">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 scroll-smooth"
                >
                    {messages && messages.length > 0 ? (
                        messages.map((m) => (
                            <ChatBubble
                                key={m.id}
                                content={m.content}
                                isOwn={m.sender_id === user?.id}
                                timestamp={m.created_at}
                                isRead={m.is_read}
                            />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-muted/30 flex items-center justify-center">
                                <MessageSquare className="h-8 w-8 text-muted-foreground opacity-30" />
                            </div>
                            <div className="max-w-xs space-y-2">
                                <p className="font-bold text-foreground">Söhbətə başlayın</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Hər hansı bir probleminiz və ya sualınız var? Bizə yazın, qısa müddətdə cavablandıracağıq.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <ChatInput onSend={handleSend} isSending={isSending} />
            </div>
        </div>
    );
}
