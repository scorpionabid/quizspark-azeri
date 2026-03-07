/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    last_message: string;
    last_message_at: string;
    unread_count: number;
}

export function useSupportMessages(otherUserId?: string) {
    const { user, role } = useAuth();
    const queryClient = useQueryClient();

    const isAdmin = role === 'admin';
    const ADMIN_ID = "f95994c2-97e1-4cf1-94a5-3487b3baf1d5";

    const targetUserId = isAdmin ? otherUserId : ADMIN_ID;

    const queryKey = useMemo(() => ['support-messages', user?.id, targetUserId], [user?.id, targetUserId]);

    const { data: messages, isLoading } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!user || !targetUserId) return [];

            const { data, error } = await (supabase
                .from('support_messages' as any)
                .select('*') as any)
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return (data as unknown) as Message[];
        },
        enabled: !!user && !!targetUserId
    });

    // Realtime subscription
    useEffect(() => {
        if (!user || !targetUserId) return;

        const channel = supabase
            .channel(`support_messages:${user.id}:${targetUserId}`)
            .on(
                'postgres_changes' as any,
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'support_messages',
                    filter: `receiver_id=eq.${user.id}`
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    if (newMessage.sender_id === targetUserId) {
                        queryClient.setQueryData(queryKey, (old: Message[] | undefined) => {
                            return old ? [...old, newMessage] : [newMessage];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, targetUserId, queryClient, queryKey]);

    return { messages, isLoading };
}

export function useSendMessage() {
    const { user, role } = useAuth();
    const queryClient = useQueryClient();
    const ADMIN_ID = "f95994c2-97e1-4cf1-94a5-3487b3baf1d5";

    return useMutation({
        mutationFn: async ({ content, receiverId }: { content: string; receiverId?: string }) => {
            if (!user) throw new Error("Not authenticated");

            const targetId = role === 'admin' ? receiverId : ADMIN_ID;
            if (!targetId) throw new Error("Receiver not specified");

            const { data, error } = await (supabase
                .from('support_messages' as any)
                .insert({
                    sender_id: user.id,
                    receiver_id: targetId,
                    content
                }) as any)
                .select()
                .single();

            if (error) throw error;
            return (data as unknown) as Message;
        },
        onSuccess: (newMessage) => {
            queryClient.setQueryData(
                ['support-messages', user?.id, (newMessage as Message).receiver_id],
                (old: Message[] | undefined) => (old ? [...old, newMessage] : [newMessage])
            );
        },
        onError: (error: Error) => {
            toast.error("Mesaj göndərilə bilmədi: " + error.message);
        }
    });
}

export function useConversations() {
    const { user, role } = useAuth();

    return useQuery({
        queryKey: ['admin-conversations'],
        queryFn: async () => {
            if (role !== 'admin') return [];

            const { data, error } = await (supabase.rpc as any)('get_admin_conversations');

            if (error) {
                // FALLBACK: If RPC doesn't exist, we'll try a simpler approach
                const { data: messages, error: msgError } = await (supabase
                    .from('support_messages' as any)
                    .select('*, profiles!support_messages_sender_id_fkey(full_name, avatar_url)') as any)
                    .order('created_at', { ascending: false });

                if (msgError) throw msgError;

                const convMap = new Map<string, Conversation>();
                (messages as any[]).forEach((m: any) => {
                    const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;
                    if (!convMap.has(otherId)) {
                        convMap.set(otherId, {
                            user_id: otherId,
                            full_name: m.profiles?.full_name || "Naməlum",
                            avatar_url: m.profiles?.avatar_url,
                            last_message: m.content,
                            last_message_at: m.created_at,
                            unread_count: m.receiver_id === user?.id && !m.is_read ? 1 : 0
                        });
                    } else if (m.receiver_id === user?.id && !m.is_read) {
                        const existing = convMap.get(otherId)!;
                        existing.unread_count++;
                    }
                });
                return Array.from(convMap.values());
            }
            return data as Conversation[];
        },
        enabled: role === 'admin'
    });
}
