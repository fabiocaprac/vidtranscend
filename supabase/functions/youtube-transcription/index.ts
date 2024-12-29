import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = new URL(req.url).searchParams;

    if (!videoId) {
      throw new Error('Video ID is required');
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY is not configured');
    }

    // First, get the caption tracks
    const captionsListResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!captionsListResponse.ok) {
      const error = await captionsListResponse.text();
      console.error('YouTube Captions API error:', error);
      throw new Error('Failed to fetch captions list');
    }

    const captionsData = await captionsListResponse.json();
    
    // Get video details to use as fallback title
    const videoResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const videoData = await videoResponse.json();
    const videoTitle = videoData.items[0]?.snippet?.title || 'Video Summary';

    // If no captions are available, return an error
    if (!captionsData.items || captionsData.items.length === 0) {
      throw new Error('No captions available for this video');
    }

    // Get the first available caption track
    const captionTrack = captionsData.items[0];
    
    // Get the actual transcript
    const transcriptResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/captions/${captionTrack.id}?key=${YOUTUBE_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!transcriptResponse.ok) {
      const error = await transcriptResponse.text();
      console.error('YouTube Transcript API error:', error);
      throw new Error('Failed to fetch transcript');
    }

    const transcriptData = await transcriptResponse.text();

    return new Response(
      JSON.stringify({ 
        transcription: transcriptData,
        title: videoTitle
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in youtube-transcription function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});