"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullSignUpFormSchema, EmailOnlySchema, UserForm } from "@/Types/type";
import InputField from "./InputField";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { z } from "zod";
import Link from "next/link";
import OTP from "./OTP";
import "../CSS/Ecommerce.css";
import { formatTimer } from "@/utill/utillityFunctions";
import Loader from "./Loader";
import axios from "axios";
type EmailOnlyData = z.infer<typeof EmailOnlySchema>;
type FullSignUPFormData = z.infer<typeof FullSignUpFormSchema>;
const SignUpForm: React.FC<UserForm> = ({ url, role }) => {
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [passwordFieldVisible, setPasswordFieldVisible] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sec, setSec] = useState<number>(300);
  const [formatedTime, setFormatedTime] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (sec === 0) {
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      setSec(300);
    } else {
      const formated = formatTimer(sec);
      setFormatedTime(formated);
    }
  }, [sec]);
  const {
    register,
    handleSubmit,
    trigger,
    setFocus,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FullSignUPFormData | EmailOnlyData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(isEmailAvailable ? FullSignUpFormSchema : EmailOnlySchema),
  });
  useEffect(() => {
    setFocus("email");
  }, []);
  useEffect(() => {
    if (passwordFieldVisible) {
      setTimeout(() => {
        setFocus("name");
      }, 0);
    }
  }, [passwordFieldVisible]);

  const handleNext = async () => {
    const isValid = await trigger("email");
    if (!isValid) return;
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user/checkuser", { email: getValues("email"), role });
      if (response.data.msg === "Seller" || response.data.msg === "Buyer") {
        setIsSubmitted(true);
        sendOTP(getValues("email"));

        return;
      }

      setError("root", {
        type: "manual",
        message: "",
      });
      setIsEmailAvailable(true);
      setPasswordFieldVisible(true);
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.response.data.message,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const sendOTP = async (email: string) => {
    if (sec === 300 && email) {
      try {
        await axios.post("/api/otp/sendotp", {
          email,
        });
        intervalRef.current = setInterval(() => {
          setSec((prevSec) => prevSec - 1);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
      intervalRef.current = setInterval(() => {
        setSec((prevSec) => prevSec - 1);
      }, 1000);
    }
  };
  const submit = async (data?: any) => {
    const updatedData = {
      ...data,
      role: [role],
    };
    try {
      setIsLoading(true);
      await axios.post("/api/user/createuser", {
        data: updatedData,
      });
      setIsSubmitted(true);
      setIsLoading(false);
      sendOTP(getValues("email"));
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.response.data.message,
      });
      setIsLoading(false);
    }
  };
  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleConfirmPasswordVisible = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  const onSubmit = () => {
    handleSubmit(submit)();
  };
  const handleChange = (e: HTMLInputElement) => {
    setPassword(e.target.value);
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (passwordFieldVisible) {
        handleSubmit(submit)();
      } else {
        e.preventDefault();
        handleNext();
      }
    }
  };
  const resend = async (email?: string) => {
    sendOTP(email!);
  };
  const hasMinLengthError = password.length < 8;
  const hasLetterError = /[a-zA-Z]/.test(password);
  const hasNumberError = /\d/.test(password);
  return (
    <main className="bg-black bg-opacity-40 h-screen flex justify-center items-center">
      {isSubmitted ? (
        <OTP email={getValues("email")} path="signup" timer={formatedTime} resend={resend} />
      ) : (
        <div className="w-[80%]  md:w-[40%] xl:w-1/4 bg-white flex flex-col gap-5  rounded-xl p-5 shadow-[0px_0px_30px]">
          <h1 className="text-xl text-center font-bold">Sign up</h1>
          <form onKeyDown={handleKeyDown} className="flex flex-col gap-5">
            <InputField
              labelText="Email"
              mendatory="*"
              placeholder="eg: xyz@email.com"
              register={register("email")}
              error={errors.email?.message}
              disabled={passwordFieldVisible}
            />
            {passwordFieldVisible && <InputField labelText="Name" mendatory="*" placeholder="eg: John" register={register("name")} error={errors.name?.message} />}
            {passwordFieldVisible && (
              <div className={`flex flex-col`}>
                <label className="font-semibold">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="w-full relative border flex justify-between password-input-container  border-black">
                  <input
                    type={`${passwordVisible ? "text" : "password"}`}
                    {...register("password")}
                    placeholder="eg: abcd1234"
                    onChange={handleChange}
                    className="p-2 h-10 focus:outline-none"
                    autoComplete="off"
                  />

                  <button type="button" onClick={handlePasswordVisible} className="p-1">
                    {passwordVisible ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
                  </button>
                </div>
              </div>
            )}

            {passwordFieldVisible && (
              <div className={`flex flex-col`}>
                <label className="font-semibold">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="w-full relative border flex justify-between password-input-container  border-black">
                  <input
                    type={`${confirmPasswordVisible ? "text" : "password"}`}
                    {...register("confirmPassword")}
                    placeholder="eg: abcd1234"
                    className="p-2 h-10 focus:outline-none"
                    autoComplete="off"
                  />
                  <button type="button" onClick={handleConfirmPasswordVisible} className="p-1">
                    {confirmPasswordVisible ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
                  </button>
                </div>
                {errors?.confirmPassword && <p className="text-red-500 font-bold">{errors?.confirmPassword?.message}</p>}
              </div>
            )}
            {!passwordFieldVisible ? (
              <button
                type="button"
                disabled={isLoading}
                className="bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-md flex justify-center p-2 w-full text-white text-xl"
                onClick={handleNext}
              >
                {isLoading ? <Loader width="w-5" height="h-5" /> : <p>Next</p>}
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                className="bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-md flex justify-center p-2 w-full text-white text-xl"
                onClick={onSubmit}
              >
                {isLoading ? <Loader width="w-5" height="h-5" /> : <p>Sign Up</p>}
              </button>
            )}
          </form>
          {errors.root && <p className="text-red-500 font-bold">{errors?.root?.message}</p>}
          {passwordFieldVisible && (
            <ul>
              <li className={`text-sm ${hasMinLengthError ? "text-red-500" : "text-green-500"}`}>{hasMinLengthError ? "❌" : "✔️"} Password must contains atleast 8 characters</li>
              <li className={`text-sm ${!hasLetterError ? "text-red-500" : "text-green-500"}`}>{!hasLetterError ? "❌" : "✔️"} Must contain atleast one letter</li>
              <li className={`text-sm ${!hasNumberError ? "text-red-500" : "text-green-500"}`}>{!hasNumberError ? "❌" : "✔️"} Must contain atleast one number</li>
            </ul>
          )}
          <div className="self-center flex flex-col sm:flex-row sm:gap-2">
            <p>Already have an account</p>
            <div>
              <Link className="text-blue-500" href={url}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SignUpForm;
