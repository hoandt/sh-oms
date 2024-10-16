import auth from "@/auth";
import Dashboard from "@/components/common/custom/Dashboard";
import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const session = (await getServerSession(auth)) as any;

  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      {/* display me 2 cards, show PACKING and VIEW actions */}
      <div className="flex px-4 w-full py-4 gap-4">
        <div className="w-full  ">
          <Dashboard session={session} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold my-4  text-slate-600">
            Actions
          </h1>
          <Card className="w-full  p-6 hover:bg-slate-50">
            <a href="/wms-logs" className="   rounded-lg p-4">
              <div className="flex flex-row items-center">
                <div className="flex-1 text-center">
                  <h5 className="font-bold uppercase text-gray-700">
                    Đóng hàng
                  </h5>
                </div>
              </div>
            </a>
          </Card>
          <Card className="w-full  p-6 hover:bg-slate-50">
            <a href="/wms-logs/outbound" className="   rounded-lg p-4">
              <div className="flex flex-row items-center">
                <div className="flex-1 text-center">
                  <h5 className="font-bold uppercase text-gray-700">
                    Ghi nhận bàn giao
                  </h5>
                  <p className="text-gray-500 text-sm">
                    Ghi nhận thời gian bàn giao với shipper (có cảnh báo nếu đã
                    bàn giao)
                  </p>
                </div>
              </div>
            </a>
          </Card>
          <Card className="w-full  p-6 hover:bg-slate-50">
            <a href="/history" className="   rounded-lg p-4">
              <div className="flex flex-row items-center">
                <div className="flex-1 text-center">
                  <h5 className="font-bold uppercase text-gray-700">
                    Xem lịch sử
                  </h5>
                </div>
              </div>
            </a>
          </Card>
        </div>
      </div>
    </>
  );
}
