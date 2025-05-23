"use client";
import React, { useEffect, useRef, useState } from "react";
import { useUserDetails } from "../context/UserDetailsProvider";
import OTP from "./OTP";
import { formatTimer } from "@/utill/utillityFunctions";
import axios from "axios";
const NotVerifiedAlert: React.FC<{ path: string }> = ({ path }) => {
  const context = useUserDetails();
  const [otpVisible, setOtpVisible] = useState<boolean>(false);
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
  const handleOTPVisible = async () => {
    setOtpVisible(true);
    if (sec === 300 && context?.userDetails) {
      try {
        await axios.post(`/api/otp/sendotp`, {
          email: context?.userDetails?.email,
        });
        intervalRef.current = setInterval(() => {
          setSec((prevSec) => prevSec - 1);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (context?.userDetails && !context?.userDetails.isVerified) {
    return (
      <div className="bg-red-300 w-full text-center text-xl">
        <span className=" text-white font-bold">⚠ You are not verified</span>
        <button onClick={handleOTPVisible} className="text-blue-400 underline ml-3 font-bold">
          Send OTP
        </button>

        {otpVisible && context?.userDetails?.email && (
          <div className="fixed w-full min-h-screen bg-black bg-opacity-40 flex justify-center items-center z-30">
            <OTP email={context?.userDetails?.email} setVisible={setOtpVisible} path={path} timer={formatedTime} resend={handleOTPVisible} />;
          </div>
        )}
      </div>
    );
  }
};

export default NotVerifiedAlert;
