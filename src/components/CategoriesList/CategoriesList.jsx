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
  TablePagination,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function CategoriesList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const categories = useSelector((store) => store.categoriesReducer.categories);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_CATEGORIES" });
  }, []);

  return (
    <div className="container">
      {/* MUI table within an MUI paper component */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: "50vw" }} key={"name"}>
                  Category Name
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories &&
                categories.map((x) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={x.id}>
                    <TableCell>{x.name}</TableCell>
                    <TableCell>
                      <Button variant="outlined">Edit</Button>
                      <span> </span>
                      <Button variant="contained" color="error">
                        Delete
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
