import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Box,
  Modal, 
  IconButton, 
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ViewCard from "../ViewCard/ViewCard";
import Swal from "sweetalert2";
import { largeModalStyle, fontStyle16, fontStyle18, fontStyle19, darkSand, lightSand } from "../../constants/styling";


export default function CardList() {
  const dispatch = useDispatch();
  const history = useHistory();

  const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
    dispatch({ type: "SAGA/FETCH_CATEGORIES" });
  }, []);

  /**
   * When the user clicks the View button, opens the modal for the card, and dispatches to set the current card reducer
   * @param {*} card object representing one card variation 
   */
  const viewCard = (card) => {
    handleOpen();
    dispatch({
      type: "SET_CARD",
      payload: card,
    });
  };

  /**
   * When the user clicks the Edit button, dispatch to set the current card reducer and redirect the user to the edit page
   * corresponding to that specific card
   * @param {*} card 
   */
  const editCard = (card) => {
    dispatch({
      type: "SET_CARD",
      payload: card,
    });
    history.push(`/editcard/${card.card_id}`)
  };

  /**
   * When a user clicks the delete button, displays a sweet alert to confirm deletion. Then, dispatches a delete request for that
   * card
   * @param {*} card 
   */
  const deleteCard = (card) => {
    Swal.fire({
      title: `Are you sure you want to delete this card?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The card has been deleted.",
          icon: "success"
        });
        dispatch({
          type: 'SAGA/DELETE_CARD',
          payload: card.card_id
        })
      }
    });
  };

  /**
   * @param {*} props 
   * @returns an MUI table row of the uncollapsed table containing information about a card variation
   */
  function Row(props) {
    const { row } = props;
    const [openRow, setOpenRow] = useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { fontFamily: 'Open Sans Light', borderBottom: 'unset', backgroundColor: lightSand } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenRow(!openRow)}
            >
              {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell sx={fontStyle18}>{row.category_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openRow} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="medium" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={fontStyle16}>Card Name</TableCell>
                      <TableCell sx={fontStyle16}>Description</TableCell>
                      <TableCell sx={fontStyle16}>Categories</TableCell>
                      <TableCell sx={fontStyle16}>Preview</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.cardsArray.map((x) => (
                      <TableRow key={x.card_id}>
                        <TableCell sx={{fontFamily: 'Open Sans Light', fontSize: '15px', width: '10em'}}>{x.name}</TableCell>
                        <TableCell sx={{fontFamily: 'Open Sans Light', fontSize: '15px', width: '13em'}}><div className = 'description'>{x.description}</div></TableCell>
                        <TableCell sx={{fontFamily: 'Open Sans Light', fontSize: '15px', width: '20em'}}>{x.categories_array.map((y, i) => (<span key={i}>{y.category_name}, </span>))}</TableCell>
                        <TableCell>
                          {x.front_img.display && <img width='200em' src={x.front_img.display} />}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => viewCard(x)} variant="contained">View</Button>
                          <span> </span>
                          <Button variant="outlined" onClick={() => editCard(x)}>Edit</Button>
                          <span> </span>
                          <Button onClick = {() => deleteCard(x)} variant="contained" color="error">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  
  // Create an array of categories where each category will be a row in the table
  const rows = cardsByCategory.map((category) => {return category});

  return (
    <div className="container">
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: darkSand}}>
              <TableCell />
              <TableCell sx={fontStyle19}>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <Row key={i} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </div>
  );
}
