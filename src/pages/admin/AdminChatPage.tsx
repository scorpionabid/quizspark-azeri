import { useSupportMessages, useSendMessage, useConversations, useMarkAsRead } from "@/hooks/useChat";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { ConversationList } from "@/components/chat/ConversationList";
import { Loader2, MessageSquare, User, ShieldCheck, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminChatPage() {
    const { user } = useAuth();
    const { data: conversations, isLoading: convsLoading } = useConversations();
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
    const [searchQuery, setSearchQuery] = useState("");

    const { messages, isLoading: messagesLoading } = useSupportMessages(selectedUserId);
    const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();
    const { mutate: markAsRead } = useMarkAsRead();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Set first conversation as selected if none selected
    useEffect(() => {
        if (conversations && conversations.length > 0 && !selectedUserId) {
            setSelectedUserId(conversations[0].user_id);
        }
    }, [conversations, selectedUserId]);

    // Mark as read when messages load or selected user changes
    useEffect(() => {
        if (selectedUserId && messages && messages.length > 0) {
            const hasUnread = messages.some(m => m.receiver_id === user?.id && !m.is_read);
            if (hasUnread) {
                markAsRead(selectedUserId);
            }
        }
    }, [selectedUserId, messages, user?.id, markAsRead]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const filteredConversations = conversations?.filter(c =>
        c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <div className="p-4 border-b border-border/50 bg-muted/30 space-y-3">
                        <h2 className="font-bold text-sm uppercase tracking-wider opacity-60 px-1">Söhbətlər</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Axtar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <ConversationList
                        conversations={filteredConversations || []}
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

                {/* User Info Sidebar - New */}
                {selectedConv && (
                    <Card className="w-64 flex flex-col bg-card/50 backdrop-blur-sm border-border/50 rounded-3xl overflow-hidden shadow-xl p-6 space-y-6">
                        <div className="text-center space-y-3">
                            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-lg">
                                <User className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{selectedConv.full_name || "Naməlum"}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">İstifadəçi</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">ID</p>
                                <p className="text-xs font-mono break-all bg-muted/30 p-2 rounded-lg">{selectedConv.user_id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Son Mesaj</p>
                                <p className="text-xs">{new Date(selectedConv.last_message_at).toLocaleString('az')}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 italic text-[10px] text-muted-foreground text-center">
                            Dəstək çat sistemi vasitəsilə admin cavabı.
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
