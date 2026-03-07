import { supabase } from '@/integrations/supabase/client';

export function useQuestion3DUpload() {
    const upload3DModel = async (file: File): Promise<string> => {
        const ext = file.name.split('.').pop(); // glb, gltf
        const filename = `${crypto.randomUUID()}.${ext}`;

        // Yükləməyə başla
        const { error } = await supabase.storage
            .from('question-3d-models')
            .upload(filename, file, { contentType: file.type || 'application/octet-stream' });

        if (error) throw error;

        // Təqdim olunan public URL-i götür
        const { data } = supabase.storage
            .from('question-3d-models')
            .getPublicUrl(filename);

        return data.publicUrl;
    };

    return { upload3DModel };
}
