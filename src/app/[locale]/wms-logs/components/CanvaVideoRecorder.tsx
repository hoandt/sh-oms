import React, { useRef, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  ProgressiveUploader,
  VideoUploadResponse,
} from "@api.video/video-uploader";
import { CameraActionPayload } from "../page";
import { Switch } from "@/components/ui/switch";
const WIDTH = 1280;
const HEIGHT = 720;
const CanvasVideoRecorder = ({
  action,
  handleStream,
  handleUploadingProgress,
  currentUser,
}: {
  action: CameraActionPayload;
  handleStream: (status: boolean) => void;
  handleUploadingProgress: (
    uploading: boolean,
    trackingCode: string,
    video?: VideoUploadResponse
  ) => void;
  currentUser: UserWithRole;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSaveToLocal, setIsSaveToLocal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const uploadToken = currentUser.isTrial
    ? process.env.NEXT_PUBLIC_TRIAL_UPLOAD_TOKEN!
    : process.env.NEXT_PUBLIC_UPLOAD_TOKEN!;
  const canvasRef = useRef<HTMLCanvasElement>(null); // Specify HTMLCanvasElement type
  const { toast } = useToast();
  const uploader = new ProgressiveUploader({
    uploadToken,
    retries: 5,
    videoName: action.trackingCode,
    retryStrategy(retryCount, error) {
      console.log(`Retrying upload. Attempt ${retryCount}. Error:`, error);
      return 5000; // Retry after 5 seconds
    },
  });
  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: "user",

            aspectRatio: WIDTH / HEIGHT,
            deviceId: { exact: action.deviceId },
            frameRate: { ideal: 24 },
            width: {
              min: 480,
              ideal: WIDTH,
              max: 1920,
            },
            height: {
              min: 480,
              ideal: HEIGHT,
              max: 1080,
            },
            sampleSize: 3,
            // facingMode:
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          handleStream(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [action.deviceId]);
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

  const startRecording = () => {
    if (!canvasRef.current || !videoRef.current || mediaStream === null) {
      return;
    }

    const recorder = new MediaRecorder(mediaStream, {
      // videoBitsPerSecond: 3 * 1024 * 1024,
      // // check if mimeType is supported
      mimeType: "video/webm; codecs=vp9",
    });

    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks);
      if (isSaveToLocal) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${action.trackingCode}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
      handleProgressiveUpload(blob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  const drawTextOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Cache repeated values
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Set text styles
    ctx.font = "bold 40px Monospace";
    ctx.textAlign = "left";
    ctx.lineWidth = 2;

    // Draw tracking code
    ctx.fillStyle = "#EEE";
    ctx.strokeStyle = "black";
    ctx.strokeText(`${action.trackingCode}`, 21, 51); // Adjust position as needed
    ctx.fillText(`${action.trackingCode}`, 20, 50); // Adjust position as needed

    // Draw current date and time
    const currentTime = new Date().toLocaleString("en-US", {
      hour: "numeric",
      hour12: false,
      minute: "numeric",
      second: "numeric",
    });
    const currentDate = new Date().toLocaleString("vi-VN", {
      month: "2-digit",
      day: "numeric",
      year: "numeric",
    });
    ctx.strokeText(`${currentDate}`, 21, 101); // Top right
    ctx.fillText(`${currentDate}`, 20, 100); // Top right

    // calculate currentDate width and adjust position for currentTime
    const currentDateWidth = ctx.measureText(currentDate).width;
    ctx.strokeText(`${currentTime}`, 21 + currentDateWidth + 20, 101); // Top right
    ctx.fillText(`${currentTime}`, 20 + currentDateWidth + 20, 100); // Top right

    // calculate canvas height and adjust position for username
    const canvasHeight = canvas.height;
    ctx.strokeText(`${currentUser.username}`, 21, canvasHeight - 51); // Bottom left
    ctx.fillText(`${currentUser.username}`, 20, canvasHeight - 50); // Bottom left

    // Draw trial text if applicable
    if (currentUser.isTrial) {
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(`Tài khoản dùng thử`, videoWidth / 2, videoHeight / 2); // Center
    }
  };

  //type for event

  const handleProgressiveUpload = (blob: Blob) => {
    uploader.onProgress((event) => {
      handleUploadingProgress(true, action.trackingCode);
    });
    uploader
      .uploadPart(blob)
      .then(() => {
        // Handle uploading parts
        // Once all parts uploaded, call uploadLastPart method
        uploader
          .uploadLastPart(blob)
          .then((video) => {
            handleUploadingProgress(false, action.trackingCode, video);
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

  return (
    <div>
      <div>
        {currentUser.isTrial && (
          <p className="text-sm px-2 py-4 text-gray-500 bg-blue-100 rounded-t">
            Với tài khoản dùng thử, video chỉ có thời lượng tối đa 30s.
            <a
              href="https://swifthub.net/vi/order-tracking/"
              target="_blank"
              className="underline text-blue-500"
            >
              Nâng cấp tài khoản
            </a>
          </p>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          // 4:3 aspect ratio
          className="w-full h-full object-cover"
        />

        <div className="flex items-center gap-2 px-2 bg-slate-100 text-sm py-2 rounded-b text-slate-900">
          Cho phép lưu về máy
          <Switch
            defaultChecked={isSaveToLocal}
            onCheckedChange={(checked) => setIsSaveToLocal(checked)}
          />
        </div>

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CanvasVideoRecorder;

// CloudVideoUploadResponse from cloudinary
export type CloudVideoUploadResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  playback_url: string;
  folder: string;
  access_mode: string;
  existing: boolean;
  audio: Record<string, unknown>;
  video: Record<string, unknown>;
  frame_rate: number;
  duration: number;
  rotation: number;
  original_filename: string;
  done: boolean;
};
