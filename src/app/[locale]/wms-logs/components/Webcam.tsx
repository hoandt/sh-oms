import { useToast } from "@/components/ui/use-toast";
import { CameraIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState, useCallback } from "react";

interface Device {
  deviceId: string;
  kind: string;
  label: string;
}

const SelectCameraDevice = ({
  handleSelect,
}: {
  handleSelect: (device: string) => void;
}) => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  let stream: MediaStream | null = null;

  // Function to handle camera permission and enumerate devices
  // Function to handle camera permission and enumerate devices
  const initializeCameraDevices = useCallback(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices as Device[]);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
        handleSelect(videoDevices[0].deviceId);
      }
    } catch (error) {
      handleCameraError(error);
    }
  }, []);

  // Handle camera permission error
  const handleCameraError = useCallback(
    (error: any) => {
      toast({
        title: "Camera permission denied",
        description:
          "Bạn đã từ chối quyền truy cập camera. Vui lòng cấp quyền để tiếp tục sử dụng.",
        variant: "destructive",
      });
      console.error("Camera permission denied:", error);
    },
    [toast]
  );

  // Handle clearing selected device
  useEffect(() => {
    if (!selectedDevice && stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [selectedDevice]);

  useEffect(() => {
    initializeCameraDevices();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initializeCameraDevices]);

  // Handle device change
  const handleDeviceChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedDevice(event.target.value);
      handleSelect(event.target.value);
    },
    [handleSelect]
  );

  return (
    <div className="flex gap-4 items-center">
      <CameraIcon />
      <div className="flex-1">
        <select
          value={selectedDevice}
          onChange={handleDeviceChange}
          className="px-2 py-4 rounded w-full"
        >
          <option value="" className="px-4 rounded">
            Chọn camera
          </option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectCameraDevice;
