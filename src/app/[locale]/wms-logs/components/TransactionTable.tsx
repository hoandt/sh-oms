import { WMSLog } from "@/types/todo";
import React, { useState } from "react";

const TransactionTable = ({ transactions }: { transactions: WMSLog[] }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    // Handle your confirm logic here
    console.log("Transactions confirmed!");
    setConfirmed(true);
  };

  return (
    <div className="min h-[400px] overflow-y-auto py-2">
      {/* Conditionally render the confirm button if transactions length > 1 */}
      {transactions.length > 1 && !confirmed && (
        <div className="flex justify-center align-middle items-center py-4">
          <div className="bg-red-50 text-red-500 px-4 ">
            Đã có {transactions.length} giao dịch đã được thực hiện trước đó.
          </div>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      )}

      {/* Show confirmation message after button is clicked */}
      {confirmed && (
        <div className="text-center text-green-500 font-bold py-4">
          Transactions confirmed!
        </div>
      )}
      {transactions.map((t) => (
        <div key={t.id} className="bg-slate-50 px-2 gap-0 flex w-full">
          <div className="flex justify-between bg-slate-100 border rounded py-4 px-2 w-full">
            <div className="text-sm text-slate-500">
              <div className="text-slate-800 font-bold">
                {t.attributes.transaction}
              </div>
              <div className="text-slate-500">{t.attributes.type}</div>
            </div>
            <div className="text-sm text-slate-500">
              {t.attributes.createdAt
                ? new Date(t.attributes.createdAt).toLocaleString("vi-VN")
                : "Date not available"}
            </div>
            <div className="text-sm text-slate-500">
              Bàn đóng {t.attributes.user}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionTable;
