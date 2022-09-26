import React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function Modal({open, SetDialogTexxt,handleClose,sendAnswer }) {
  function handleChange(event) {
    SetDialogTexxt(event.target.value);
  }
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>Enter good answer for this user:-</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          type="text"
          fullWidth
          variant="standard"
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            sendAnswer();
            handleClose();
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Modal;
