import React, { useRef } from "react";
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
  Modal,
  Box
} from "@mui/material";
import { CSVLink } from "react-csv";
import print from "print-js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

export default function ViewPitch() {
  const dispatch = useDispatch();
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

  const tableRef = useRef(null);

  // const { onDownload } = useDownloadExcel({
  //     currentTableRef: tableRef.current,
  //     filename: "Pitch table",
  //     sheet: "Pitch"
  // });

  const editPitch = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deletePitch = () => {
    console.log("BEGONE THINGY WITH Pitch", id);
  };

  return (
    <div className="container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyheader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{backgroundColor: '#eeebe5'}}>
                <TableCell style={{ minWidth: "5vw" }} key={"upc"}>
                  UPC#
                </TableCell>
                <TableCell style={{ minWidth: "5vw" }} key={"barcode"}>
                  Barcode
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"vendor_style"}>
                  Vendor Style
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"name"}>
                  Variation Name
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"front_img"}>
                  Front
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"inner_img"}>
                  Inside Inscription
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"insert_img"}>
                  Insert
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"sticker_jpeg"}>
                  Sticker
                </TableCell>
                <TableCell style={{ minWidth: "8vw" }} key={"categories"}>
                  Categories
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {selectedPitch[0] &&
                selectedPitch[0].cards.map((card) => (
                  <TableRow>

                    <TableCell>{card.upc}</TableCell>
                    <TableCell>{card.barcode}</TableCell>
                    <TableCell>{card.vendor_style}</TableCell>
                    <TableCell>{card.name}</TableCell>
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
                    <TableCell>
                      {card.categories.map((category) => {
                        return <p>{category.category_name}</p>;
                      })}
                    </TableCell>
                  </TableRow>
                  ))}

            </TableBody>
          </Table>
        </TableContainer>
      <br />
      <br />
      <button onClick={editPitch}>Edit Pitch</button>
      <button onClick={deletePitch}>Delete</button>
      <br />
      <br />
      {/* <button onClick={onDownload}>Download as excel</button> */}
      <br />
      <br />
      <CSVLink data={getCards(selectedPitch[0])}>Download CSV</CSVLink>;
      <br />
      <br />
      <button onClick={() => print("pitchTable", "html")}>Print To PDF</button>
      </Paper>
    </div>
  );
}
