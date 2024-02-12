import React from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer
} from "@mui/material";
import { CSVLink } from "react-csv";
import print from "print-js";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { fontStyle17 } from "../../constants/styling";
import Swal from "sweetalert2";
import "./ViewPitch.css"
import { Margin } from "@mui/icons-material";


export default function ViewPitch() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const pitches = useSelector((store) => store.pitches.pitches);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
  }, []);

  const selectedPitch = pitches.filter(
    (individualPitch) => individualPitch.pitches_id == id
  );

  const getCards = (pitch) => {
    let cardsArray = [["Vendor Style", "UPC#", "Product Name"]];
    if (pitch) {
      pitch.cards.map((card) => {
        cardsArray.push([card.vendor_style, card.upc, card.description]);
      });
    }
    return cardsArray;
  };

  const editPitch = () => {
    history.push(`/editPitch/${id}`);
  };

  const deletePitch = () => {
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
          history.push("/pitches")
        }
      });
  };

  return (
    <div className="container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <div>
          <br></br>
          <span className="marginLeft"> </span><Button variant="outlined" onClick={() => history.push("/pitches")}>Back to Pitches</Button>
      </div>
        <div className="viewPitchButtons">
          <h3>Pitch Name: {selectedPitch[0] && selectedPitch[0].name}</h3>
          <div>
            <p>
              <CSVLink className="viewPitchGroup" data={getCards(selectedPitch[0])}>Download CSV</CSVLink>
              <Button className="viewPitchGroup" size='large' variant={"contained"} onClick={() => print("pitchTable", "html")}>Print To PDF</Button>
            </p>
          </div>
        </div>
        <div className="viewPitchButtons">
          <h3>Description: {selectedPitch[0] && selectedPitch[0].description}</h3>
        </div>
        <TableContainer>
          <Table sx={{ width: '80%'}}id="pitchTable" stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{backgroundColor: '#eeebe5'}}>
                <TableCell style={{ minWidth: "5vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"upc"}>
                  UPC#
                </TableCell>
                <TableCell style={{ minWidth: "5vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"barcode"}>
                  Barcode
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"vendor_style"}>
                  Vendor Style
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"name"}>
                  Variation Name
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"front_img"}>
                  Front
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"inner_img"}>
                  Inside Inscription
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"insert_img"}>
                  Insert
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"sticker_jpeg"}>
                  Sticker
                </TableCell>
                <TableCell style={{ minWidth: "8vw", fontFamily: 'Open Sans Regular', fontSize: '18px' }} key={"categories"}>
                  Categories
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {selectedPitch[0] &&
                selectedPitch[0].cards.map((card) => (
                  <TableRow>

                    <TableCell sx={fontStyle17}>{card.upc}</TableCell>
                    <TableCell>
                      <img src={card.barcode.display} />
                    </TableCell>
                    <TableCell sx={fontStyle17}>{card.vendor_style}</TableCell>
                    <TableCell sx={fontStyle17}>{card.card_name}</TableCell>
                    <TableCell>
                      <img src={card.front_img.display} />
                    </TableCell>
                    <TableCell>
                      <img src={card.inner_img.display} />
                    </TableCell>
                    <TableCell>
                      <img src={card.insert_img.display} />
                    </TableCell>
                    <TableCell>
                      <img src={card.sticker_jpeg.display} />
                    </TableCell>
                    <TableCell sx={fontStyle17}>
                      {card.categories_array.map((category) => {
                        return <p>{category.category_name}</p>;
                      })}
                    </TableCell>
                  </TableRow>
                  ))}

            </TableBody>
          </Table>
        </TableContainer>
      <div className="viewPitchButtons">
        <Button variant='outlined' size='large' onClick={editPitch}>Edit Pitch</Button>
        <Button variant={"contained"} size='large' color={"error"} onClick={deletePitch}>Delete</Button>
      </div>
      </Paper>
    </div>
  );
}
