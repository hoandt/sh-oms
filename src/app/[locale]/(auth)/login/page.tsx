"use client";
import Logo from "@/components/Logo";
import { EyeIcon, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const session = useSession();
  // If session exists, redirect to home
  if (session && session.data) {
    router.push("/");
    return null;
  }
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); // Clear any previous errors

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    signIn("credentials", {
      username,
      password,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        setError(result.error);
      } else {
        // Refresh page to get session
        router.refresh();
      }
    });
  }

  return (
    <div className="flex justify-center items-center h-screen lg:-ml-60">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
        <div className="w-full   bg-white rounded shadow-lg">
          {/* red annoucemnt that the server is upgrading... Đang nâng cấp server trong ngày 12/09/2024. Chúng tôi sẽ thông báo khi hoàn thành */}

          <p className="bg-yellow-50 text-yellow-700 font-bold p-4">
            Kính gửi quý khách hàng, <br /> <br />
            Vào ngày 12/09/2024, chúng tôi sẽ tiến hành nâng cấp hệ thống máy
            chủ, dự kiến sẽ hoàn tất trước 21:00:00. <br /> Chúng tôi sẽ thông
            báo ngay khi việc nâng cấp hoàn tất sớm hơn dự kiến.
            <br /> <br />
            Chúng tôi xin chân thành cảm ơn sự thông cảm và xin lỗi vì sự bất
            tiện này.
          </p>
        </div>
        <div className="text-center  ">
          {/* <Link href="/" aria-label="Home">
            <Logo />
          </Link> */}
        </div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900 text-center">
          Đăng nhập tài khoản
        </h2>
        <p className="mt-2 text-sm text-gray-700 text-center">
          Chưa có?{" "}
          <Link
            href="/register"
            className="font-medium text-orange-600 hover:underline"
          >
            Đăng ký ngay
          </Link>{" "}
          dùng thử miễn phí!
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className=" mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-2 py-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
