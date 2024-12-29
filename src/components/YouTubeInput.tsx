import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface YouTubeInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const YouTubeInput = ({ onSubmit, isLoading }: YouTubeInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic YouTube URL validation
    if (!url.includes("youtube.com/watch?v=") && !url.includes("youtu.be/")) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4 animate-fade-up">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          placeholder="Paste YouTube video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !url} className="bg-primary hover:bg-primary/90">
          {isLoading ? "Processing..." : "Generate Mind Map"}
        </Button>
      </div>
    </form>
  );
};