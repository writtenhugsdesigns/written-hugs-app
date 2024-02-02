import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const cards = useSelector(store => store.cardsReducer.cardsList);
  const categories = useSelector(store => store.categoriesReducer.categories);
  // reducer still needs to be made
  // const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);

  const cardsByCategory = [
    {
      id: 1,
      name: 'goats',
      cards: [
        {
          id: 1,
          name: 'first card',
          vendor_style: 'MH1001',
          description: 'first mental health card',
          upc: 101,
          sku: 111,
          barcode: 'barcode',
          front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY'
        },
        {
          id: 2,
          name: 'second card',
          vendor_style: 'MH1002',
          description: 'second mental health card',
          upc: 102,
          sku: 222,
          barcode: 'barcode',
          front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
        }
      ]
    },
    {
      id: 2,
      name: 'goatz',
      cards: [
        {
          id: 1,
          name: 'first card',
          vendor_style: 'MH1001',
          description: 'first mental health card',
          upc: 101,
          sku: 111,
          barcode: 'barcode',
          front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY'
        },
        {
          id: 3,
          name: 'third card',
          vendor_style: 'MH1001',
          description: 'third mental health card',
          upc: 103,
          sku: 333,
          barcode: 'barcode',
          front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
          sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY'
        }
      ]
    }
  ]

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_CARDS" });
    dispatch({ type: "SAGA/FETCH_CATEGORIES" });
    // saga still needs to be made
    // dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
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
  };

  const viewCard = (x) => {
    handleOpen();
    dispatch({
      type: "SET_CARD",
      payload: x,
    });
  };

  const editCard = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deleteCard = () => {
    console.log("BEGONE THINGY WITH card", card.id);
  };


  
  function Row(props) {
    const { row } = props;
    console.log('row', row);
    const [openRow, setOpenRow] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenRow(!openRow)}
            >
              {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openRow} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>description</TableCell>
                      <TableCell>name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.cards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell>{card.description}</TableCell>
                        <TableCell>{card.name}</TableCell>
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

  console.log('rows out of function:', rows);



  return (
    <div className="container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
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
              {cards &&
                cards.map((x) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={x.id}>
                    <TableCell>{x.name}</TableCell>
                    <TableCell>{x.description}</TableCell>
                    <TableCell>
                      <div className='tagContainer'>
                        {x.categoriesArray.map((y) => {
                          return (
                            <span className='tag' key={y.category_id}>{y.category_name}</span>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <img width='180em' src={x.front_img.display} />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => viewCard(x)} variant="contained">
                        View
                      </Button>
                      <span> </span>
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
<br />
<br />
      <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
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
