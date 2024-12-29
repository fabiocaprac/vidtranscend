export const getVideoId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export const fetchTranscription = async (videoId: string) => {
  try {
    const response = await fetch(`/api/youtube-transcription?videoId=${videoId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch transcription");
    }

    const data = await response.json();
    return data.transcription;
  } catch (error) {
    console.error("Error fetching transcription:", error);
    throw new Error("Failed to fetch video transcription");
  }
};