import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";

export default function ReviewPitch() {
  let [description, setDescription] = useState("");
  let [name, setName] = useState("");
  let [wholesaler_id, setWholesaler_id] = useState("");
  const cart = useSelector((store) => store.cartReducer.cart);
  const wholesalers = useSelector(
    (store) => store.wholesalersReducer.wholesalers
  );
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "SAGA/FETCH_WHOLESALERS",
    });
  }, []);

  // When user clicks the create pitch button, POST new pitch, then redirect user to view the pitch
  const handleCreate = () => {
    dispatch({
      type: "SAGA/POST_PITCH",
      payload: {
        pitchName: name,
        pitchDescription: description,
        wholesaler_id: wholesaler_id,
        newPitch: cart,
      },
    });
    dispatch({
      type: "CLEAR_CART"
    });
    history.push("/pitches");
  };
  
  const removeButton = (card) => {
    dispatch({
      type: "REMOVE_CARD_FROM_CART",
      payload: card,
    });
  };

  return (
    <div className="container">
      Review Pitch
      <input
        value={name}
        label="Pitch Name"
        placeholder="Pitch Name"
        onChange={(event) => setName(event.target.value)}
        id="pitchName"
      />
      <input
        value={description}
        label="Pitch Description"
        placeholder="Pitch Description"
        onChange={(event) => setDescription(event.target.value)}
        id="pitchDescription"
      />
      <select
        name="type"
        onChange={(e) => setWholesaler_id(e.target.value)}
        required="required"
        defaultValue=""
      >
        <option value="" disabled="disabled">
          Choose a wholesaler
        </option>
        {wholesalers.map((wholesaler) => {
          return (
            <option key={wholesaler.id} value={wholesaler.id}>
              {wholesaler.company_name}
            </option>
          );
        })}
      </select>
      <button onClick={() => history.goBack()}>Back</button>
      <button onClick={handleCreate}>Create</button>
      {/* MUI table within an MUI paper component */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eeebe5" }}>
                <TableCell>Card Name</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart &&
                cart.map((card) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={card.id}>
                    <TableCell>{card.name}</TableCell>
                    <TableCell>
                      {card.categories_array.map((category) => (
                        <span className="tag">{category.category_name}</span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeButton(card)}
                        variant="contained"
                        color="error"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
