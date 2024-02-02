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
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function PitchList() {
  const pitches = useSelector((store) => store.pitches);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });

    sortPitchByDateOldest();
  }, []);

  const [page, setPage] = useState(0);
  const [wholesalerSort, setWholesalerSort] = useState(false);
  const [dateSort, setDateSort] = useState(false);

  /**
   * This function allows you to sort pitches based off of oldest to newest.
   * @returns a sorted list based off of the date begun with, oldest first.
   */
  const sortPitchByDateOldest = () => {
    pitches.sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      // dates must be equal
      return 0;
    });
    setDateSort(false);
  };

  /**
   * This function allows you to sort pitches based off of newest to oldest.
   * @returns a sorted list based off of the date begun with, newest first.
   */
  const sortPitchByDateNewest = () => {
    pitches.sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      // dates must be equal
      return 0;
    });
    setDateSort(true);
  };

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
                  {!dateSort && (
                    <span id={"filterV"} onClick={sortPitchByDateNewest}>
                      Date V
                    </span>
                  )}
                  {dateSort && (
                    <span id={"filterV"} onClick={sortPitchByDateOldest}>
                      Date Λ
                    </span>
                  )}
                </TableCell>
                <TableCell style={{ maxWidth: "10vw" }} key={"description"}>
                  Description
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pitches &&
                pitches.map((pitchRow) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={pitchRow.id}
                  >
                    <TableCell>{pitchRow.wholesaler_company_name}</TableCell>
                    <TableCell>
                      {new Date(Date.parse(pitchRow.date)).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{pitchRow.description}</TableCell>
                    <TableCell>
                      <Button variant="outlined">View</Button>
                      <span> </span>
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
