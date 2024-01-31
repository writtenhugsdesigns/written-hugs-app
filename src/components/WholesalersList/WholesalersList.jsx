import React, { useState, useEffect } from "react";
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function WholesalersList(){

    const history = useHistory();
    const dispatch = useDispatch();
    const wholesalers = useSelector(store => store.wholesalersReducer.wholesalers);
    
    // Local state for the current page in the table, and the amount of data per page
    const [page, setPage] = useState(0);

    useEffect(() => {dispatch({type: 'SAGA/FETCH_WHOLESALERS'})}, []);

    return (
        <div className = 'container'>
            {/* MUI table within an MUI paper component */}
            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer>
                    <Table stickyheader aria-label='sticky table'>
                        <TableHead >
                            <TableRow>
                                <TableCell style={{minWidth: '50vw'}}key={'name'}>
                                    Organization Name
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {wholesalers && wholesalers.map((x) => (
                                <TableRow hover role='checkbox' tabIndex={-1} key = {x.id}>
                                    <TableCell>
                                        {x.company_name}
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
        </div>
    )
}