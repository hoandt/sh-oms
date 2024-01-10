import { AuthOptions, Awaitable } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const auth: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.BACKEND_URL}/api/auth/local`, {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify({
            identifier: credentials?.username,
            password: credentials?.password,
          }),
        });
        const user = await res.json();

        if (user.user) {
          const res = { ...user.user, jwt: user.jwt };

          return res;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/users/me?populate=role,warehouses,reservations,organization,organization.address_ward,organization.address_province,organization.address_district`,

          {
            method: "GET",
            headers: new Headers({
              "content-type": "application/json",
              Authorization: `Bearer ${u.jwt}`,
            }),
          }
        );
        const userWithRole: any = await res.json();

        return {
          ...token,
          id: u.id,
          jwt: u.jwt,
          userWithRole: {
            ...userWithRole,
          },
        };
      }
      return token;
    },
    session: ({ session, token }): Awaitable<UserSession> => {
      return {
        ...session,
        jwt: token.jwt as string,
        userWithRole: token.userWithRole as UserWithRole,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default auth;
