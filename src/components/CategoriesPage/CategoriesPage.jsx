import { useState } from "react";
import { useHistory } from "react-router-dom";
import CategoriesList from "../CategoriesList/CategoriesList";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AddCircleOutline } from "@mui/icons-material";
import CreateCategory from '../CreateCategory/CreateCategory'

export default function CategoriesPage() {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "auto",
        display: "block",
        width: "60vw",
        height: "30vh",
        bgcolor: "background.paper",
        'border-radius': '5px'
      };

    return (
        <>
            <div className='container'>
                <div className='wholesalerBar'>
                    <h1>Categories</h1>
                    <button className='pageButton' onClick={handleOpen}><AddCircleOutline/>Add Category</button>
                </div>

                <CategoriesList />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CreateCategory handleClose={handleClose} />
                </Box>
            </Modal>
        </>
    )
}