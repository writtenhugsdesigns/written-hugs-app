import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

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
  let [frontImg, setFrontImg] = useState([]);
  let [insideImg, setInsideImg] = useState([]);
  let [insertImg, setInsertImg] = useState([]);
  let [insertAi, setInsertAi] = useState([]);
  let [stickerImg, setStickerImg] = useState([]);
  let [stickerPdf, setStickerPdf] = useState([]);
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
    newCardToSend.append("front_img", frontImg[0]);
    newCardToSend.append("front_tiff", TIFFFile[0]);
    newCardToSend.append("inner_img", insideImg[0]);
    newCardToSend.append("insert_img", insertImg[0]);
    newCardToSend.append("insert_ai", insertAi[0]);
    newCardToSend.append("sticker_jpeg", stickerImg[0]);
    newCardToSend.append("sticker_pdf", stickerPdf[0]);
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
  };

  return (
    <div className="container">
      <form>
        Variation Name
        <input
          value={variationName}
          label="Variation Name"
          placeholder="Variation Name"
          onChange={(event) => setVariationName(event.target.value)}
          id="variation"
        />
        <br></br>
        UPC Number
        <input
          value={UPCNumber}
          label="UPC Number"
          placeholder="UPC Number"
          onChange={(event) => setUPCNumber(event.target.value)}
          id="UPCNumber"
        />
        <br></br>
        Vendor Style
        <input
          value={vendorStyle}
          label="Vendor Style"
          placeholder="Vendor Style"
          onChange={(event) => setVendorStyle(event.target.value)}
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
        <label for="barcode">Barcode Image: </label>
        <input
          id="barcode"
          type="file"
          onChange={(event) => {
            setBarcode(event.target.files);
          }}
        />
        <label for="frontImg">Front Image: </label>
        <input
          id="frontImg"
          type="file"
          onChange={(event) => {
            setFrontImg(event.target.files);
          }}
        />
        <label for="insideImg">Inside Image: </label>
        <input
          id="insideImg"
          type="file"
          onChange={(event) => {
            setInsideImg(event.target.files);
          }}
        />
        <label for="insertImg">Insert Image: </label>
        <input
          id="insertImg"
          type="file"
          onChange={(event) => {
            setInsertImg(event.target.files);
          }}
        />
        <label for="insertAi">Insert AI File: </label>
        <input
          id="insertAi"
          type="file"
          onChange={(event) => {
            setInsertAi(event.target.files);
          }}
        />
        <label for="stickerImg">Sticker Image: </label>
        <input
          id="stickerImg"
          type="file"
          onChange={(event) => {
            setStickerImg(event.target.files);
          }}
        />
        <label for="stickerPdf">Sticker Pdf: </label>
        <input
          id="stickerPdf"
          type="file"
          onChange={(event) => {
            setStickerPdf(event.target.files);
          }}
        />
        <label for="tiffFile">TIFF File: </label>
        <input
          id="tiffFile"
          type="file"
          onChange={(event) => {
            setTIFFFile(event.target.files);
          }}
        />
        <label for="AIfile">AI File: </label>
        <input
          id="AIfile"
          type="file"
          onChange={(event) => {
            setAIFile(event.target.files);
          }}
        />
        Create Card
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}
