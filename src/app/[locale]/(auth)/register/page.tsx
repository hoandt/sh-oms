import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import RegisterForm from "./component/RegisterForm";

export function LoginForm() {
  return (
    <div className="flex justify-center items-center h-screen lg:-ml-60">
      <Card className="mx-auto max-w-lg w-4/6">
        <CardHeader>
          <CardTitle className="text-xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Tạo tài khoản tại hệ thống ghi hình đóng hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
export default LoginForm;
