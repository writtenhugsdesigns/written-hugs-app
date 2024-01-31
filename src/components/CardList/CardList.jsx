import * as React from 'react';
import { useDispatch } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ViewCard from '../ViewCard/ViewCard';

export default function CardList({ card }) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const viewCard = () => {
    console.log("This will do pop up stuff Ig.");
    handleOpen()
    dispatch({
      type: 'SET_CARD',
      payload: card
    })
    
  };

  const editCard = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deleteCard = () => {
    console.log("BEGONE THINGY WITH card", card.id);
  };

  return (
    <tr>
      <td>{card.category}</td>
      <td>{card.inserted_at}</td>
      <td>{card.description}</td>
      <td>
        <button onClick={viewCard}>View</button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <ViewCard />
        </Box>
      </Modal>
        <button onClick={editCard}>Edit</button>
        <button onClick={deleteCard}>Delete</button>
      </td>
    </tr>
  );
}
