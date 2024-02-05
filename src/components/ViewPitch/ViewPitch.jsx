import React, { useRef } from "react";
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
      <table id="pitchTable">
        <tbody>
          <tr>
            <th>UPC#</th>
            <th>Barcode</th>
            <th>Vendor Stlye</th>
            <th>Variation Name</th>
            <th>Front</th>
            <th>Inside Inscription</th>
            <th>Insert</th>
            <th>Sticker</th>
            <th>Categories</th>
          </tr>
          {selectedPitch[0] &&
            selectedPitch[0].cards.map((card) => {
              return (
                <tr>
                  <td>{card.upc}</td>
                  <td>{card.barcode}</td>
                  <td>{card.vendor_style}</td>
                  <td>{card.name}</td>
                  <td>
                    <img src={card.front_img} />
                  </td>
                  <td>
                    <img src={card.inner_img} />
                  </td>
                  <td>
                    <img src={card.insert_img} />
                  </td>
                  <td>
                    <img src={card.sticker_jpeg} />
                  </td>
                  <td>
                    {card.categories.map((category) => {
                      return <p>{category.category_name}</p>;
                    })}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
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
    </div>
  );
}
