-- Add foreign keys to profiles for better join support in PostgREST
ALTER TABLE public.support_messages
DROP CONSTRAINT IF EXISTS support_messages_sender_id_profiles_fkey,
ADD CONSTRAINT support_messages_sender_id_profiles_fkey 
    FOREIGN KEY (sender_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.support_messages
DROP CONSTRAINT IF EXISTS support_messages_receiver_id_profiles_fkey,
ADD CONSTRAINT support_messages_receiver_id_profiles_fkey 
    FOREIGN KEY (receiver_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Create get_admin_conversations RPC function
CREATE OR REPLACE FUNCTION public.get_admin_conversations()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH last_messages AS (
        SELECT DISTINCT ON (
            CASE 
                WHEN sender_id = auth.uid() THEN receiver_id 
                ELSE sender_id 
            END
        )
            CASE 
                WHEN sender_id = auth.uid() THEN receiver_id 
                ELSE sender_id 
            END as other_user_id,
            content,
            created_at
        FROM public.support_messages
        WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
        ORDER BY 
            CASE 
                WHEN sender_id = auth.uid() THEN receiver_id 
                ELSE sender_id 
            END,
            created_at DESC
    ),
    unread_counts AS (
        SELECT 
            sender_id as other_user_id,
            COUNT(*) as count
        FROM public.support_messages
        WHERE receiver_id = auth.uid() AND is_read = false
        GROUP BY sender_id
    )
    SELECT 
        p.user_id,
        p.full_name,
        p.avatar_url,
        lm.content as last_message,
        lm.created_at as last_message_at,
        COALESCE(uc.count, 0) as unread_count
    FROM public.profiles p
    JOIN last_messages lm ON p.user_id = lm.other_user_id
    LEFT JOIN unread_counts uc ON p.user_id = uc.other_user_id
    ORDER BY lm.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
