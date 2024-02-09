import { useState } from "react";
import { useHistory } from "react-router-dom";
import WholesalersList from "../WholesalersList/WholesalersList";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AddCircleOutline } from "@mui/icons-material";
import './WholesalersPage.css';
import CreateWholesaler from '../CreateWholesaler/CreateWholesaler';
import { smallModalStyle } from "../../constants/styling";

export default function WholesalersPage() {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
        <>
            <div className='container'>
                <div className='wholesalerBar'>
                    <h1>Wholesalers</h1>
                    <button className='pageButton' onClick={handleOpen}><AddCircleOutline/>Add Wholesaler</button>
                </div>

                <WholesalersList />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={smallModalStyle}>
                    <CreateWholesaler handleClose={handleClose} />
                </Box>
            </Modal>
        </>
    )
}