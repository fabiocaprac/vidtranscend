export const getVideoId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export const fetchTranscription = async (videoId: string) => {
  try {
    // First, get the caption tracks
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
    );
    
    if (!captionsResponse.ok) {
      throw new Error("Failed to fetch captions");
    }

    const captionsData = await captionsResponse.json();
    const captionTrack = captionsData.items?.[0];

    if (!captionTrack) {
      throw new Error("No captions available for this video");
    }

    // Then, get the actual transcript
    const transcriptResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionTrack.id}?key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
    );

    if (!transcriptResponse.ok) {
      throw new Error("Failed to fetch transcript");
    }

    const transcriptData = await transcriptResponse.text();
    return transcriptData;
  } catch (error) {
    console.error("Error fetching transcription:", error);
    throw new Error("Failed to fetch video transcription");
  }
};