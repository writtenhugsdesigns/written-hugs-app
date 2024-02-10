import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button, Box, Modal,
  Typography,
  Alert
} from "@mui/material";
import {largeModalStyle, cardStyle} from "../../constants/styling.js";
import ViewCard from "../ViewCard/ViewCard";

export default function PitchCard({ card, isInCart }) {
  const [isHoveredID, setIsHoveredID] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  const viewCard = () => {
    dispatch({
      type: "SET_EDIT",
      payload: card
    });
    handleOpen();
  };

  const removeCardFromCart = () => {
    dispatch({
      type: "REMOVE_CARD_FROM_EDIT",
      payload: card,
    });
  };

  const addCardToCart = () => {
    dispatch({
      type: "ADD_CARD_TO_EDIT",
      payload: card,
    });
  };

  return (
    <>
      <Card sx={cardStyle}>
        {isInCart(card) && <Alert>Added!</Alert>}
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
          <Button variant="outlined" size="medium" onClick={viewCard}>
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
        <Box sx={largeModalStyle}>
          <ViewCard handleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
}