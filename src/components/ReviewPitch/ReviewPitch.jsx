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
    TablePagination,
    Modal,
    Box
  } from "@mui/material";

export default function ReviewPitch(){
    const newPitch = useSelector(store => store.pitches.newPitch);
    const history = useHistory();
    const dispatch = useDispatch();


    // When user clicks the create pitch button, POST new pitch, then redirect user to view the pitch
    const handleCreate = () => {
        console.log("Will do something eventually");
        dispatch({
            type: "SAGA/POST_PITCH",
            payload: newPitch
        })
    }
    const removeButton = (card) => {
        dispatch({
            type: 'REMOVE_CARD_FROM_PITCH',
            payload: card
        })
    }
    
    return (
        <div className = 'container'>
            Review Pitch
            <button onClick = {() => history.push("/")}>Back</button>
            <button onClick = {handleCreate}>Create</button>
              {/* MUI table within an MUI paper component */}
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer>
                  <Table stickyheader aria-label="sticky table">
                    <TableHead>
                      <TableRow sx={{backgroundColor: '#eeebe5'}}>
                        <TableCell>Card Name</TableCell>
                        <TableCell>Categories</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newPitch &&
                        newPitch.map((card) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={card.id}>
                            <TableCell>{card.name}</TableCell>
                            <TableCell>{card.categories_array.map((category) => (<span className='tag'>{category.category_name}</span>))}</TableCell>
                            <TableCell>
                              <Button onClick = {() => removeButton(card)} variant="contained" color="error">
                                Remove from pitch
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
        
            </div>
    )
}