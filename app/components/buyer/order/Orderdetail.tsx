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
import { useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";

let steps: any = { Pending: 0, Ordered: 2, Shipped: 3, Delivered: 4 };
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
  const [payNowLoading, setPayNowLoading] = useState<boolean>(false);

  const [order, setOrder] = useState<any>({});
  const imageUrl = order?.product?.images?.[0]?.url ?? null;
  const [open, setOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/order/${oid}`);
        setOrder(data.order.order);
        setReviewRating(data.order.order.review);
        if (data.order.order.status === "Ordered" || data.order.order.status === "Shipped" || data.order.order.status === "Delivered") {
          steps = { Ordered: 1, Shipped: 2, Delivered: 3 };
        }
        if (data.order.order.status === "Returned" || data.order.order.status === "Return Aproved" || data.order.order.status === "Refunded") {
          steps = { Returned: 1, "Return Aproved": 2, Refunded: 3 };
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userDetails, oid]);

  const handleOrderCancel = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/order/${oid}`);
      router.replace("/order");
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/return`, { oid });
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReturnCancel = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/return`, { data: { oid } });
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  const initializeSDK = async (sessionId: string) => {
    try {
      const cashfree = await load({
        mode: "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree
        .checkout(checkoutOptions)
        .then(() => {})
        .catch((error: any) => {
          console.error("Cashfree checkout failed:", error); // Log the actual error
        });
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };
  const handlePayNow = async () => {
    try {
      setPayNowLoading(true);
      const { data } = await axios.post("/api/order/retrypayment", { oid: order?.oid });
      await initializeSDK(data.session);
    } finally {
      setPayNowLoading(false);
    }
  };
  const isSevenDayOlder = () => {
    const sevenDaysInMs = 7 * 1000 * 3600 * 24;
    const sevenDaysOlder = Date.now() - order?.deliveredAt > sevenDaysInMs;

    return sevenDaysOlder;
  };
  return (
    <>
      <Header />
      {isLoading ? (
        <ThreeDotLoader />
      ) : order ? (
        <>
          <section className="mt-20">
            {payNowLoading && <ThreeDotLoader />}
            <div className="w-[80%] flex flex-col justify-center md:flex-row gap-3 mx-auto mt-4">
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
                    {order?.product?.basicInfo?.title}
                  </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-5 flex-wrap">
                  {order.status === "Delivered" ||
                    order.status === "Returned" ||
                    order.status === "Return Approved" ||
                    (order.status === "Refunded" && (
                      <button onClick={() => setOpen(true)} className="bg-blue-300 active:bg-blue-400 rounded-xl px-5 py-2 text-white font-bold">
                        Write a review
                      </button>
                    ))}
                  <div className="border rounded-xl px-5 py-2">Order id:{order.oid}</div>
                  <div className="border rounded-xl px-5 py-2">Ordered on:{new Date(order.createdAt).toLocaleDateString("en-GB")}</div>
                  {order.status === "Delivered" && !isSevenDayOlder() && (
                    <button onClick={handleReturn} className="bg-gray-300 active:bg-gray-400 rounded-xl px-5 py-2 font-bold">
                      Return
                    </button>
                  )}
                  {order.status === "Returned" && order.status !== "Return Approved" && order.status !== "Refunded" && (
                    <button onClick={handleReturnCancel} className="bg-gray-300 active:bg-gray-400 rounded-xl px-5 py-2 font-bold">
                      Cancel Return
                    </button>
                  )}
                  {order.status === "Pending" && (
                    <button onClick={handlePayNow} className="bg-blue-400 active:bg-blue-500 rounded-xl px-5 py-2 font-bold">
                      Pay now
                    </button>
                  )}

                  {order.status !== "Delivered" && order.status !== "Returned" && order.status !== "Return Approved" && order.status !== "Refunded" && (
                    <button onClick={handleOrderCancel} className=" text-red-300 active:bg-gray-200 border  rounded-xl px-5 py-2 font-bold">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            <ReviewComponent
              open={open}
              setOpen={setOpen}
              existingRating={reviewRating?.rating}
              existingReview={reviewRating?.review}
              pid={order?.product?.pid}
              oid={oid as string}
            />
          </section>

          <section className="w-[80%] mx-auto pb-20 h-[70vh]">
            <div>
              <h3 className="font-bold text-2xl">Order Tracking</h3>
            </div>
            <Box>
              <Stepper activeStep={steps[order.status]} orientation="vertical" connector={<OrderTrackerConnector />}>
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
