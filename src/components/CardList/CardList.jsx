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
  TablePagination,
  Box,
  Modal, IconButton, Collapse, Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ViewCard from "../ViewCard/ViewCard";
import { Category } from "@mui/icons-material";

export default function CardList() {
  const dispatch = useDispatch();
  const history = useHistory();

  // const cards = useSelector(store => store.cardsReducer.cardsList);
  const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
  }, []);

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

  const viewCard = (x) => {
    handleOpen();
    dispatch({
      type: "SET_CARD",
      payload: x,
    });
  };

  const editCard = (x) => {
    dispatch({
      type: "SET_CARD",
      payload: x,
    });
    history.push(`/editcard/${x.card_id}`)
  };

  const deleteCard = () => {
    console.log("BEGONE THINGY WITH card", card.id);
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
        <TableRow sx={{ '& > *': { borderBottom: 'unset', backgroundColor: 'rgb(249, 247, 243)' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenRow(!openRow)}
            >
              {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.category_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openRow} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="medium" aria-label="purchases">
                  
                  <TableHead>
                    <TableRow>
                      <TableCell>Card Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Categories</TableCell>
                      <TableCell>Preview</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {row.cardsArray.map((x) => (
                      <TableRow key={x.card_id}>
                        <TableCell>{x.name}</TableCell>
                        <TableCell>{x.description}</TableCell>
                        <TableCell>{x.categories_array.map((y) => (<span className='tag'>{y.category_name}</span>))}</TableCell>
                        <TableCell>
                          <img width='180em' src={x.front_img.display} />
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => viewCard(x)} variant="contained">
                            View
                          </Button>
                          <span> </span>
                          <Button variant="outlined" onClick={() => editCard(x)}>Edit</Button>
                          <span> </span>
                          <Button variant="contained" color="error">
                            Delete
                          </Button>
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
  
  const rows = 
    cardsByCategory.map((category) => {
      return category
    });

  return (
    <div className="container">
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{backgroundColor: 'rgb(238, 235, 229)'}}>
              <TableCell />
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.id} row={row} />
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
        <Box sx={style}>
          <ViewCard handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}
