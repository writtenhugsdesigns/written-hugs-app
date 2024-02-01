import * as React from 'react';
import { useHistory } from "react-router-dom";
import WholesalersList from "../WholesalersList/WholesalersList";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import './WholesalersPage.css';
import CreateWholesaler from '../CreateWholesaler/CreateWholesaler'

export default function WholesalersPage() {
    const history = useHistory();
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

    return (
        <>
            <div className='container'>
                <div className='wholesalerBar'>
                    <h1>Wholesalers</h1>
                    <button className='pageButton' onClick={handleOpen}>Add Wholesaler</button>
                </div>

                <WholesalersList />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CreateWholesaler handleClose={handleClose}/>
                </Box>
            </Modal>
        </>
    )
}