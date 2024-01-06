import auth from "@/auth";
import { CommonLayout } from "@/components/common/layout/CommonLayout";
import { getServerSession } from "next-auth";

export default async function IndexPage() {
  const session = await getServerSession(auth);
  return (
    <div>
      <>Dashboard</>
    </div>
  );
}
