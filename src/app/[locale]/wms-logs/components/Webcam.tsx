import { useToast } from "@/components/ui/use-toast";
import { CameraIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

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
  const [deviceId, setDeviceId] = useLocalStorage("deviceId", "");
  let stream: MediaStream | null = null;

  const initializeCameraDevices = useCallback(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices as Device[]);
      if (deviceId) {
        // find deviceId in videoDevices, if found, set it as selectedDevice
        const device = videoDevices.find(
          (device) => device.deviceId === deviceId
        );
        if (device) {
          setSelectedDevice(device.deviceId);
          handleSelect(device.deviceId);
        }
      }
    } catch (error) {
      handleCameraError(error);
    }
  }, []);

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
  }, []);

  const handleDeviceChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      // if event.target.value is empty, clear selectedDevice and deviceId
      if (!event.target.value) {
        // stop the stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          stream = null;
        }
        setSelectedDevice("");
        setDeviceId("");
        handleSelect("");
        return;
      }
      setDeviceId(event.target.value);
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
