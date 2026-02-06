import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, questionText, subject, saveToStorage = false } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Setup Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if present
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Build the image generation prompt
    let imagePrompt = prompt;
    if (!imagePrompt && questionText) {
      imagePrompt = `Educational illustration for: ${questionText}. 
      Subject: ${subject || 'General'}.
      Style: Clean, minimalist educational diagram. 
      Colors: Professional, easy to read.
      No text in the image, only visual elements.
      Make it suitable for a quiz question illustration.`;
    }

    if (!imagePrompt) {
      throw new Error('Prompt or questionText is required');
    }

    console.log(`Generating image with prompt: ${imagePrompt.substring(0, 100)}...`);

    // Call Lovable AI with image generation model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          { role: 'user', content: imagePrompt }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Sorğu limiti aşıldı. Zəhmət olmasa bir az gözləyin.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Kredit balansı bitib. Zəhmət olmasa hesabınızı doldurun.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the image from the response
    const images = data.choices?.[0]?.message?.images;
    if (!images || images.length === 0) {
      throw new Error('Şəkil yaradıla bilmədi');
    }

    const imageUrl = images[0]?.image_url?.url;
    if (!imageUrl) {
      throw new Error('Şəkil URL-i tapılmadı');
    }

    // If saveToStorage is true, upload to Supabase storage
    let storedUrl = imageUrl;
    if (saveToStorage && userId) {
      try {
        // Extract base64 data from data URL
        const base64Match = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
        if (base64Match) {
          const imageType = base64Match[1];
          const base64Data = base64Match[2];
          
          // Decode base64 to Uint8Array using the imported function
          const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          const fileName = `${userId}/${Date.now()}.${imageType}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('question-images')
            .upload(fileName, binaryData, {
              contentType: `image/${imageType}`,
              upsert: false
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
          } else {
            const { data: publicUrl } = supabase.storage
              .from('question-images')
              .getPublicUrl(fileName);
            
            storedUrl = publicUrl.publicUrl;
            console.log('Image stored at:', storedUrl);
          }
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
        // Continue with base64 URL if storage fails
      }
    }

    // Log usage
    await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      provider: 'lovable',
      model: 'google/gemini-2.5-flash-image',
      input_tokens: 0,
      output_tokens: 0,
      request_type: 'image_generation',
    });

    return new Response(
      JSON.stringify({ 
        imageUrl: storedUrl,
        isBase64: storedUrl.startsWith('data:')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-question-image function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Naməlum xəta baş verdi' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
