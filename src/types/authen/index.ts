import { registerSchema } from "@/app/[locale]/(auth)/register/component/RegisterForm";
import * as z from "zod";

export type RegisterTenant = Omit<
  z.infer<typeof registerSchema>,
  "confirmPassword"
>;
