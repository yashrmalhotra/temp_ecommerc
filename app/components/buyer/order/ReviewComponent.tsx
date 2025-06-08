"use client";
import React, { SetStateAction, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Button, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
const ReviewComponent: React.FC<{ open: boolean; setOpen: React.Dispatch<SetStateAction<boolean>> }> = ({ open, setOpen }) => {
  const [review, setReview] = useState<string>("");
  const [value, setValue] = useState<number | null>(0);
  const [hover, setHover] = useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
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
          <textarea onChange={handleChange} name="" id="" className="border active:border-black active:outline-4 outline-blue-500 outline-offset-8 w-full"></textarea>
        </Box>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#fff", background: "#d52a28", "&:active": { background: "#ef4444" } }} disableRipple>
            Close
          </Button>
          <Button sx={{ color: "#fff", background: "#3b82f6", "&:active": { background: "#60a5fa" } }} disableRipple>
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewComponent;
