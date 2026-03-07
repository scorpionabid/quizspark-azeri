import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Conversation } from "@/hooks/useChat";

interface ConversationListProps {
    conversations: Conversation[];
    selectedUserId?: string;
    onSelect: (userId: string) => void;
}

export function ConversationList({ conversations, selectedUserId, onSelect }: ConversationListProps) {
    return (
        <div className="flex flex-col h-full divide-y divide-border/50 overflow-y-auto">
            {conversations.length > 0 ? (
                conversations.map((conv) => (
                    <div
                        key={conv.user_id}
                        onClick={() => onSelect(conv.user_id)}
                        className={cn(
                            "p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-muted/50",
                            selectedUserId === conv.user_id && "bg-primary/5 border-l-4 border-primary"
                        )}
                    >
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={conv.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary uppercase">
                                {conv.full_name?.slice(0, 2) || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className={cn(
                                    "font-semibold truncate",
                                    conv.unread_count > 0 ? "text-foreground" : "text-foreground/80"
                                )}>
                                    {conv.full_name || "Adsız İstifadəçi"}
                                </h3>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: az })}
                                </span>
                            </div>
                            <p className={cn(
                                "text-sm truncate",
                                conv.unread_count > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                            )}>
                                {conv.last_message}
                            </p>
                        </div>

                        {conv.unread_count > 0 && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-[10px] text-primary-foreground font-bold">
                                    {conv.unread_count}
                                </span>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    <p>Heç bir aktiv söhbət yoxdur.</p>
                </div>
            )}
        </div>
    );
}
