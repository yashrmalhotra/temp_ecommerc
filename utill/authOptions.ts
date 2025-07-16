import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDataBase } from "./connectDB";
import User from "@/models/User";
import bcrypt from "bcrypt";
import type { Account, User as NextUserType, Profile } from "next-auth";
import { cookies } from "next/headers";
import { getUserId } from "./utillityFunctions";
interface NextAuthUserSignIn {
  user: NextUserType;
  account: Account;
  profile: Profile;
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        await connectToDataBase();
        const { email, password, loginType } = credentials as any;
        const user = await User.findOne({ email });
        if (!user) {
          return null;
        }
        if (user.googleId) {
          throw new Error("you are already signed up by google, use google to sign in");
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) {
          if (loginType === "seller")
            if (user.role.includes("seller")) {
              return {
                id: user._id,
                email: user.email,
              };
            } else {
              throw new Error("You are not register as a seller");
            }
          else {
            if (user.role.includes("buyer")) {
              return {
                id: user._id,
                email: user.email,
              };
            } else {
              throw new Error("You are not register as a buyer");
            }
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: NextAuthUserSignIn) {
      const cookiesStore = await cookies();
      const loginType = cookiesStore.get("loginType");
      if (!user || !user.email) {
        return false;
      }

      await connectToDataBase();
      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser && !existingUser.isVerified) {
          existingUser.isVerified = true;
        }
        if (existingUser && !existingUser.googleId) {
          existingUser.googleId = account.providerAccountId;
          if (loginType?.value === "buyer" && !existingUser.role.includes("buyer")) {
            existingUser.role.push("buyer");
          } else if (loginType?.value === "seller" && !existingUser.role.includes("seller")) {
            existingUser.role.push("seller");
          }
          await existingUser.save();

          return true;
        } else if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            role: [loginType?.value],
            isVerified: true,
            uid: getUserId(user.email),
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
