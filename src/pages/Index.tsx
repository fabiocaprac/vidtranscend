import { useState } from "react";
import { YouTubeInput } from "@/components/YouTubeInput";
import { MindMap } from "@/components/MindMap";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";

// Mock data for demonstration
const mockMindMapData = {
  id: "root",
  text: "Video Title",
  children: [
    {
      id: "1",
      text: "Main Point 1",
      children: [
        { id: "1.1", text: "Sub-point 1.1" },
        { id: "1.2", text: "Sub-point 1.2" },
      ],
    },
    {
      id: "2",
      text: "Main Point 2",
      children: [
        { id: "2.1", text: "Sub-point 2.1" },
        { id: "2.2", text: "Sub-point 2.2" },
      ],
    },
  ],
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<any>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API calls here
      // For now, we'll use mock data after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMindMapData(mockMindMapData);
      toast.success("Mind map generated successfully!");
    } catch (error) {
      toast.error("Failed to generate mind map. Please try again.");
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