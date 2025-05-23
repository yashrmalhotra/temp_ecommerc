import React, { ReactElement, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import { DeleteConfirmProps } from "@/Types/type";
import axios from "axios";
import ThreeDotLoader from "../ThreeDotLoader";

const ConfirmDialogue: React.FC<DeleteConfirmProps> = ({ deleteConfirmOpen, setDeleteConfirmOpen, address, email }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/user/address", {
        data: {
          email,
          buyerAddress: address,
        },
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <ThreeDotLoader />}
      <Dialog onClose={handleDeleteConfirmClose} open={deleteConfirmOpen} sx={{ zIndex: 40 }}>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure do you want to delete address </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} autoFocus disableRipple sx={{ bgcolor: "#1d4ed8", color: "white", "&:active": { bgcolor: "#3b82f6 " } }}>
            Close
          </Button>
          <Button onClick={handleDelete} disableRipple autoFocus sx={{ bgcolor: "#ef4444", color: "white", "&:active": { bgcolor: "#b91c1c" } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialogue;
