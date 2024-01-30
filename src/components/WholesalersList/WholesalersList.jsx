import React, { useState } from "react";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination } from "@mui/material";

export default function WholesalersList(){

    // Local state for the current page in the table, and the amount of data per page
    const [page, setPage] = useState(0);

    return (
        <div className = 'container'>
            {/* MUI table within an MUI paper component */}
            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer>
                    <Table stickyheader aria-label='sticky table'>
                        <TableHead>
                            <TableRow>
                                <TableCell key={'name'}>
                                    Organization Name
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <TablePagination
                    component="div"
                                    
                
                /> */}
            </Paper>
        </div>
    )
}