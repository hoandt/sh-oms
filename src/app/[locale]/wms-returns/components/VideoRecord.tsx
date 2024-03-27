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
  const session = useSession() as any;
  const user = session.data.userWithRole as UserWithRole;

  const [uploadToken, setUploadToken] = useState<string>(() => {
    return user?.isTrial
      ? process.env.NEXT_PUBLIC_TRIAL_UPLOAD_TOKEN!
      : process.env.NEXT_PUBLIC_UPLOAD_TOKEN!;
  });
  useEffect(() => {
    console.log(user);
    if (user?.isTrial) {
      setUploadToken(process.env.NEXT_PUBLIC_TRIAL_UPLOAD_TOKEN!);
    } else {
      setUploadToken(process.env.NEXT_PUBLIC_UPLOAD_TOKEN!);
    }
  }, [user?.isTrial]);

  const { toast } = useToast();
  const uploader = new ProgressiveUploader({
    uploadToken: uploadToken,
    retries: 10,
    videoName: action.trackingCode,
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    // create file from blob
    const file = new File([blob], `${action.trackingCode}`, {
      type: "video/webm",
    });

    //
    file.stream().pipeTo(
      new WritableStream({
        write(chunk) {
          console.log(chunk);
        },
        close() {
          console.log("done");
        },
      })
    );

    // uploader.onProgress((event) => {
    //   console.log(
    //     `total number of bytes uploaded for this upload: ${bytesToSize(
    //       event.uploadedBytes
    //     )}.`
    //   );
    //   console.log(`total size of the file: ${event.totalBytes}.`);
    //   console.log(`current part: ${event.part}.`);
    // });
    // uploader
    //   .uploadPart(blob)
    //   .then(() => {
    //     // Handle uploading parts
    //     // Once all parts uploaded, call uploadLastPart method
    //     uploader
    //       .uploadLastPart(blob)
    //       .then((video) => {
    //         handleUploading(false, video);
    //       })
    //       .catch((error) => {
    //         toast({
    //           title: "Error uploading video",
    //           description: "Please try again.",
    //           variant: "destructive",
    //         });
    //         console.error("Error uploading video:", error);
    //       });
    //   })
    //   .catch((error) => {
    //     toast({
    //       title: "Error enumerating video devices",
    //       description: "Please check your camera and try again.",
    //       variant: "destructive",
    //     });
    //     console.error("Error uploading video parts:", error);
    //   });
  };

  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        deviceId: { exact: action.deviceId },
        width: { min: 480, ideal: 1920, max: WIDTH },
        height: { min: 480, ideal: 1080, max: HEIGHT },
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
      {<video className="rounded w-full" ref={videoRef} autoPlay playsInline />}
      {!stream && "Loading..."}
    </div>
  );
}

export default CameraRecorder;
