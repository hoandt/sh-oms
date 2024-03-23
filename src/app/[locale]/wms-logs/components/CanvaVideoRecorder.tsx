import React, { useRef, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  ProgressiveUploader,
  VideoUploadResponse,
} from "@api.video/video-uploader";
import { CameraActionPayload } from "../page";
const WIDTH = 1280;
const HEIGHT = 960;
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

  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null); // Specify HTMLCanvasElement type
  const { toast } = useToast();
  const uploader = new ProgressiveUploader({
    uploadToken: currentUser.isTrial
      ? process.env.NEXT_PUBLIC_TRIAL_UPLOAD_TOKEN!
      : process.env.NEXT_PUBLIC_UPLOAD_TOKEN!,
    retries: 10,
    videoName: action.trackingCode,
  });
  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            deviceId: { exact: action.deviceId },
            width: { min: 480, ideal: WIDTH, max: 1920 },
            height: { min: 480, ideal: HEIGHT, max: 1080 },
            frameRate: { ideal: 30 },
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
  useEffect(() => {
    if (isRecording) {
      const intervalId = setInterval(drawTextOnCanvas, 60); // Redraw text every 120 milliseconds
      return () => clearInterval(intervalId);
    }
  }, [isRecording]);
  const startRecording = () => {
    if (!canvasRef.current) {
      return;
    }
    const stream = canvasRef.current.captureStream(30);
    // SET frameRate

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
      videoBitsPerSecond: 3 * 1024 * 1024,
    });

    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks);
      if (currentUser.isTrial) {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 44px Monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#EEE";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    // add image

    // currenttime with date and time and seconds
    const currentTime = new Date().toLocaleString("en-US", {
      hour: "numeric",
      hour12: false,
      minute: "numeric",
      second: "numeric",
    });
    // current Date
    const currentDate = new Date().toLocaleString("vi-VN", {
      month: "2-digit",
      day: "numeric",
      year: "numeric",
    });
    ctx.fillText(`${action.trackingCode}`, 20, 50); // Adjust position as needed
    ctx.strokeText(`${action.trackingCode}`, 21, 51); // Adjust position as needed
    ctx.fillText(`${currentUser.username}`, 20, HEIGHT - 20); //bottom left
    ctx.strokeText(`${currentUser.username}`, 21, HEIGHT - 19); //bottom left
    ctx.fillText(`${currentDate} `, 20, 100); //top right
    ctx.strokeText(`${currentDate} `, 21, 101); //top right
    ctx.fillText(`${currentTime} `, 20, 150); //top right
    ctx.strokeText(`${currentTime} `, 21, 151);
    // ADD LOGO "SWIFTHUB" text
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#DDDDDD";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillText(`SWIFTHUB`, WIDTH - 96, HEIGHT - 22); //bottom right
    ctx.strokeText(`SWIFTHUB`, WIDTH - 96, HEIGHT - 21); //bottom right
    if (currentUser.isTrial) {
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      // CENTER TRIAL TEXT
      ctx.fillText(`Tài khoản dùng thử`, WIDTH / 2, HEIGHT / 2); //bottom right
    }
  };

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
        <p></p>
        {/* info color */}

        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          playsInline
          muted
        />
        {currentUser.isTrial && (
          <p className="text-sm px-2 py-4 text-gray-500 bg-blue-100">
            Với tài khoản dùng thử, video sẽ được tự động tải về máy thay vì lưu
            trên cloud.{" "}
            <a
              href="https://swifthub.net/vi/order-tracking/"
              target="_blank"
              className="underline text-blue-500"
            >
              Nâng cấp tài khoản
            </a>
          </p>
        )}
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
