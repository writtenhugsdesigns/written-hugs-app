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
import { render } from "react-dom";

export default function PitchList() {
  const pitches = useSelector((store) => store.pitches);
  const wholesalers = useSelector(
    (store) => store.wholesalersReducer.wholesalers
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
    dispatch({ type: "SAGA/FETCH_WHOLESALERS" });

    sortPitchByDateOldest();
  }, []);

  const [page, setPage] = useState(0);
  const [dateSort, setDateSort] = useState(false);
  const [renderList, setRenderList] = useState(false);

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
    if (renderList) {
      renderList.sort((a, b) => {
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
    }
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
    if (renderList) {
      renderList.sort((a, b) => {
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
    }
    setDateSort(true);
  };

  let result = false;

  /**
   * This function allows you to sort pitches based off of newest to oldest.
   * @returns a sorted list based off of the date begun with, newest first.
   */
  const filterWholesalersByName = (name) => {
    if (name != 0) {
      result = pitches.filter((index) => index.wholesaler_id == name);
    } else {
      result = false;
    }
    findRenderList();
  };

  const findRenderList = () => {
    if (result) {
      setRenderList(result);
    } else {
      setRenderList(pitches);
    }
  };

  return (
    <div className="container">
      <p>
        Wholesaler:{" "}
        <span>
          <select
            onChange={() => filterWholesalersByName(event.target.value)}
            id="framework"
          >
            <option value="0">All</option>
            {wholesalers &&
              wholesalers.map((wholesaler) => {
                return (
                  <option value={wholesaler.id}>
                    {wholesaler.company_name}
                  </option>
                );
              })}
          </select>
        </span>
      </p>
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
                      Date ▽
                    </span>
                  )}
                  {dateSort && (
                    <span id={"filterV"} onClick={sortPitchByDateOldest}>
                      Date △
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
              {(renderList &&
                renderList.map((pitchRow) => (
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
                ))) ||
                (pitches &&
                  pitches.map((pitchRow) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={pitchRow.id}
                    >
                      <TableCell>{pitchRow.wholesaler_company_name}</TableCell>
                      <TableCell>
                        {new Date(
                          Date.parse(pitchRow.date)
                        ).toLocaleDateString()}
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
                  )))}
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
