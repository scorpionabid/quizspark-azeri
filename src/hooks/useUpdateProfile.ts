import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useUpdateProfile() {
    const { user, profile, refreshProfile } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);

    const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
        if (!user) return { error: new Error("İstifadəçi tapılmadı") };

        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update(data)
                .eq('user_id', user.id);

            if (error) throw error;

            await refreshProfile();
            toast.success("Profil uğurla yeniləndi");
            return { error: null };
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message || "Xəta baş verdi");
            return { error: err };
        } finally {
            setIsUpdating(false);
        }
    };

    const uploadAvatar = async (file: File) => {
        if (!user) return { error: new Error("İstifadəçi tapılmadı") };

        setIsUpdating(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await updateProfile({ avatar_url: publicUrl });

            return { publicUrl, error: null };
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message || "Şəkil yüklənərkən xəta baş verdi");
            return { error: err };
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updateProfile,
        uploadAvatar,
        isUpdating
    };
}
