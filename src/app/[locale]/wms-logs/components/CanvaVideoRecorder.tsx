import React, { useRef, useEffect, useState } from "react";
import { VideoUploadResponse } from "@api.video/video-uploader";
import { CameraActionPayload } from "../page";
import { Switch } from "@/components/ui/switch";
import slugify from "slugify";
import { toast } from "@/components/ui/use-toast";
import { signOut, useSession } from "next-auth/react";

const WIDTH = 800;
const HEIGHT = 600;

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
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);

  //get user session
  const { data: session } = useSession() as any;
  const canvasRef = useRef<HTMLCanvasElement>(null); // Specify HTMLCanvasElement type

  useEffect(() => {
    //decode session.jwt to get user info
    const jwt = session?.jwt;
    const exp = jwt ? JSON.parse(atob(jwt.split(".")[1])).exp : 0;
    //token expired if 15 days remaining
    if (exp - Date.now() / 1000 < 864000) {
      signOut();
    }

    if (currentUser.blocked) {
      signOut();
    } else {
      //get token
      if (session) {
        setToken(jwt);
      }
    }

    const startCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            aspectRatio: WIDTH / HEIGHT,
            deviceId: { exact: action.deviceId },
            frameRate: { max: 20 },
            width: {
              min: 480,
              ideal: WIDTH,
              max: 720,
            },
            height: {
              min: 480,
              ideal: HEIGHT,
              max: 720,
            },
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
    // Update the video size every 1 second

    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleProgressiveUpload = async (blob: Blob) => {
    const file = new File([blob], `${action.trackingCode}.webm`, {
      type: "video/webm",
    });

    // Maximum allowed file size (e.g., 300MB)
    const MAX_SIZE = 300 * 1024 * 1024;

    // Timeout duration (e.g., 30 seconds)
    const TIMEOUT_DURATION = 60000 * 5;

    //file size in Mb

    // Check if the file size exceeds the maximum allowed size
    if (file.size > MAX_SIZE) {
      const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2);

      //confirm download
      alert(
        `File quá lớn để upload lên cloud (${fileSizeInMB}MB > ${(
          MAX_SIZE /
          1024 /
          1024
        ).toFixed(
          2
        )}MB). Xin lưu về máy để sau này sử dụng (tối thiểu 30 ngày).`
      );

      // Download the file locally if it's too large
      downloadFileLocally(file);
      // Notify the user that the upload is complete
      handleUploadingProgress(false, action.trackingCode, {
        videoId: action.trackingCode,
        assets: {
          mp4: "LOCAL",
        },
        description: "error",
      });
      return;
    }

    // Create a FormData object to send the file in the request

    if (!token) {
      throw new Error("Token is null");
    }
    //if current user is trial, only download the file

    const formData = new FormData();
    const uniqueUploadId = generateUniqueUploadId();
    formData.append("file", file);
    formData.append(
      "filename",
      slugify(file.name, {
        locale: "vi",
      })
    );
    formData.append("token", `${token}.${currentUser.organization.id}`);
    formData.append("organization", `${currentUser.organization.id}`);
    formData.append("isTrial", `${currentUser.isTrial}`);
    formData.append("uniqueId", uniqueUploadId);
    formData.append("mimeType", file.type);

    // Create a timeout promise that rejects after TIMEOUT_DURATION
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), TIMEOUT_DURATION)
    );

    try {
      // Notify the user that the upload is in progress
      handleUploadingProgress(true, action.trackingCode);

      const response = (await Promise.race([
        fetch(`${process.env.NEXT_PUBLIC_MEDIA_ENDPOINT}/upload`, {
          method: "POST",
          body: formData,
        }),
        timeoutPromise,
      ])) as Response;

      console.log(response);
      // Handle the response from the server
      if (!response.ok) {
        throw new Error("File upload failed.");
      }

      const fetchResponse = await response.json();

      // Notify the user that the upload is complete
      handleUploadingProgress(false, action.trackingCode, {
        videoId: action.trackingCode,
        assets: {
          mp4: fetchResponse.data.assets.mp4,
        },
        description: "packed",
      });
      console.info("File upload complete.");
    } catch (error) {
      handleUploadingProgress(false, action.trackingCode, {
        videoId: action.trackingCode,
        assets: {
          mp4: "LOCAL",
        },
        description: "error",
      });
      // Log the error and alert the user
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description:
          "There was an issue uploading the video. Please try again or download the file.",
        variant: "destructive",
      });

      // Download the file locally if an error occurs
      downloadFileLocally(file);
    }
  };

  // Helper function to download the file locally
  const downloadFileLocally = (file: Blob) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = `${action.trackingCode}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div>
      <div>
        {currentUser.isTrial && (
          <p className="text-sm px-2 py-4 text-gray-500 bg-blue-100 rounded-t">
            Với tài khoản dùng thử, video chỉ có thời lượng tối đa 15s.
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
const generateUniqueUploadId = () => {
  const offsetTimezone = new Date().getTimezoneOffset() * 60 * -1;
  const timestamp = Math.floor(Date.now() / 1000);
  return `uqid-${timestamp + offsetTimezone}`;
};

const updateVideoSize = (blob: Blob) => {
  const sizeInMB = (blob.size / 1024 / 1024).toFixed(2);
  const sizeElement = document.getElementById("videoSize"); // Ensure you have an element with this ID
  if (sizeElement) {
    sizeElement.textContent = `Video Size: ${sizeInMB} MB`;
  }
};
