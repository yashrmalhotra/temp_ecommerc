"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Button, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Loader from "../../Loader";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
const ReviewComponent: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  existingReview: string | undefined;
  existingRating: number | undefined;
  pid: string;
  oid: string;
}> = ({ open, setOpen, existingReview, existingRating, pid, oid }) => {
  const [review, setReview] = useState<string>("");
  const [value, setValue] = useState<number | null>(0);
  const [hover, setHover] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userDetails } = useUserDetails()!;

  useEffect(() => {
    if (existingReview) {
      setReview(existingReview);
    }
    if (existingRating) {
      setValue(existingRating);
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/review", { oid, uid: userDetails?.uid, pid, rating: value, review, name: userDetails?.name });
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            marginInline: "auto",
          },
        },
      }}
    >
      <DialogTitle sx={{ padding: "7px" }}>Write a review</DialogTitle>
      <DialogContent sx={{ padding: "7px" }}>
        Ratings
        <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
          <Rating
            name="hover-feedback"
            value={value}
            precision={1}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </Box>
      </DialogContent>
      <DialogContent sx={{ padding: "7px" }}>
        <Box sx={{ padding: "7px" }}>
          <textarea
            onChange={handleChange}
            value={review}
            name=""
            id=""
            className="border active:border-black active:outline-4 outline-blue-500 outline-offset-8 w-full"
          ></textarea>
        </Box>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#fff", background: "#d52a28", "&:active": { background: "#ef4444" } }} disableRipple>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={value === 0}
            sx={{ color: "#fff", background: "#3b82f6", "&:active": { background: "#60a5fa" }, "&:disabled": { background: "#9ca3af" } }}
            disableRipple
          >
            {isLoading ? <Loader width="w-5" height="h-5" /> : <span>Submit</span>}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewComponent;
