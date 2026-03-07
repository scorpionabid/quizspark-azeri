-- Create support_messages table
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
    ON public.support_messages
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id OR 
        has_role(auth.uid(), 'admin'::app_role)
    );

-- 2. Authenticated users can send messages
CREATE POLICY "Users can send messages"
    ON public.support_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

-- 3. Users can mark messages as read
CREATE POLICY "Users can update their own messages"
    ON public.support_messages
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id OR has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (auth.uid() = receiver_id OR has_role(auth.uid(), 'admin'::app_role));

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;

-- Add notification trigger for new support messages
CREATE OR REPLACE FUNCTION public.handle_new_support_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, description, type, link)
    VALUES (
        NEW.receiver_id,
        'Yeni mesaj',
        'Sizə yeni dəstək mesajı gəldi.',
        'info',
        CASE 
            WHEN has_role(NEW.receiver_id, 'admin'::app_role) THEN '/admin/chat'
            ELSE '/support'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_support_message_created
    AFTER INSERT ON public.support_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_support_message();
