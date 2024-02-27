import { Button } from "@/components/ui/button";
import { DownloadCloudIcon } from "lucide-react";

const VideoPlayer = ({ src }: { src: string }) => {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.target = "_blank";
    a.download = "SPX.mp4";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <video controls autoPlay muted>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Download button */}
      <Button className="mt-2 inline-flex gap-2" onClick={handleDownload}>
        <DownloadCloudIcon /> Download
      </Button>
    </div>
  );
};

export default VideoPlayer;
