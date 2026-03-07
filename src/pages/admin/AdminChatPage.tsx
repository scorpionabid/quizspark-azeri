import { useAuth } from "@/contexts/AuthContext";
import { useSupportMessages, useSendMessage, useConversations } from "@/hooks/useChat";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { ConversationList } from "@/components/chat/ConversationList";
import { Loader2, MessageSquare, User, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminChatPage() {
    const { user } = useAuth();
    const { data: conversations, isLoading: convsLoading } = useConversations();
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

    const { messages, isLoading: messagesLoading } = useSupportMessages(selectedUserId);
    const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Set first conversation as selected if none selected
    useEffect(() => {
        if (conversations && conversations.length > 0 && !selectedUserId) {
            setSelectedUserId(conversations[0].user_id);
        }
    }, [conversations, selectedUserId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (content: string) => {
        if (!selectedUserId) return;
        await sendMessage({ content, receiverId: selectedUserId });
    };

    const selectedConv = conversations?.find(c => c.user_id === selectedUserId);

    if (convsLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl h-[calc(100vh-120px)] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3"
            >
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                    <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mesajlar Paneli</h1>
                    <p className="text-sm text-muted-foreground font-medium">İstifadəçilərin suallarını cavablandırın</p>
                </div>
            </motion.div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Conversations Sidebar */}
                <Card className="w-80 flex flex-col bg-card/50 backdrop-blur-sm border-border/50 rounded-3xl overflow-hidden shadow-xl min-h-0">
                    <div className="p-4 border-b border-border/50 bg-muted/30">
                        <h2 className="font-bold text-sm uppercase tracking-wider opacity-60">Söhbətlər</h2>
                    </div>
                    <ConversationList
                        conversations={conversations || []}
                        selectedUserId={selectedUserId}
                        onSelect={setSelectedUserId}
                    />
                </Card>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden shadow-xl min-h-0">
                    {selectedUserId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold">{selectedConv?.full_name || "Yüklənir..."}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-[9px] px-2 py-0.5 rounded-full border border-destructive/20 font-bold uppercase">
                                    <ShieldCheck className="h-2 w-2" />
                                    Admin Görünüşü
                                </div>
                            </div>

                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 scroll-smooth min-h-0"
                            >
                                {messagesLoading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground opacity-30" />
                                    </div>
                                ) : (
                                    messages?.map((m) => (
                                        <ChatBubble
                                            key={m.id}
                                            content={m.content}
                                            isOwn={m.sender_id === user?.id}
                                            timestamp={m.created_at}
                                        />
                                    ))
                                )}
                            </div>

                            <ChatInput onSend={handleSend} isSending={isSending} />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-muted/30 flex items-center justify-center">
                                <MessageSquare className="h-8 w-8 text-muted-foreground opacity-30" />
                            </div>
                            <div className="max-w-xs space-y-2">
                                <p className="font-bold text-foreground">Söhbət seçilməyib</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Mesajlara baxmaq və cavablandırmaq üçün soldakı siyahıdan bir istifadəçi seçin.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
