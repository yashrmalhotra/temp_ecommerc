"use client";
import { OTPProps } from "@/Types/type";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import ThreeDotLoader from "./ThreeDotLoader";
const OTP: React.FC<OTPProps> = ({ email, setVisible, path, timer, resend }) => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<HTMLInputElement[] | null>([]);
  const [combinedOTP, setCombinedOTP] = useState<string>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathName = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (inputRefs.current?.[0]) {
      inputRefs.current[0].focus();
    }
    console.log(pathName);
  }, []);

  useEffect(() => {
    (async () => {
      if (combinedOTP?.length === 4) {
        try {
          setIsLoading(true);
          await axios.post("/api/otp/verifyotp", { email, otp: combinedOTP });
          setError("");
          switch (pathName) {
            case "/seller/signup":
              router.replace("/seller/signin");
              break;
            case "/signup":
              router.replace("/signin");
              break;
            default:
              window.location.reload();
              break;
          }
        } catch (error: any) {
          console.log(error);
          setError(error.response.data.message);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [combinedOTP]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) {
      return;
    }
    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1); // accept only single digit per input
    setOtp(newOTP);

    const combinedOTP = newOTP.join("");
    if (combinedOTP.length === 4) {
      console.log(combinedOTP);
      setCombinedOTP(combinedOTP);
    }
    console.log(combinedOTP);

    //move to next input when previous input filled
    if (value && index < 4 && inputRefs.current?.[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current?.[index].setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current?.[otp.indexOf("")].focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current?.[index - 1].focus();
    }
  };
  const handleClose = () => {
    if (setVisible) setVisible(false);
  };

  return (
    <>
      {isLoading && <ThreeDotLoader />}
      <div className="fixed w-[80%] md:w-[40%] xl:w-[38%] bg-white flex flex-col gap-5  rounded-xl p-5 shadow-[0px_0px_30px]">
        <span className="text-[12px] sm:text-xl text-center text-wrap font-bold">OTP sent to {email}</span>
        <div className="flex gap-2">
          {otp.map((val, i) => (
            <input
              key={i}
              type="text"
              ref={(e) => (inputRefs.current[i] = e)}
              value={val}
              onChange={(e) => handleChange(e, i)}
              onClick={() => handleClick(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="border border-black rounded w-1/4 text-center aspect-[2/1] focus:outline-2  focus:outline-blue-400"
            />
          ))}
        </div>
        {error && (
          <div>
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => resend(email)}
              disabled={timer !== "05:00"}
              className="text-blue-400 hover:underline active:text-blue-500 font-bold disabled:cursor-not-allowed disabled:text-gray-300"
            >
              Resend OTP
            </button>
            {timer !== "05:00" && <span className="text-blue-400 ml-1 font-bold"> in {timer}</span>}
          </div>
          {path === "seller" && (
            <button onClick={handleClose} className="p-2 font-bold  bg-red-400 active:bg-red-500 rounded">
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default OTP;
