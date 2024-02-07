import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button, Box, Modal,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import ViewCard from "../ViewCard/ViewCard";

export default function PitchCard({ card }) {

  const [addToggle, setAddToggle] = useState(true);
  const [isHoveredID, setIsHoveredID] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();


  const viewCard = (card) => {
    handleOpen();
    dispatch({
      type: "SET_CARD",
      payload: card,
    });
  };

  // Style for MUI box in Modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    display: "block",
    width: "90vw",
    height: "90vh",
    bgcolor: "background.paper",
    'border-radius': '5px'
  };

  /**
   * Toggle the add button depending on if the card is in the cart or not
   * @param {*} e 
   */
  const handleToggle = (e) => {
    e.preventDefault();
    if (addToggle) {
      // Add the card to the cart
      addCardToCart();
    } else {
      // Remove card from cart
      removeCardFromCart();
    }
    setAddToggle(!addToggle);
  }

  const removeCardFromCart = () => {
    dispatch({
      type: "REMOVE_CARD_FROM_CART",
      payload: card,
    });
  };

  const addCardToCart = () => {
    dispatch({
      type: "ADD_CARD_TO_CART",
      payload: card,
    });
  };

  return (
    <>
      <Card
        sx={{
          height: "25em",
          width: "15em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardMedia
          height="20em"
          onMouseOver={() => setIsHoveredID(card.card_id)}
          onMouseOut={() => setIsHoveredID("")}
        >
          {isHoveredID == "" ? (
            <img height={"200"} src={`${card.front_img.display}`} />
          ) : (
            <img height={"200"} src={`${card.inner_img.display}`} />
          )}
        </CardMedia>
        <CardContent>
          <Typography
            sx={{ textAlign: "center" }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {card.name}
          </Typography>
          <Typography
            sx={{ overflowY: "auto", height: "4em" }}
            variant="body2"
            color="text.secondary"
          >
            {card.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            marginTop: "auto",
            marginBottom: "3px",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" size="medium">
            View
          </Button>
          {!isInCart(card) && (
            <Button variant="contained" size="medium" onClick={addCardToCart}>
              Add
            </Button>
          )}
          {isInCart(card) && (
            <Button
              variant="contained"
              color="error"
              onClick={removeCardFromCart}
            >
              Remove
            </Button>
          )}
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ViewCard handleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
}
