"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useParams } from "next/navigation";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import Image from "next/image";
import ThreeDotLoader from "../../ThreeDotLoader";
import Link from "next/link";
import MobileNav from "../MobileNav";
import ReviewComponent from "./ReviewComponent";
import { Box, Step, StepLabel, Stepper, StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
const steps = { Ordered: 1, Shipped: 2, "In Transist": 3, Delivered: 4 };
const styledFunction = (props: any) => {
  const theme = props.theme;
  return {
    [`&.${stepConnectorClasses.vertical}`]: {
      marginLeft: 10,
    },
    [`&.${stepConnectorClasses.line}`]: {
      minHeight: 30,
      borderLeftWidth: 3,
      borderColor: theme.palette.grey[400],
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
      borderColor: "green",
    },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
      borderColor: "green",
    },
  };
};

export const OrderTrackerConnector = styled(StepConnector)(styledFunction);

const Orderdetail = () => {
  const { oid } = useParams();
  const { userDetails } = useUserDetails()!;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<any>({});
  const imageUrl = order?.images?.[0]?.url ?? null;
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/order/${oid}`);
        setOrder(data.order);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userDetails, oid]);
  return (
    <>
      <Header />
      {isLoading ? (
        <ThreeDotLoader />
      ) : order ? (
        <>
          <section className="mt-20">
            <div className="w-[80%] flex flex-col md:flex-row gap-3 mx-auto mt-4">
              <div className="border rounded p-5">
                <Image src={imageUrl} alt="product img" width={250} height={250} />
              </div>
              <div>
                <div>
                  <Link
                    href={{ pathname: "/search", query: { q: order?.basicInfo?.brandName } }}
                    className="font-semibold text-ellipsis line-clamp-2 md:line-clamp-none text-blue-400 visited:text-purple-400 hover:underline"
                  >
                    {order?.basicInfo?.brandName}
                  </Link>
                </div>
                <div>
                  <Link href={`/${order?.pid}`} className="text-ellipsis overflow-hidden line-clamp-3">
                    {order?.basicInfo?.title}
                  </Link>
                </div>
                <div className="flex gap-5">
                  <button onClick={() => setOpen(true)} className="bg-blue-300 active:bg-blue-400 rounded-xl px-5 py-2 text-white font-bold">
                    Write a review
                  </button>
                  <div className="border rounded-xl px-5 py-2">Ordered on:</div>
                  {true && (
                    <button onClick={() => setOpen(true)} className="bg-gray-300 active:bg-gray-400 rounded-xl px-5 py-2 font-bold">
                      Return
                    </button>
                  )}
                </div>
              </div>
            </div>

            <ReviewComponent open={open} setOpen={setOpen} />
          </section>

          <section className="w-[80%] mx-auto pb-20 h-[70vh]">
            <div>
              <h3 className="font-bold text-2xl">Order Tracking</h3>
            </div>
            <Box>
              <Stepper activeStep={steps["Shipped"]} orientation="vertical" connector={<OrderTrackerConnector />}>
                {Object.keys(steps).map((item, i) => (
                  <Step key={i}>
                    <StepLabel
                      slotProps={{
                        stepIcon: {
                          sx: {
                            "&.Mui-completed": {
                              color: "green", // Change completed icon color
                            },
                            "&.Mui-active": {
                              color: "blue", // Optional: Change active icon color
                            },
                          },
                        },
                      }}
                      sx={{
                        "&.Mui-completed .MuiStepLabel-label": {
                          color: "green",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      {item}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </section>
        </>
      ) : (
        <div className="w-full h-[calc(100vh-3.75rem)] flex justify-center items-center">No order found</div>
      )}
      <MobileNav />
    </>
  );
};

export default Orderdetail;
