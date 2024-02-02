import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBackIos } from "@mui/icons-material";
import { Button } from "@mui/material";
import './CreateCard.css';

export default function CreateCard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const newCardToSend = new FormData();

  //This use effect triggers the saga "getCurrentFolders"
  //After this is triggered a useSelector will get the current folders array
  //and save it in a local array
  useEffect(() => {
    dispatch({
      type: "SAGA/GET_FOLDERS",
    });
    dispatch({
      type: "SAGA/FETCH_CATEGORIES",
    });
  }, []);

  const currentFoldersArray = useSelector(
    (store) => store.cardsReducer.currentFolders
  );
  const databaseCategories = useSelector((store) => store.categoriesReducer);

  let [variationName, setVariationName] = useState(null);
  let [UPCNumber, setUPCNumber] = useState(null);
  let [vendorStyle, setVendorStyle] = useState(null);
  let [barcode, setBarcode] = useState([]);
  let [front, setFront] = useState([]);
  let [insideInsertion, setInsideInsertion] = useState([]);
  let [insert, setInsert] = useState([]);
  let [sticker, setSticker] = useState([]);
  let [TIFFFile, setTIFFFile] = useState([]);
  let [AIFile, setAIFile] = useState([]);

  const folderName = vendorStyle + " " + variationName;
  /**
   * Get  the user selected category ids
   * @returns an array of the ids of the checked categories
   */
  const getCategories = () => {
    let checkboxes = document.querySelectorAll(
      'input[name="categories"]:checked'
    );
    let values = [];
    checkboxes.forEach((checkbox) => {
      values.push(checkbox.value);
    });
    return values;
  };

  // User hits submit button, checks if the variant name matches current folders in google drive,
  //POSTs a new card, redirects back to /cards
  const handleSubmit = (e) => {
    e.preventDefault();
    const sameName = currentFoldersArray.find(
      (index) => index.name === folderName
    );

    if (sameName) {
      alert("same name!");
    } else {
    newCardToSend.append("front_img", front[0]);
    newCardToSend.append("front_tiff", TIFFFile[0]);
    newCardToSend.append("inner_img", insideInsertion[0]);
    newCardToSend.append("insert_img", insert[0]);
    newCardToSend.append("sticker_jpeg", sticker[0]);
    newCardToSend.append("barcode", barcode[0]);
    newCardToSend.append("insert_ai", AIFile[0]);
    newCardToSend.append("upc", UPCNumber);
    newCardToSend.append("vendor_style", vendorStyle);
    newCardToSend.append("name", variationName);
    dispatch({
      type: "SAGA/POST_CARD",
      payload: newCardToSend
    })

      // Do the dispatch
      // history.push("/cards");
      // console.log(
      //   currentFoldersArray,
      //   variationName,
      //   UPCNumber,
      //   vendorStyle,
      //   barcode,
      //   getCategories()
      // );
    }
    // Clear fields
    setVariationName(null);
    setUPCNumber(null);
    setVendorStyle(null);
  };

  // Clears form inputs when user hits the clear button
  const handleClear = (e) => {
    e.preventDefault();
    setVariationName(null);
    setUPCNumber(null);
    setVendorStyle(null);
  }

  return (
    <div className="container">
            <div className = 'wholesalerBar'>
        <h1>New Card Info</h1>
        <button className = 'pageButton' onClick = {() => history.push("/cards")}><ArrowBackIos/>Back</button> 
      </div>
      <div className = 'formContainer'></div>
      <form>
        Variation Name
        <input
          value={variationName}
          label="Variation Name"
          placeholder="Variation Name"
          onChange={() => setVariationName(event.target.value)}
          id="variation"
        />
        <br></br>
        UPC Number
        <input
          value={UPCNumber}
          label="UPC Number"
          placeholder="UPC Number"
          onChange={() => setUPCNumber(event.target.value)}
          id="UPCNumber"
        />
        <br></br>
        Vendor Style
        <input
          value={vendorStyle}
          label="Vendor Style"
          placeholder="Vendor Style"
          onChange={() => setVendorStyle(event.target.value)}
          id="vendorStyle"
        />
        <p>Categories</p>
        {databaseCategories.categories &&
          databaseCategories.categories.map((category) => {
            return (
              <div>
                {category.name}
                <input
                  type="checkbox"
                  name="categories"
                  value={category.id}
                  id={category.id}
                />
              </div>
            );
          })}
        <label for="barcode">Barcode: </label>
        <input
          id="barcode"
          type="file"
          onChange={() => {
            setBarcode(event.target.files);
          }}
        />
        <label for="front">Front: </label>
        <input
          id="front"
          type="file"
          onChange={() => {
            setFront(event.target.files);
          }}
        />
        <label for="insideInsertion">Inside Insertion: </label>
        <input
          id="insideInsertion"
          type="file"
          onChange={() => {
            setInsideInsertion(event.target.files);
          }}
        />
        <label for="insert">Insert: </label>
        <input
          id="insert"
          type="file"
          onChange={() => {
            setInsert(event.target.files);
          }}
        />
        <label for="sticker">sticker: </label>
        <input
          id="sticker"
          type="file"
          onChange={() => {
            setSticker(event.target.files);
          }}
        />
        <label for="tiffFile">TIFF File: </label>
        <input
          id="tiffFile"
          type="file"
          onChange={() => {
            setTIFFFile(event.target.files);
          }}
        />
        <label for="AIfile">AI File: </label>
        <input
          id="AIfile"
          type="file"
          onChange={() => {
            setAIFile(event.target.files);
          }}
        />
        Create Card
        <button onClick={handleSubmit}>Submit</button>
      </form>

    </div>
  );
}
