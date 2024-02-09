import { useState } from "react";
import {Modal, Box} from '@mui/material';
import { AddCircleOutline } from "@mui/icons-material";
import { smallModalStyle } from "../../constants/styling";
import CreateCategory from '../CreateCategory/CreateCategory'
import CategoriesList from "../CategoriesList/CategoriesList";

export default function CategoriesPage() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
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
                <Box sx={smallModalStyle}>
                    <CreateCategory handleClose={handleClose} />
                </Box>
            </Modal>
        </>
    )
}