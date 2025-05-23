import SignUpForm from "@/app/components/SignUpForm";
import { Metadata } from "next";
import { UserRole } from "@/Types/type";
import { Suspense } from "react";
const page = () => {
  return (
    <Suspense>
      <SignUpForm url="/signin" role={UserRole.BUYER} />
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "Ecommerce signIn",
};
export default page;
