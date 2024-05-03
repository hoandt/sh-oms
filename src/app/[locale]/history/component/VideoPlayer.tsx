import { Button } from "@/components/ui/button";
import { DownloadCloudIcon } from "lucide-react";

const VideoPlayer = ({ src }: { src: string }) => {
  return (
    <div>
      <video controls autoPlay muted>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Download button */}
    </div>
  );
};

export default VideoPlayer;
