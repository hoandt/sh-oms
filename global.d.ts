// Use type safe message keys with `next-intl`
type Messages = typeof import("./messages/en.json");
declare interface IntlMessages extends Messages {}
type UserSession = {
  jwt: string;
  userWithRole: UserWithRole;
} & Session;

type ValidRole = {
  roles: string[];
  side: string;
  blocked: boolean;
  confirmed: boolean;
};

type UserWithRole = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  side: string;
  phone: string;
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
};
