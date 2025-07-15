import SignUpForm from "@/app/components/SignUpForm";
import { Metadata } from "next";
import { UserRole } from "@/Types/type";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <section>
        <SignUpForm url={"/seller/signin"} role={UserRole.SELLER} />
      </section>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "GreatMart Seller: Signup",
};
export default page;
