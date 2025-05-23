import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // isVerified: boolean;
      // role: string[];
    } & DefaultSession["user"];
  }
  //   interface JWT {
  //     name: string;
  //     isVerified: boolean;
  //     role: string[];
  //   }
  //   interface User extends DefaultUser {
  //     name: string;
  //     isVerified: boolean;
  //     role: string[];
  //   }
}
