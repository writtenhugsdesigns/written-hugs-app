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
import { darkSand, fontStyle17 } from "../../constants/styling";
import Swal from "sweetalert2";
import './PitchList.css';

export default function PitchList() {
  const pitches = useSelector((store) => store.pitches.pitches);
  const wholesalers = useSelector(
    (store) => store.wholesalersReducer.wholesalers
  );
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_WHOLESALERS" });
    dispatch({ type: "SAGA/FETCH_PITCHES" });
    sortPitchByDateOldest();
  }, []);

  const [dateSort, setDateSort] = useState(false);
  const [renderList, setRenderList] = useState(false);
  const [wholesalerSort, setWholesalerSort] = useState(false);

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

  
  const sortPitchByWholesalerNameDesc = () => {
    pitches.sort((a, b) => {
      const wholesalerA = a.wholesaler_company_name.toLowerCase();
      const wholesalerB = b.wholesaler_company_name.toLowerCase();
      if (wholesalerA > wholesalerB) {
        return 1;
      }
      if (wholesalerA < wholesalerB) {
        return -1;
      }
      // dates must be equal
      return 0;
    });
    if (renderList) {
      renderList.sort((a, b) => {
        const wholesalerA = a.wholesaler_company_name.toLowerCase();
      const wholesalerB = b.wholesaler_company_name.toLowerCase();
        if (wholesalerA > wholesalerB) {
          return 1;
        }
        if (wholesalerA < wholesalerB) {
          return -1;
        }
        // dates must be equal
        return 0;
      });
    }
    setWholesalerSort(false);
  };

  const sortPitchByWholesalerNameAsc = () => {
    pitches.sort((a, b) => {
      const wholesalerA = a.wholesaler_company_name.toLowerCase();
      const wholesalerB = b.wholesaler_company_name.toLowerCase();
      if (wholesalerA < wholesalerB) {
        return 1;
      }
      if (wholesalerA > wholesalerB) {
        return -1;
      }
      // dates must be equal
      return 0;
    });
    if (renderList) {
      renderList.sort((a, b) => {
        const wholesalerA = a.wholesaler_company_name.toLowerCase();
      const wholesalerB = b.wholesaler_company_name.toLowerCase();
        if (wholesalerA < wholesalerB) {
          return 1;
        }
        if (wholesalerA > wholesalerB) {
          return -1;
        }
        // dates must be equal
        return 0;
      });
    }
    setWholesalerSort(true);
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

  const viewPitch = (id) => {history.push(`/viewPitch/${id}`);};

  const editPitch = (id) => {history.push(`/editPitch/${id}`);};

  const openDeleteProcess = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this pitch?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "", "success");
        dispatch({
          type: "SAGA/DELETE_PITCH",
          payload: id,
        });
        setRenderList(renderList.filter((index) => index.pitches_id != id));
      }
    });
  };

  return (
    <div className="container">
      <div className='flexbox'>
        <h2>Wholesaler: {" "}</h2>
        <span>
          <select onChange={(e) => filterWholesalersByName(e.target.value)}>
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
      </div>
      <br/>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{backgroundColor: darkSand}}>
                <TableCell style={{ maxWidth: "10vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"wholesaler"}>
                {!wholesalerSort && (
                    <span onClick={sortPitchByWholesalerNameAsc}>Wholesaler ▽</span>
                  )}
                  {wholesalerSort && (
                    <span onClick={sortPitchByWholesalerNameDesc}>Wholesaler △</span>
                  )}
                </TableCell>
                <TableCell style={{ maxWidth: "10vw", fontFamily: 'Open Sans Regular', fontSize: '18px'  }} key={"date"}>
                  {!dateSort && (
                    <span onClick={sortPitchByDateNewest}>Date ▽</span>
                  )}
                  {dateSort && (
                    <span onClick={sortPitchByDateOldest}>Date △</span>
                  )}
                </TableCell>
                <TableCell style={{ maxWidth: "10vw", fontFamily: 'Open Sans Regular', fontSize: '18px'  }} key={"description"}>
                  Description
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(renderList || pitches).map((pitchRow) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={pitchRow.id}>
                  <TableCell sx={fontStyle17}>{pitchRow.wholesaler_company_name}</TableCell>
                  <TableCell sx={fontStyle17}>
                    {new Date(Date.parse(pitchRow.date)).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={fontStyle17}>{pitchRow.description}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => viewPitch(pitchRow.pitches_id)}
                      variant="contained"
                    >
                      View
                    </Button>
                    <span> </span>
                    <Button
                      onClick={() => editPitch(pitchRow.pitches_id)}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                    <span> </span>
                    <Button
                      onClick={() => openDeleteProcess(pitchRow.pitches_id)}
                      variant="contained"
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
