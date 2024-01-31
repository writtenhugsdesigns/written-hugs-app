import * as React from 'react';
import { useDispatch } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ViewCard from '../ViewCard/ViewCard';

export default function CardList({ card }) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    overflow: 'scroll',
    display: 'block',
    width: '100%',
    height: '100%',
    bgcolor: 'background.paper',
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
    <>
      <tr>
        <td>{card.category}</td>
        <td>{card.inserted_at}</td>
        <td>{card.description}</td>
        <td>
          <button onClick={viewCard}>View</button>
          <button onClick={editCard}>Edit</button>
          <button onClick={deleteCard}>Delete</button>
        </td>
      </tr>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button onClick={handleClose}>Back</button>
          <ViewCard />
          <button onClick={handleClose}>Back</button>
        </Box>
      </Modal>
    </>

  );
}
