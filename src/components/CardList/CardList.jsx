import Reach, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination, Box, Modal } from "@mui/material";
import ViewCard from '../ViewCard/ViewCard';

export default function CardList() {
  const dispatch = useDispatch();

  const cards = useSelector(store => store.cardsReducer.cardsList);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {dispatch({type: 'SAGA/FETCH_CARDS'})}, []);

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

  return (
    <div className = 'container'>
      <Paper sx={{width: '100%', overflow: 'hidden'}}>
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
                                <TableRow hover role='checkbox' tabIndex={-1} key = {x.id}>
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
                                      <img src={x.front_img}/>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick = {() => viewCard(x)} variant='outlined'>View</Button>
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
            </Paper>

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
