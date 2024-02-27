import { useToast } from "@/components/ui/use-toast";
import { ProgressiveUploader } from "@api.video/video-uploader";
import { CameraIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices as Device[]);
      } catch (error) {
        toast({
          title: "Error enumerating video devices",
          description: "Không tìm thấy thiết bị camera, vui lòng kiểm tra lại.",
          variant: "destructive",
        });
        console.error("Error enumerating video devices:", error);
      }
    };

    getVideoDevices();
  }, []);

  const handleDeviceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
    handleSelect(event.target.value);
  };

  return (
    <div className="flex gap-4 items-center">
      {/* Select a video device from list*/}
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
        {/* Display camera component if has deviceID */}
      </div>
    </div>
  );
};

export default SelectCameraDevice;

interface Device {
  deviceId: string;
  kind: string;
  label: string;
}
