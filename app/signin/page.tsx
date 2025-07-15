import SignInForm from "@/app/components/SignInForm";
import { UserRole } from "@/Types/type";
import { Metadata } from "next";
import { Suspense } from "react";
const page = () => {
  return (
    <Suspense>
      <section>
        <SignInForm url="/signup" role={UserRole.BUYER} />
      </section>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "GreatMart: SignIn",
};
export default page;
