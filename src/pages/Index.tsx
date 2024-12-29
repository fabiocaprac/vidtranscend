import { useState } from "react";
import { YouTubeInput } from "@/components/YouTubeInput";
import { MindMap } from "@/components/MindMap";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { getVideoId, fetchTranscription } from "@/utils/youtube";
import { summarizeTranscription } from "@/utils/gemini";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<any>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      const videoId = getVideoId(url);
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }

      const transcription = await fetchTranscription(videoId);
      const summary = await summarizeTranscription(transcription);
      
      setMindMapData(summary);
      toast.success("Mind map generated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate mind map");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            YouTube Video Mind Map Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any YouTube video into an interactive mind map. Just paste the video URL below
            and watch the magic happen!
          </p>
        </div>

        <YouTubeInput onSubmit={handleSubmit} isLoading={isLoading} />

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {!isLoading && mindMapData && <MindMap data={mindMapData} />}
        </div>
      </div>
    </div>
  );
};

export default Index;