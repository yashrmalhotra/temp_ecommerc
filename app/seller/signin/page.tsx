import SignInForm from "@/app/components/SignInForm";
import { Metadata } from "next";
import { UserRole } from "@/Types/type";
import { Suspense } from "react";
const page = () => {
  return (
    <Suspense>
      <section>
        <SignInForm url="/seller/signup" role={UserRole.SELLER} />
      </section>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "Ecommerce seller signIn",
};
export default page;
