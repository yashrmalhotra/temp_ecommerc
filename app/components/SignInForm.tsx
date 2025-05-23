"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema, UserForm } from "@/Types/type";
import InputField from "./InputField";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { z } from "zod";
import Link from "next/link";
import "../CSS/Ecommerce.css";
import { signIn } from "next-auth/react";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import GoogleSignIn from "./GoogleSignIn";
type SignInFormData = z.infer<typeof SignInFormSchema>;

const SignInForm: React.FC<UserForm> = ({ url, role }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInFormSchema),
  });
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);
  const submit = async (data?: any) => {
    setIsLoading(true);
    console.log(role);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      loginType: role,
      redirect: false,
      // ,
    });

    if (res?.error) {
      if (res?.error === "CredentialsSignin") {
        setError("root", {
          type: "Manual",
          message: "Email or password is wrong",
        });
        setIsLoading(false);
      } else {
        setError("root", {
          type: "Manual",
          message: res.error,
        });
        setIsLoading(false);
      }
      return;
    }
    if (role === "buyer") {
      router.replace("/");
      setIsLoading(false);
    } else {
      router.replace("/seller/dashboard");
      setIsLoading(false);
    }
  };
  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };
  const onSubmit = () => {
    handleSubmit(submit)();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(submit)();
    }
  };

  return (
    <main className="bg-black bg-opacity-40 h-screen flex justify-center items-center">
      <div className="w-[80%] md:w-[40%] xl:w-1/4 bg-white flex flex-col gap-5 justify-center  rounded-xl p-5 shadow-[0px_0px 10px]">
        <h1 className="text-xl text-center font-bold">Sign in</h1>
        <form onKeyDown={handleKeyDown} className="flex flex-col gap-5">
          <InputField labelText="Email" mendatory="*" placeholder="eg: xyz@email.com" register={register("email")} error={errors.email?.message} />

          <div className={`flex flex-col`}>
            <label className="font-semibold">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="w-full relative border flex justify-between password-input-container  border-black">
              <input type={`${passwordVisible ? "text" : "password"}`} {...register("password")} placeholder="password" className="p-2 h-10 focus:outline-none" />
              <button type="button" onClick={handlePasswordVisible} className="p-1">
                {passwordVisible ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
              </button>
            </div>
            {errors?.password && <p className="text-red-500 font-bold">{errors?.password?.message}</p>}
          </div>

          <button
            disabled={isLoading}
            type="button"
            className={`bg-blue-400 rounded-md p-2 w-full flex ${isLoading && "cursor-not-allowed"} justify-center text-white text-xl`}
            onClick={onSubmit}
          >
            {isLoading ? <Loader width="w-5" height="h-5" /> : <span>Sign In</span>}
          </button>
          {errors?.root && (
            <div>
              <p className="text-red-500 font-bold">{errors?.root?.message}</p>
            </div>
          )}
        </form>
        <div className="flex items-center w-full my-1">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <div>
          <GoogleSignIn role={role} setIsLoading={setIsLoading} />
        </div>
        <div className="self-center">
          <p>
            Doesn't have an Account &nbsp;
            <Link className="text-blue-500" href={url}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInForm;
