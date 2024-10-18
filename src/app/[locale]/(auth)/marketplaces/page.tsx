"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [people, setPeople] = useState<any>([]);
  //check current user with next auth session
  const { data } = useSession() as any;
  useEffect(() => {
    if (data && data.userWithRole.organization.id === 1) {
      //fetch data from api
      setPeople([
        {
          name: "TikTok Shop",
          title: "TikTok",
          email: "03/10/2024 12:03:17",
        },
        {
          name: "SANDBOX_SHOPVN2314000",
          title: "Shopee",
          email: "10/19/2025 12:03:17",
        },
      ]);
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-2">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Marketplaces
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all connected marketplaces.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            className="block rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Add a Marketplace
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0 p-4 bg-slate-50 rounded">
        <table className="min-w-full divide-y divide-gray-300 ">
          <thead>
            <tr className="px-2">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Platform
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Expired at
              </th>

              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {people ? (
              people.map((person: any) => (
                <tr key={person.email}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {person.name}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Title</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {person.title}
                      </dd>
                      <dt className="sr-only sm:hidden">Email</dt>
                      <dd className="mt-1 truncate text-gray-500 sm:hidden">
                        {person.email}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {person.title}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {person.email}
                  </td>

                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <a
                      href="#"
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Disconnected{" "}
                      <span className="sr-only">, {person.name}</span>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>"No data"</tr>
            )}
          </tbody>
        </table>
        <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
          <DialogContent className="max-w-2xl mx-auto min-h-[500px] -ml-12">
            <div className=" ">
              {/* name of platform and connected button */}
              <div className="flex items-center mt-4">
                <h2 className="text-lg font-semibold leading-6 text-gray-700">
                  Connect a Marketplace
                </h2>
                <span className="ml-2 text-sm text-gray-500">
                  Connect your marketplace to SwiftHub
                </span>
              </div>
              <table className="min-w-full divide-y divide-gray-300 mt-4">
                {/* name of platform and connect button */}
                <thead>
                  <tr className="px-2">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white p-2">
                  <td className="px-2">TikTok Shop</td>
                  <td className="px-2 pt-2">
                    {" "}
                    <Button
                      size={"sm"}
                      onClick={() => {
                        // open link new tab
                        window.open(
                          "https://services.tiktokshop.com/open/authorize?app_key=69pm0ou7os51c",
                          "_blank"
                        );
                      }}
                    >
                      Connect
                    </Button>
                  </td>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
