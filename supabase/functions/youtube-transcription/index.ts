import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoId } = new URL(req.url).searchParams

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    
    // First, get the caption tracks
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    )
    
    if (!captionsResponse.ok) {
      throw new Error("Failed to fetch captions")
    }

    const captionsData = await captionsResponse.json()
    const captionTrack = captionsData.items?.[0]

    if (!captionTrack) {
      throw new Error("No captions available for this video")
    }

    // Then, get the actual transcript
    const transcriptResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionTrack.id}?key=${YOUTUBE_API_KEY}`
    )

    if (!transcriptResponse.ok) {
      throw new Error("Failed to fetch transcript")
    }

    const transcriptData = await transcriptResponse.text()

    return new Response(
      JSON.stringify({ transcription: transcriptData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})