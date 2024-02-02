import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination, Box, Modal, IconButton, Collapse, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ViewCard from '../ViewCard/ViewCard';

export default function CardList() {
  const dispatch = useDispatch();

  // const cards = useSelector(store => store.cardsReducer.cardsList);
  // const categories = useSelector(store => store.categoriesReducer.categories);
  const cards = [{
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
    sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    categoriesArray: [{
      category_name: 'mental health',
      category_id: 1
    },
    {
      category_name: 'christmas',
      category_id: 2
    }]
  },
  {
    id: 2,
    name: 'second card',
    vendor_style: 'MH1002',
    description: 'second mental health card',
    upc: 102,
    sku: 122,
    barcode: 'barcode',
    front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    front_tiff: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    insert_ai: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    raw_art: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    sticker_pdf: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    categoriesArray: [{
      category_name: 'mental health',
      category_id: 1
    },
    {
      category_name: 'christmas',
      category_id: 2
    }]
  },
  {
    id: 3,
    name: 'third card',
    vendor_style: 'MH1000',
    description: 'third mental health card',
    upc: 103,
    sku: 133,
    barcode: 'barcode',
    front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    front_tiff: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    insert_ai: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    raw_art: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    sticker_pdf: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
    categoriesArray: [{
      category_name: 'fathers day',
      category_id: 3
    }]
  }]

  const categories = [{
    name: 'mental health',
    id: 1
  },
  {
    name: 'christmas',
    id: 2
  },
  {
    name: 'fathers day',
    id: 3
  }]

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => { dispatch({ type: 'SAGA/FETCH_CARDS' }) }, []);

  // Style for MUI box in Modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'auto',
    display: 'block',
    width: '90vw',
    height: '90vh',
    bgcolor: 'background.paper',
  };

  const viewCard = (x) => {
    handleOpen()
    dispatch({
      type: 'SET_CARD',
      payload: x
    })
  };

  const editCard = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deleteCard = () => {
    console.log("BEGONE THINGY WITH card", card.id);
  };

  function createData(category, category_id, cards) {
    console.log('category, category_id, cards:', category, category_id, cards);
    return {
      category,
      category_id,
      cards
    };
  }

  const cardFunction = (row) => {
    console.log('row:', row);
    for (let i = 0; i < row.cards.length; i++) {
      console.log('card:', row.cards[i]);
      console.log('card categories:', row.cards[i].categoriesArrayID);
      for (let j = 0; j < row.cards[i].categoriesArrayID.length; j++) {
        do {
          j++
          console.log('name, description:', row.cards[i].name, row.cards[i].description);

            < TableRow key={row.cards[i].id} >
              <TableCell>{row.cards[i].description}</TableCell>
            </TableRow>

        } while (row.cards[i].categoriesArrayID[j] === row.category_id)



        // if (row.cards[i].categoriesArrayID[j] === row.category_id) {
        //   console.log('name, description:', row.cards[i].name, row.cards[i].description);
        //   < TableRow key={row.cards[i].id} >
        //     <TableCell>{row.cards[i].description}</TableCell>
        //   </TableRow>
        // }
      }


    }
  }


  function Row(cards) {
    const { row } = cards;
    const [openRow, setOpenRow] = useState(false);

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
          <TableCell component="th" scope="row">
            {row.category}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openRow} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Card Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Preview</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cardFunction(row)}
                    {/* {row.cards.map((card) => {
                      if (card.categoriesArrayID.includes(row.category_id)) {
                        < TableRow key={card.id} >
                          <TableCell>{card.description}</TableCell>
                        </TableRow>
                      }
                    })} */}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment >
    );
  }

  // Row.propTypes = {
  //   row: PropTypes.shape({
  //     calories: PropTypes.number.isRequired,
  //     carbs: PropTypes.number.isRequired,
  //     fat: PropTypes.number.isRequired,
  //     history: PropTypes.arrayOf(
  //       PropTypes.shape({
  //         amount: PropTypes.number.isRequired,
  //         customerId: PropTypes.string.isRequired,
  //         date: PropTypes.string.isRequired,
  //       }),
  //     ).isRequired,
  //     name: PropTypes.string.isRequired,
  //     price: PropTypes.number.isRequired,
  //     protein: PropTypes.number.isRequired,
  //   }).isRequired,
  // };

  // const formatCards = (cards) => {

  //   cards.map((card) => {

  //     card.categoriesArray.map((category) => {
  //       console.log('category_id', category.category_id)
  //       card.categoriesArrayID.push(card.category.category_id)
  //     })

  //   })
  //   console.log('cards', cards);
  // }

  const formatCards = (cards) => {

    for (let i = 0; i < cards.length; i++) {
      cards[i].categoriesArrayID = []
      for (let j = 0; j < cards[i].categoriesArray.length; j++) {
        cards[i].categoriesArrayID.push(cards[i].categoriesArray[j].category_id)
      }
    }
    return cards
  }

  const getRows = (categories, cards) => {
    console.log('cards', cards);
    let rowsArray = []
    categories.map((category) => {
      rowsArray.push(createData(category.name, category.id, cards))
    })
    return rowsArray;
  }

  const rows = getRows(categories, formatCards(cards))

  return (
    <div className='container'>
      {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyheader aria-label='sticky table'>
            <TableHead >
              <TableRow>
                <TableCell>Card Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards && cards.map((x) => (
                <TableRow hover role='checkbox' tabIndex={-1} key={x.id}>
                  <TableCell>
                    {x.name}
                  </TableCell>
                  <TableCell>
                    {x.description}
                  </TableCell>
                  <TableCell>
                    {x.categoriesArray.map((y) => {
                      return <span key={y.category_id}>{y.category_name}, </span>
                    })}
                  </TableCell>
                  <TableCell>
                    <img src={x.front_img} />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => viewCard(x)} variant='outlined'>View</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant='outlined'>Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant='outlined' color='error'>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper> */}


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
              <Row key={row.category} row={row} />
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
