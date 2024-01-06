import { NextResponse, NextRequest } from "next/server";
import { fetchData, standardizeBackendResponse } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { adminHeadersList, BACKEND_ENDPOINT } from "@/lib/constants";
import auth from "@/auth";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?endpoint=", "");

  //validate api ->
  // const session =
  //   ((await getServerSession(
  //     req as unknown as NextApiRequest,
  //     {
  //       ...res,
  //       getHeader: (name: string) => res.headers?.get(name),
  //       setHeader: (name: string, value: string) =>
  //         res.headers?.set(name, value)
  //     } as unknown as NextApiResponse,
  //     auth
  //   )) as UserSession) || null;

  //   console.log({session})

  // const currentUser = session.userWithRole;

  // if (!currentUser) {
  //   redirect("/");
  // }

  let response = await fetchData<BackendDataResponse>(
    `${BACKEND_ENDPOINT}${path}`,
    {
      method: "GET",
      headers: adminHeadersList
    }
  );

  console.log({response: `${BACKEND_ENDPOINT}${path}`})
  return NextResponse.json(standardizeBackendResponse(response));
}
