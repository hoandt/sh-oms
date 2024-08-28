import React, { useState, useEffect, useRef, useMemo } from "react";
import { SHOrder } from "@/types/todo";
import { useGetLogs } from "@/query-keys/logs/query";
import { getLogs } from "@/services";

interface ScanProps {
  shOrder: SHOrder;
  handleComplete: () => void;
  organization: number;
}

function ScanBarcode({ shOrder, handleComplete, organization }: ScanProps) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOrderScanned, setIsOrderScanned] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [logs, setLogs] = useState<any>(null);

  //if logs has data, setError to the error message
  useEffect(() => {
    getLogs({
      organization: organization,
      transaction: shOrder.attributes.trackingNumber,
      status: undefined,
      page: 1,
      pageSize: 1,
    }).then((data) => {
      setIsOrderScanned(true);
      setError(
        `Đơn ${shOrder.attributes.trackingNumber} (${
          shOrder.attributes.orderNumber
        }) đã được đóng gói ${
          // to Vietnam locale
          new Date(data.data[0].attributes.createdAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          })
        }`
      );
    });
  }, []);

  // Function to handle barcode scanning
  const handleScan = () => {
    const foundItem = shOrder.attributes.fulfillments.line_items.find(
      (itemLine) => itemLine.barcode === barcodeInput
    );

    if (foundItem) {
      const existingItem = scannedItems.find(
        (item) => item.sku === foundItem.sku
      );

      if (existingItem) {
        if (existingItem.scannedCount < foundItem.quantity) {
          setScannedItems(
            scannedItems.map((item) =>
              item.sku === foundItem.sku
                ? { ...item, scannedCount: item.scannedCount + 1 }
                : item
            )
          );
          setError(null);
        } else {
          setError("Already scanned the required quantity for this item.");
        }
      } else {
        setScannedItems([...scannedItems, { ...foundItem, scannedCount: 1 }]);
        setError(null);
      }
    } else {
      setError("Barcode not found.");
    }

    // Clear the input field after scanning
    setBarcodeInput("");
  };

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleScan();
    }
  };

  // Automatically focus on the input field after component mounts
  useEffect(() => {
    inputRef.current?.focus();
    //f4 to focus on the input field
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F4") {
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Check if all items are scanned
  useEffect(() => {
    const allItems = shOrder.attributes.fulfillments.line_items;
    const allScanned = allItems.every((item) => {
      const scannedItem = scannedItems.find(
        (scanned) => scanned.sku === item.sku
      );
      return scannedItem ? scannedItem.scannedCount >= item.quantity : false;
    });
    setIsCompleted(allScanned);
  }, [scannedItems, shOrder]);

  // Function to check if an item is completed
  const isItemCompleted = (item: any) => item.scannedCount >= item.quantity;

  // Display item lines table
  const renderItemLines = useMemo(() => {
    return (
      <div className="overflow-y-auto max-h-96 bg-slate-100 rounded-sm relative">
        <table className="min-w-full bg-white border border-gray-200 rounded-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-1 text-left text-sm font-medium text-gray-600">
                Image
              </th>
              <th className="p-1 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="p-1 text-left text-sm font-medium text-gray-600">
                Qty
              </th>
              <th className="p-1 text-left text-sm font-medium text-gray-600">
                Scanned
              </th>
              <th className="p-1 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {shOrder.attributes.fulfillments.line_items.map((itemLine) => {
              const scannedItem = scannedItems.find(
                (item) => item.sku === itemLine.sku
              );
              const scannedCount = scannedItem ? scannedItem.scannedCount : 0;
              const isCompleted = isItemCompleted({
                ...itemLine,
                scannedCount,
              });

              return (
                <tr
                  key={itemLine.sku}
                  className={`border-b ${
                    isCompleted ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <td className="p-1">
                    {itemLine.image.src.src ? (
                      <img
                        src={itemLine.image.src.src}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-xs text-gray-700 text-ellipsis">
                    {`${itemLine.name.substring(0, 50)}...`}
                    <br />
                    {itemLine.sku} | {itemLine.barcode}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {itemLine.quantity}
                  </td>
                  <td className="p-3 text-sm text-gray-700">{scannedCount}</td>
                  <td className="p-3 text-sm font-medium text-gray-500">
                    {isCompleted ? "Completed" : "Pending"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="absolute bottom-0 w-full h-4 bg-gradient-to-b from-slate-100 to-white"></div>
      </div>
    );
  }, [shOrder, scannedItems]);
  // if shOrder.attributes.cancelled_status is true, show cancelled, else show packing

  if (shOrder.attributes.cancelled_status) {
    return (
      <div className="mx-auto">
        <div className="mb-3">
          <div className="text-red-500 bg-red-100 p-4 rounded">
            This order has been cancelled.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-3xl mx-auto">
      {!isOrderScanned && (
        <div className="mb-3">
          {shOrder.attributes.cancelled_status ? (
            <div className="text-red-500 bg-red-100">Cancelled</div>
          ) : (
            <div className="text-blue-500 bg-blue-100">Packing</div>
          )}
          <input
            type="text"
            placeholder="Enter barcode"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="border mt-1 p-2 rounded-sm w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2">
            Bấm <span className="bg-white border rounded shadow px-1">F4</span>{" "}
            để focus.
          </div>
        </div>
      )}
      {error && <div className="text-red-500 mt-1">{error}</div>}
      {isOrderScanned && (
        <div className="text-red-500 bg-red-100 p-4 rounded">
          <button
            onClick={() => {
              setIsOrderScanned(false);
              setError(null);
            }}
            className="bg-blue-500 text-white p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Repack
          </button>
        </div>
      )}

      {/* display {renderItemLines} if no error and confirm repack */}
      {!isOrderScanned && renderItemLines}
      <button
        onClick={() => handleComplete()}
        disabled={!isCompleted || isOrderScanned}
        className={`my-2 bg-green-500 text-white p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
          isCompleted ? "" : "opacity-50 cursor-not-allowed"
        }`}
      >
        Complete
      </button>
    </div>
  );
}

export default ScanBarcode;
