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
    email?: string | null;
    role?: string | null;
    last_message: string;
    last_message_at: string;
    unread_count: number;
}

/**
 * Dynamically resolves the primary support admin's UUID
 */
export function useSupportAdminId() {
    return useQuery({
        queryKey: ['support-admin-id'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_support_admin_id');
            if (error || !data) {
                // Fallback to active admin ID if RPC fails
                return "81cebd9d-586b-4460-8615-6cb0ed9d1094";
            }
            return data as string;
        },
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetches messages for support chat:
 * - If admin: messages between admin and otherUserId
 * - If user: all messages in user's support thread (with any admin)
 */
export function useSupportMessages(otherUserId?: string) {
    const { user, role } = useAuth();
    const queryClient = useQueryClient();
    const isAdmin = role === 'admin';
    const { data: supportAdminId } = useSupportAdminId();

    const queryKey = useMemo(
        () => ['support-messages', user?.id, isAdmin ? otherUserId : 'user-thread'],
        [user?.id, isAdmin, otherUserId]
    );

    const { data: messages, isLoading } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!user) return [];

            let query = supabase.from('support_messages' as any).select('*') as any;

            if (isAdmin) {
                if (!otherUserId) return [];
                query = query
                    .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
                    .order('created_at', { ascending: true });
            } else {
                // Regular user: fetch all support conversations involving this user
                query = query
                    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                    .order('created_at', { ascending: true });
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data as unknown) as Message[];
        },
        enabled: !!user && (!isAdmin || !!otherUserId),
    });

    // Realtime subscription for incoming messages
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`support_messages_realtime_${user.id}_${otherUserId || 'general'}`)
            .on(
                'postgres_changes' as any,
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'support_messages',
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    const isRelevant = isAdmin
                        ? (newMessage.sender_id === otherUserId || newMessage.receiver_id === otherUserId)
                        : (newMessage.receiver_id === user.id || newMessage.sender_id === user.id);

                    if (isRelevant) {
                        queryClient.setQueryData(queryKey, (old: Message[] | undefined) => {
                            if (!old) return [newMessage];
                            if (old.some(m => m.id === newMessage.id)) return old;
                            return [...old, newMessage];
                        });
                        queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
                        queryClient.invalidateQueries({ queryKey: ['user-unread-support-count'] });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, isAdmin, otherUserId, queryClient, queryKey]);

    return { messages, isLoading, supportAdminId };
}

/**
 * Sends a message to the target admin or user
 */
export function useSendMessage() {
    const { user, role } = useAuth();
    const queryClient = useQueryClient();
    const { data: supportAdminId } = useSupportAdminId();

    return useMutation({
        mutationFn: async ({ content, receiverId }: { content: string; receiverId?: string }) => {
            if (!user) throw new Error("Giriş edilməyib");

            const trimmed = content.trim();
            if (!trimmed) throw new Error("Mesaj mətni boş ola bilməz");

            const targetId = role === 'admin' 
                ? receiverId 
                : (receiverId || supportAdminId || "81cebd9d-586b-4460-8615-6cb0ed9d1094");

            if (!targetId) throw new Error("Qəbul edən admin tapılmadı");

            const { data, error } = await (supabase
                .from('support_messages' as any)
                .insert({
                    sender_id: user.id,
                    receiver_id: targetId,
                    content: trimmed,
                }) as any)
                .select()
                .single();

            if (error) throw error;
            return (data as unknown) as Message;
        },
        onSuccess: (newMessage) => {
            const targetKey = role === 'admin' ? newMessage.receiver_id : 'user-thread';
            queryClient.setQueryData(
                ['support-messages', user?.id, targetKey],
                (old: Message[] | undefined) => {
                    if (!old) return [newMessage];
                    if (old.some(m => m.id === newMessage.id)) return old;
                    return [...old, newMessage];
                }
            );
            queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
        },
        onError: (error: Error) => {
            toast.error("Mesaj göndərilə bilmədi: " + error.message);
        }
    });
}

/**
 * Marks messages from sender as read
 */
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
            queryClient.invalidateQueries({ queryKey: ['user-unread-support-count'] });
            queryClient.invalidateQueries({ queryKey: ['support-messages', user?.id, senderId] });
        }
    });
}

/**
 * Hook for Admins to view all user conversations
 */
export function useConversations() {
    const { user, role } = useAuth();
    const queryClient = useQueryClient();

    // Real-time subscription for conversations list
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
            if (role !== 'admin' || !user) return [];

            const { data, error } = await (supabase.rpc as any)('get_admin_conversations');

            if (error) {
                console.warn("get_admin_conversations RPC failed, falling back to query:", error);

                const { data: messages, error: msgError } = await (supabase
                    .from('support_messages' as any)
                    .select('*, profiles:sender_id(full_name, avatar_url, email)') as any)
                    .order('created_at', { ascending: false });

                if (msgError) throw msgError;
                return processFallbackMessages(messages, user.id);
            }
            return data as Conversation[];
        },
        enabled: role === 'admin' && !!user
    });
}

function processFallbackMessages(messages: any[], currentUserId: string): Conversation[] {
    const convMap = new Map<string, Conversation>();
    messages.forEach((m: any) => {
        const otherId = m.sender_id === currentUserId ? m.receiver_id : m.sender_id;
        if (otherId === currentUserId) return;

        if (!convMap.has(otherId)) {
            convMap.set(otherId, {
                user_id: otherId,
                full_name: m.profiles?.full_name || "İstifadəçi",
                avatar_url: m.profiles?.avatar_url,
                email: m.profiles?.email,
                role: m.profiles?.role,
                last_message: m.content,
                last_message_at: m.created_at,
                unread_count: (m.receiver_id === currentUserId && !m.is_read) ? 1 : 0
            });
        } else if (m.receiver_id === currentUserId && !m.is_read) {
            const existing = convMap.get(otherId)!;
            existing.unread_count++;
        }
    });
    return Array.from(convMap.values());
}

/**
 * Hook for users to get unread support messages count
 */
export function useUserUnreadMessagesCount() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`user_unread_messages_${user.id}`)
            .on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'support_messages',
                    filter: `receiver_id=eq.${user.id}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['user-unread-support-count'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, queryClient]);

    return useQuery({
        queryKey: ['user-unread-support-count', user?.id],
        queryFn: async () => {
            if (!user) return 0;
            const { data, error } = await supabase.rpc('get_user_unread_support_count');
            if (error) {
                // Fallback query
                const { count } = await supabase
                    .from('support_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('receiver_id', user.id)
                    .eq('is_read', false);
                return count || 0;
            }
            return (data as number) || 0;
        },
        enabled: !!user,
        staleTime: 30 * 1000,
    });
}
