import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to storage
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
      // For PDF, we'll use AI to extract content
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
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
      // For DOCX, extract text using AI
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
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

    // If we couldn't extract text, provide a message
    if (!textContent) {
      textContent = `Sənəd yükləndi: ${file.name}. Mətn avtomatik çıxarıla bilmədi.`;
    }

    console.log(`Extracted text length: ${textContent.length}`);

    // Save document metadata to database
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_type: file.type || fileExt,
        content: textContent,
        user_id: null // For demo, no auth required
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
