import { useToast } from "@/components/ui/use-toast";
import { ProgressiveUploader } from "@api.video/video-uploader";
import { useEffect, useRef, useState } from "react";
import { CameraActionPayload } from "../page";
import { updateLogs } from "@/services";
import { useMutation } from "@tanstack/react-query";

const WIDTH = 1920;
const HEIGHT = 1080;
const DEFAULT_UPLOAD_TOKEN = process.env.NEXT_PUBLIC_UPLOAD_TOKEN!;
const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};
function CameraRecorder({
  action,
  handleStream,
}: {
  action: CameraActionPayload;
  handleStream: (status: boolean) => void;
}): JSX.Element {
  const { toast } = useToast();
  const uploader = new ProgressiveUploader({
    uploadToken: DEFAULT_UPLOAD_TOKEN,
    retries: 10,
    videoName: action.trackingCode,
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const mutateUpdateLog = useMutation({
    mutationFn: (id: number) => {
      return updateLogs({ id, videoUrl });
    },
    onSuccess: (data: any) => {
      toast({
        duration: 3000,
        title: "Đã update",
        description: `Giao dịch ${JSON.stringify(
          data.data.data.attributes.transaction
        )} đã được update!`,
      });
      // refetch();
    },
  });

  useEffect(() => {
    videoUrl && mutateUpdateLog.mutate(295);
    console.log("res:", { videoUrl });
  }, [videoUrl]);
  //   handle camera recording with action
  useEffect(() => {
    if (action.action === "start") {
      startRecording();
    }
    if (action.action === "stop") {
      stopRecording();
    }
    if (action.action === "idle") {
      cancelRecording();
    }
  }, [action.action]);
  const handleProgressiveUpload = (blob: Blob) => {
    uploader.onProgress((event) => {
      console.log(
        `total number of bytes uploaded for this upload: ${bytesToSize(
          event.uploadedBytes
        )}.`
      );
      console.log(`total size of the file: ${event.totalBytes}.`);
      console.log(`current part: ${event.part}.`);
    });
    uploader
      .uploadPart(blob)
      .then(() => {
        // Handle uploading parts
        // Once all parts uploaded, call uploadLastPart method
        uploader
          .uploadLastPart(blob)
          .then((video) => {
            console.log("Video uploaded:", video);
            setVideoUrl(video.assets?.mp4 || "");
            toast({
              title: "Video uploaded",
              description: "Video has been uploaded successfully.",
              duration: 3000,
            });
          })
          .catch((error) => {
            toast({
              title: "Error uploading video",
              description: "Please try again.",
              variant: "destructive",
            });
            console.error("Error uploading video:", error);
          });
      })
      .catch((error) => {
        toast({
          title: "Error enumerating video devices",
          description: "Please check your camera and try again.",
          variant: "destructive",
        });
        console.error("Error uploading video parts:", error);
      });
  };

  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        deviceId: { exact: action.deviceId },
        width: { min: 100, ideal: 1280, max: WIDTH },
        height: { min: 100, ideal: 720, max: HEIGHT },
        frameRate: { ideal: 25 },
      },
    };

    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        handleStream(true);
        setStream(stream);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    if (action.deviceId) {
      getMedia();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [action.deviceId]);

  const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: "video/webm" });
        // Here, you can handle the recorded blob, e.g., save it to server, download, etc.
        console.log("Recorded Blob:", recordedBlob);
        handleProgressiveUpload(recordedBlob); // Upload the recorded video
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const cancelRecording = () => {
    if (recording) {
      if (mediaRecorder) {
        setCancelled(true);
        setRecording(false);
        uploader.cancel();
      }
    }
  };

  return (
    <div>
      {<video className="rounded" ref={videoRef} autoPlay playsInline />}
      {stream ? (
        <div>
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
        </div>
      ) : (
        "Loading camera..."
      )}
    </div>
  );
}

export default CameraRecorder;
