import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Alert
} from "@mui/material";
import { useDispatch } from "react-redux";

export default function PitchCard({ card, isInCart }) {
  const [isHoveredID, setIsHoveredID] = useState("");
  const dispatch = useDispatch();

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
    <Card
      sx={{
        height: "27em",
        width: "15em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isInCart(card) && <Alert severity='success'>Added!</Alert>}
      <CardMedia
        height="20em"
        onMouseOver={() => setIsHoveredID(card.card_id)}
        onMouseOut={() => setIsHoveredID("")}
        >
        {isHoveredID == "" ? (
          <img height={"200"} width={'auto'} src={`${card.front_img.display}`} />
        ) : (
          <img height={"200"} width={'auto'} src={`${card.inner_img.display}`} />
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
          sx={{ overflowY: "auto", height: "3em" }}
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
  );
}