import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RegisterForm from "./component/RegisterForm";

export default function LoginForm() {
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
