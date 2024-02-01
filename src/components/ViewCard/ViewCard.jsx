import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { ArrowBackIos, AddCircleOutline } from "@mui/icons-material";
import "./ViewCard.css";

export default function ViewCard({ handleClose }) {
  const selectedCard = useSelector((store) => store.cardsReducer.selectedCard);

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
      <h1>{selectedCard.name}</h1>
      <p>{selectedCard.description}</p>
      <p>
        Categories:
        {selectedCard.categoriesArray.map((x) => {
          return <span className="tag">{x.category_name}</span>;
        })}
        <Button>
          <AddCircleOutline />
        </Button>
      </p>
      <div className="imgPageContainer">
        <div className="imgLeft">
          <img className="frontImg" src={selectedCard.front_img.display} />
        </div>
        <div className="imgRight">
          <p>Inner Image:</p>
          <img src={selectedCard.inner_img.display} />
          <p>Insert Image:</p>
          <img src={selectedCard.insert_img.display} />
          <p>Sticker Image:</p>
          <img src={selectedCard.sticker_jpeg.display} />
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
    </div>
  );
}
