import React, { useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Alert,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { darkSand, fontStyle17 } from "../../constants/styling";

export default function CreateCategoryForCard({ handleClose, card }) {
  const categories = useSelector((store) => store.categoriesReducer.categories);
  let [categoryName, setCategoryName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  /**
   * After user hits submit, dispatch POST request for new category. Then, alert success, clear field, and close the modal
   * @param {*} e event
   */
  async function handleSubmit(e) {
    e.preventDefault();
    await dispatch({
      type: "SAGA/POST_CARD_CATEGORY",
      payload: {
        name: categoryName,
        card: card,
      },
    });
    setShowAlert(true);
    setCategoryName("");
    handleClose();
  }

  /**
   * When user hits the Add Category button, submits a POST dispatch to add the category to the card and alerts success
   * @param {*} category 
   */
  const addCategory = (category) => {
    dispatch({
      type: "SAGA/POST_CARD_EXISTING_CATEGORY",
      payload: {
        category: category,
        card: card,
      },
    });
    setShowAlert(true);
  };

  /**
   * Displays categories table
   * @param {*} categories array of all existing categories
   * @param {*} card card object
   * @returns an MUI table with a list of existing categories the user can add to the card that aren't already
   * attached to that card
   */
  const getTable = (categories, card) => {
    for (let i = 0; i < card.categories_array.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (categories[j].id === card.categories_array[i].category_id) {
          categories.splice([j], 1);
        }
      }
    }
    return categories[0] ? (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ backgroundColor: darkSand}}>
                <TableCell style={{ minWidth: "50vw", fontFamily: 'Open Sans Regular', fontSize: '19px' }} key={"name"}>
                  Category Name
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((x) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={x.id}>
                  <TableCell sx={fontStyle17}>{x.name}</TableCell>
                  <TableCell>
                    <Button variant='contained' onClick={() => addCategory(x)}>
                      Add to Card
                    </Button>
                    <span> </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    ) : (
      <></>
    );
  };

  return (
    <div className="modalContainerSmall">
      <div className="smallModalBar">
        <div className="modalBack">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIos />}
            onClick={handleClose}
          >
            Back
          </Button>
        </div>
        <h1>Add Category to Card</h1>
      </div>

      <div className="container">{getTable(categories, card)}</div>

      {showAlert && (
        <Alert severity="success">Category successfully added</Alert>
      )}
      <div className="smallModalForm">
        <form>
          <input
            value={categoryName}
            label="Category Name"
            placeholder="Category Name"
            onChange={(event) => setCategoryName(event.target.value)}
            id="category"
          />
          <Button variant="contained" type="submit" onClick={handleSubmit}>
            Add Category
          </Button>
        </form>
      </div>
    </div>
  );
}
