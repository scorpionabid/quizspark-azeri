import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Authentication check ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'İcazəsiz giriş' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create user-scoped client to verify auth
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'İcazəsiz giriş' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log(`Authenticated user: ${userId}`);

    // --- Process file ---
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Use service role client for storage/db operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload to user's folder for RLS compliance
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Extract text content based on file type
    let textContent = '';
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      textContent = await file.text();
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = encodeBase64(arrayBuffer);
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Bu PDF sənədinin tam mətnini çıxar. Yalnız mətni qaytar, heç bir əlavə izahat vermə.'
                  },
                  {
                    type: 'file',
                    file: {
                      filename: file.name,
                      file_data: `data:application/pdf;base64,${base64}`
                    }
                  }
                ]
              }
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          textContent = data.choices?.[0]?.message?.content || '';
        }
      }
    } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = encodeBase64(arrayBuffer);
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Bu Word sənədinin tam mətnini çıxar. Yalnız mətni qaytar, heç bir əlavə izahat vermə.'
                  },
                  {
                    type: 'file',
                    file: {
                      filename: file.name,
                      file_data: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`
                    }
                  }
                ]
              }
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          textContent = data.choices?.[0]?.message?.content || '';
        }
      }
    }

    if (!textContent) {
      textContent = `Sənəd yükləndi: ${file.name}. Mətn avtomatik çıxarıla bilmədi.`;
    }

    console.log(`Extracted text length: ${textContent.length}`);

    // Save document metadata with actual user_id
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_type: file.type || fileExt,
        content: textContent,
        user_id: userId
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save document: ${dbError.message}`);
    }

    console.log('Document saved successfully:', docData.id);

    return new Response(
      JSON.stringify({
        success: true,
        document: {
          id: docData.id,
          fileName: docData.file_name,
          content: textContent.substring(0, 500) + (textContent.length > 500 ? '...' : ''),
          fullContent: textContent
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Naməlum xəta baş verdi' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
