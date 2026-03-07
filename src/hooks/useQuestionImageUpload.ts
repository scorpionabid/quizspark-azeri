import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useQuestionImageUpload() {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File) => {
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('question-images')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('question-images')
                .getPublicUrl(data.path);

            return publicUrl;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Naməlum xəta';
            toast.error('Şəkil yüklənərkən xəta baş verdi: ' + message);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading };
}
