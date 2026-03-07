/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

const SUPPORT_ADMIN_ID = "d0000000-0000-0000-0000-000000000004"; // Talıbov Admin

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
    const targetUserId = isAdmin ? otherUserId : SUPPORT_ADMIN_ID;

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

    return useMutation({
        mutationFn: async ({ content, receiverId }: { content: string; receiverId?: string }) => {
            if (!user) throw new Error("Not authenticated");

            const targetId = role === 'admin' ? receiverId : SUPPORT_ADMIN_ID;
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

export function useMarkAsRead() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (senderId: string) => {
            if (!user) return;

            const { error } = await (supabase
                .from('support_messages' as any)
                .update({ is_read: true } as any)
                .eq('sender_id', senderId)
                .eq('receiver_id', user.id)
                .eq('is_read', false) as any);

            if (error) throw error;
        },
        onSuccess: (_, senderId) => {
            queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
            queryClient.invalidateQueries({ queryKey: ['support-messages', user?.id, senderId] });
        }
    });
}

export function useConversations() {
    const { user, role } = useAuth();

    const queryClient = useQueryClient();

    // Real-time subscription for conversations
    useEffect(() => {
        if (role !== 'admin' || !user) return;

        const channel = supabase
            .channel('admin_conversations_channel')
            .on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'support_messages'
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, role, queryClient]);

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
                    // In admin view, we want to group by the "other" user (not the admin)
                    const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;

                    // Skip if it's a message between admins (if applicable) or if otherId is the user themselves
                    if (otherId === user?.id) return;

                    if (!convMap.has(otherId)) {
                        convMap.set(otherId, {
                            user_id: otherId,
                            full_name: m.profiles?.full_name || "Naməlum",
                            avatar_url: m.profiles?.avatar_url,
                            last_message: m.content,
                            last_message_at: m.created_at,
                            unread_count: (m.receiver_id === user?.id && !m.is_read) ? 1 : 0
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
        enabled: role === 'admin' && !!user
    });
}
