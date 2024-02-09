import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Modal,
  Box
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { smallModalStyle, darkSand, fontStyle17 } from "../../constants/styling";
import Swal from "sweetalert2";
import EditCategory from "../EditCategory/EditCategory";

export default function CategoriesList() {
  const dispatch = useDispatch();
  const categories = useSelector((store) => store.categoriesReducer.categories);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_CATEGORIES" });
  }, []);

  /**
   * When the user clicks the delete button, display a sweet alert confirming category deletion. Then, dispatch to delete
   * the category by id
   * @param {*} category object representing all data for a card category
   */
  const deleteCategory = (category) => {
    Swal.fire({
      title: `Are you sure you want to delete the ${category.name} category?`,
      text: "Doing so will remove the category from any cards. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The category has been deleted.",
          icon: "success"
        });
        dispatch({
          type: 'SAGA/DELETE_CATEGORY',
          payload: category.id
        })
      }
    });
  }

  /**
   * When the user clicks the edit button, set the current category reducer and open the edit modal
   * @param {*} category 
   */
  const editCategory = (category) => {
    dispatch({
      type: 'SET_CURRENT_CATEGORY',
      payload: category
    })
    handleOpen();
  }

  return (
    <div className="container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader='true' aria-label="sticky table">
            <TableHead>
              <TableRow sx={{backgroundColor: darkSand}}>
                <TableCell style={{ minWidth: "50vw", fontFamily: "Open Sans Regular", fontSize: '18px' }}>
                  Category Name
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories &&
                categories.map((x) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={x.id}>
                    <TableCell sx={fontStyle17}>{x.name}</TableCell>
                    <TableCell>
                      <Button onClick = {() => editCategory(x)} variant="outlined">Edit</Button>
                      <span> </span>
                      <Button onClick = {() => deleteCategory(x)} variant="contained" color="error">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={smallModalStyle}>
          <EditCategory handleClose = {handleClose}/>
        </Box>
      </Modal>
    </div>
  );
}
