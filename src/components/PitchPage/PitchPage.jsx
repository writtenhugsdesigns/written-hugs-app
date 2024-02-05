import PitchList from "../PitchList/PitchList";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { AddCircleOutline, Create } from "@mui/icons-material";
import CreatePitchPage from "../CreatePitchPage/CreatePitchPage";

export default function PitchPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const style = {
    position: "absolute",
    overflow: "scroll",
    display: "block",
    width: "100%",
    height: "100%",
    bgcolor: "background.paper",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
  }, []);

  return (
    <>
      <div className="container">
        <div className="wholesalerBar">
          <h1>Pitches</h1>
          <button className="pageButton" onClick={handleOpen}>
            <AddCircleOutline />
            Add Pitch
          </button>
        </div>

        <PitchList />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreatePitchPage handleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
}
