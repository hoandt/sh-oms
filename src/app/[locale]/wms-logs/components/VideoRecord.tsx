import { useToast } from "@/components/ui/use-toast";
import {
  ProgressiveUploader,
  VideoUploadResponse,
} from "@api.video/video-uploader";
import { useEffect, useRef, useState } from "react";
import { CameraActionPayload } from "../page";
import { useSession } from "next-auth/react";

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
  handleUploading,
}: {
  action: CameraActionPayload;
  handleStream: (status: boolean) => void;
  handleUploading: (status: boolean, video?: VideoUploadResponse) => void;
}): JSX.Element {
  // get current user  session from the server
  const { data: session } = useSession();
  // get the toast function from the hook

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

  const handleProgressiveUpload = async (blob: Blob) => {
    handleUploading(true);
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileChunks = [];
      const chunkSize = 1024 * 1024 * 5; // 5MB chunk size
      let offset = 0;
      if (
        fileReader.result !== null &&
        fileReader.result instanceof ArrayBuffer
      ) {
        while (offset < fileReader.result.byteLength) {
          const chunk = fileReader.result.slice(offset, offset + chunkSize);
          fileChunks.push(chunk);
          offset += chunkSize;
        }

        for (const chunk of fileChunks) {
          const blob = new Blob([chunk], { type: "video/webm" });

          const formData = new FormData();
          formData.append("file", blob);
          formData.append("upload_preset", "i63skbkc");
          formData.append("trackingCode", action.trackingCode);
          formData.append("filename", action.trackingCode); // Add the filename

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/djdygww0g/video/upload",
            {
              method: "POST",
              body: formData,
              headers: {
                //   "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          if (!response.ok) {
            // Handle upload error
          }
        }
      }
    };

    fileReader.readAsArrayBuffer(blob);
  };

  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        deviceId: { exact: action.deviceId },
        width: { min: 100, ideal: 1920, max: WIDTH },
        height: { min: 100, ideal: 1080, max: HEIGHT },
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

      recorder.onstop = async () => {
        const recordedBlob = new Blob(chunks, { type: "video/webm" });
        // Here, you can handle the recorded blob, e.g., save it to server, download, etc.
        console.log("Recorded Blob:", recordedBlob);
        handleProgressiveUpload(recordedBlob).then(() => {
          handleUploading(false);
        }); // Upload the recorded video
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      handleUploading(true);
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
        setRecording(false);
        uploader.cancel();
        handleUploading(false);
      }
    }
  };

  return (
    <div className="relative">
      {
        <video
          className="rounded"
          ref={videoRef}
          width={WIDTH}
          height={HEIGHT}
          autoPlay
          playsInline
        />
      }
      {!stream && "Loading..."}
    </div>
  );
}

export default CameraRecorder;
