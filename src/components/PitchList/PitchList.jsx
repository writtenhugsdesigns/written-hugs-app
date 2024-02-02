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
  TablePagination,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function PitchList() {
  const pitches = useSelector((store) => store.pitches);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
  }, []);

  const [page, setPage] = useState(0);

  return (
    <div className="container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ maxWidth: "10vw" }} key={"wholesaler"}>
                  Wholesaler
                </TableCell>
                <TableCell style={{ maxWidth: "10vw" }} key={"date"}>
                  Date
                </TableCell>
                <TableCell style={{ maxWidth: "10vw" }} key={"description"}>
                  Description
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pitches &&
                pitches.map((x) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={x.id}>
                    <TableCell>{x.wholesaler_company_name}</TableCell>
                    <TableCell>
                      {new Date(Date.parse(x.date)).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{x.description}</TableCell>
                    <TableCell>
                      <Button variant="outlined">Edit</Button>
                      <span> </span>
                      <Button variant="contained" color="error">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* <div className="container">
        <button onClick={() => history.push("/createPitch")}>New Pitch</button>
        Pitch Page
        {pitches[0] &&
          pitches.map((pitch) => {
            return <PitchList pitch={pitch} />;
          })}
      </div> */}
    </div>
  );
}
