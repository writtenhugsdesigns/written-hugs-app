import React, { useState, useEffect } from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Modal,
    Box
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import EditWholesaler from "../EditWholesaler/EditWholesaler";
import Swal from "sweetalert2";
import { smallModalStyle, darkSand, fontStyle17 } from "../../constants/styling";

export default function WholesalersList(){
    const dispatch = useDispatch();
    const wholesalers = useSelector(store => store.wholesalersReducer.wholesalers);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    useEffect(() => {dispatch({type: 'SAGA/FETCH_WHOLESALERS'})}, []);

    const editWholesaler = (wholesaler) => {
        dispatch({
            type: 'SET_CURRENT_WHOLESALER',
            payload: wholesaler
        })
        handleOpen();
    }

    const deleteWholesaler = (wholesaler) => {
        Swal.fire({
          title: `Are you sure you want to delete the ${wholesaler.company_name}?`,
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "The wholesaler has been deleted.",
              icon: "success"
            });
            dispatch({
              type: 'SAGA/DELETE_WHOLESALER',
              payload: wholesaler.id
            })
          }
        });
    }

    return (
        <div className = 'container'>
            {/* MUI table within an MUI paper component */}
            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer >
                    <Table stickyheader aria-label='sticky table'>
                        <TableHead >
                            <TableRow sx={{backgroundColor: darkSand}}>
                                <TableCell style={{minWidth: '50vw', fontFamily: 'Open Sans Regular', fontSize: '18px'}} key={'name'}>
                                    Organization Name
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {wholesalers && wholesalers.map((x) => (
                                <TableRow hover role='checkbox' tabIndex={-1} key = {x.id}>
                                    <TableCell sx={fontStyle17}>
                                        {x.company_name}
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick = {() => editWholesaler(x)} variant='outlined'>Edit</Button>
                                        <span> </span>
                                        <Button onClick = {() => deleteWholesaler(x)} variant='contained' color='error'>Delete</Button>
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
                <Box sx={smallModalStyle}>
                    <EditWholesaler handleClose = {handleClose}/>
                </Box>
            </Modal>
        </div>
    )
}