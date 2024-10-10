"use client";
import { Copy } from "lucide-react";
// components/UploadXLSX.tsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface DataRow {
  [key: string]: any;
}

const UploadXLSX: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [orders, setOrders] = useState<{
    [key: string]: { orderId: string; skus: string[] }[];
  }>({});

  const [selectedSku, setSelectedSku] = useState<string | null>(null); // Step 1: Track selected SKU
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    const orders = Object.keys(groupByOrder(data as any)).map((key) => {
      return {
        orderId: key,
        skus: groupByOrder(data as any)[key].map((order) => order.SKU),
      };
    });

    // Step 1: Filter orders with a single SKU
    const singleSkuOrders = orders.filter((order) => order.skus.length === 1);

    // Group singleSkuOrders by sku, sort by sku length
    const groupBySku = singleSkuOrders.reduce((acc, order) => {
      if (!acc[order.skus[0]]) {
        acc[order.skus[0]] = [];
      }
      acc[order.skus[0]].push(order);
      return acc;
    }, {} as { [key: string]: any[] });

    setOrders(groupBySku);

    // Step 2: Filter orders with multiple SKUs
    const multipleSkuOrders = orders.filter((order) => order.skus.length > 1);
  }, [data]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const binaryStr = data.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        );
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<DataRow>(worksheet);
        setData(fillMissingOrderIds(jsonData as any as Order[]));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied");
    setIsCopy(true);
    //
  };

  const handleRowClick = (sku: string) => {
    // Toggle selection: If the clicked SKU is already selected, deselect it; otherwise, select it.
    setSelectedSku((prevSelected) => (prevSelected === sku ? null : sku));
  };

  return (
    <div className="ml-12">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      {/* orders table by sku | orders */}
      <table className="border overflow-scroll">
        <thead>
          <tr className="border bg-gray-200">
            <th>SKU</th>
            <th>Orders</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(orders).map((sku) => (
            <tr
              key={sku}
              onClick={() => handleRowClick(sku)} // Step 2: Handle row click
              className={`cursor-pointer ${
                selectedSku === sku ? "bg-gray-300" : ""
              }`} // Step 3: Apply conditional class
            >
              <td className="border flex justify-between">
                {sku}{" "}
                <Copy
                  className="text-gray-700 w-4"
                  onClick={() =>
                    handleCopy(
                      orders[sku]
                        .map((order: { orderId: string }) => order.orderId)
                        .join(", ")
                    )
                  }
                />
              </td>
              <td className={"border "}>
                <span className="text-sm text-gray-500 ml-2">
                  {orders[sku]
                    .map((order: { orderId: string }) => order.orderId)
                    .join(", ")}
                </span>
              </td>
              <td className="border">{orders[sku].length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadXLSX;

type Order = {
  STT?: number;
  "Đơn hàng"?: string; // Make 'Đơn hàng' optional to handle missing IDs
  "Tên sản phẩm": string;
  SKU: string;
  "Số lượng": number;
  "Đơn giá": number;
  "Trạng thái liên kết sản phẩm": string;
  "Sản phẩm liên kết": string;
  "Gian hàng"?: string;
  "Ngày tạo"?: string;
  "Trạng thái trên Sàn"?: string;
  "Trạng thái đồng bộ"?: string;
  "Kho hàng"?: string;
  "Vận chuyển"?: string;
  "Mã vận đơn"?: string;
  "Mã đơn trên Sapo": string;
  "Tổng giá trị": number;
  "Thông tin khách hàng": string;
};

// Function to fill missing Order IDs
const fillMissingOrderIds = (orders: Order[]): Order[] => {
  let lastOrderId: string | undefined;

  // Create a new array for updated orders
  const updatedOrders: Order[] = [];

  for (const order of orders) {
    if (order["Đơn hàng"]) {
      lastOrderId = order["Đơn hàng"];
    } else if (lastOrderId) {
      order["Đơn hàng"] = lastOrderId; // Fill the missing Order ID
    }

    // Push a copy of the order into the updatedOrders array
    updatedOrders.push({ ...order });
  }

  return updatedOrders; // Return the new array
};
function groupByOrder(orders: Order[]): { [key: string]: Order[] } {
  return orders.reduce((acc, order) => {
    // Create a new array if the order doesn't exist in the accumulator
    if (!acc[order["Đơn hàng"] as string]) {
      acc[order["Đơn hàng"] as string] = [];
    }
    // Push the current order into the corresponding array
    acc[order["Đơn hàng"] as string].push(order);
    return acc;
  }, {} as { [key: string]: Order[] });
}
