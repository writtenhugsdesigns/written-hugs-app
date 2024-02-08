import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button,  Box,
  Modal,} from "@mui/material";
import { ArrowBackIos, AddCircleOutline, } from "@mui/icons-material";
import "./ViewCard.css";
import CreateCategoryForCardView from "../CreateCategory/CreateCategoryForCardView";

export default function ViewCard({ handleClose }) {
  const selectedCard = useSelector((store) => store.cardsReducer.selectedCard);
  const [openNewCategory, setOpenNewCategory] = useState(false);
  const handleOpenNewCategory = () => setOpenNewCategory(true);
  const handleCloseNewCategory = () => setOpenNewCategory(false);

    // Style for MUI box in Modal
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "auto",
      display: "block",
      width: "80vw",
      height: "80vh",
      bgcolor: "background.paper",
      'border-radius': '5px'
    };

  const editCardText = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const editCardFiles = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deleteCard = () => {
    console.log("BEGONE THINGY WITH card", selectedCard.id);
  };

  return (
    <div className="modalContainer">
      <Button
        variant="outlined"
        startIcon={<ArrowBackIos />}
        onClick={handleClose}
      >
        Back
      </Button>
      <h1>{selectedCard && selectedCard.name}</h1>
      <p>{selectedCard && selectedCard.description}</p>
      <p>
        Categories:
        {selectedCard && selectedCard.categories_array.map((x) => {
          return <span className="tag">{x.category_name}</span>;
        })}
        <Button onClick={handleOpenNewCategory}>
          <AddCircleOutline />
        </Button>
      </p>
      <div className="imgPageContainer">
        <div className="imgLeft">
          <img className="frontImg" src={selectedCard.front_img.display} />
        </div>
        <div className="imgRight">
          <p>Inner Image:</p>
          <img src={selectedCard && selectedCard.inner_img.display} />
          <p>Insert Image:</p>
          <img src={selectedCard && selectedCard.insert_img.display} />
          <p>Sticker Image:</p>
          <img src={selectedCard && selectedCard.sticker_jpeg.display} />
        </div>
      </div>
      <div>
        <Button variant="outlined" onClick={editCardText}>
          Edit Card Info
        </Button>
        <span> </span>
        <Button variant="outlined" onClick={editCardFiles}>
          Edit Card Files
        </Button>
      </div>
      <br />
      <Button variant="contained" color="error" onClick={deleteCard}>
        Delete Card
      </Button>
      <Modal
        open={openNewCategory}
        onClose={handleCloseNewCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateCategoryForCardView card={selectedCard} handleClose={handleCloseNewCategory} />
        </Box>
      </Modal>
    </div>
  );
}
