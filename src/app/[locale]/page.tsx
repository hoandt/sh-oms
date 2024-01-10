import auth from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const session = await getServerSession(auth);

  if (!session) {
    return redirect("/login");
  }
  return <>Dashboard</>;
}
