"use client";
import React, { use, useEffect, useState } from "react";
import BarcodeScanForm from "./components/BarcodeScanner";
import { useSession } from "next-auth/react";
type TrackingCodeLine = {
  code: string;
  startTime: string;

  user: string;
};
type Status = "packing" | "packed";
const page = () => {
  const session = useSession() as any;

  const [trackingCodes, setTrackingCodes] = useState<TrackingCodeLine[] | []>(
    []
  );
  const [status, setStatus] = useState<Status>("packing");
  const [user, setUser] = useState<string>("John Doe");
  useEffect(() => {
    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;
      setUser(user.firstName + " " + user.lastName);
    }
  }, [session]);

  const handleScan = (code: string) => {
    setTrackingCodes((prev) => [
      {
        code: code,
        //  dd/MM/yyyy
        startTime: new Date().toLocaleString("vi-VN"),

        user: user,
      },
      ...prev,
    ]);
  };

  return (
    <div className="-mt-32 ">
      {/* Add padding-top equivalent to the height of your sticky header */}
      <div className="grid grid-cols-6">
        {/* Sidebar */}
        <div className="bg-slate-200 h-screen col-span-2 pt-32">
          <div className="p-4">
            <BarcodeScanForm handleScan={handleScan} />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-4 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-gray-800">Tracking mã đơn</h1>

            <div>
              <table className="w-full  bg-gray-100 rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th>STT</th>
                    <th className="w-2/5S py-2 px-4">Tracking Code</th>
                    <th className="table-auto">Đóng gói</th>

                    <th className="table-auto">Nhân viên</th>
                    <th className="table-auto">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {trackingCodes &&
                    trackingCodes.map((line, i) => (
                      <tr
                        key={trackingCodes.length - i}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-2 px-4">
                          {trackingCodes.length - i}
                        </td>
                        <td className="w-2/5S py-2 px-4">{line.code}</td>
                        <td className="py-2 px-4">
                          {line.startTime.toLocaleString()}
                        </td>
                        <td className="py-2 px-4">{line.user}</td>
                        <td className="py-2 px-4">Finish | Xóa</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
