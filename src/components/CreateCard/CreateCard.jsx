import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function CreateCard() {
  const history = useHistory();
  const dispatch = useDispatch();

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
  let [barcode, setBarcode] = useState(null);
  let [front, setFront] = useState(null);
  let [insideInsertion, setInsideInsertion] = useState(null);
  let [insert, setInsert] = useState(null);
  let [sticker, setSticker] = useState(null);
  let [TIFFFile, setTIFFFile] = useState(null);
  let [AIFile, setAIFile] = useState(null);

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

  // User hits submit button, POSTs a new card, redirects back to /cards
  const handleSubmit = (e) => {
    e.preventDefault();
    const sameName = currentFoldersArray.find(
      (index) => index.name === variationName
    );

    if (sameName) {
      alert("same name!");
    } else {
      // Do the dispatch
      // history.push("/cards");
      console.log(
        currentFoldersArray,
        variationName,
        UPCNumber,
        vendorStyle,
        barcode,
        getCategories()
      );
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
          value={barcode}
          onChange={() => {
            setBarcode(event.target.value);
          }}
        />
        <label for="front">Front: </label>
        <input
          id="front"
          type="file"
          value={front}
          onChange={() => {
            setFront(event.target.value);
          }}
        />
        <label for="insideInsertion">Inside Insertion: </label>
        <input
          id="insideInsertion"
          type="file"
          value={insideInsertion}
          onChange={() => {
            setInsideInsertion(event.target.value);
          }}
        />
        <label for="insert">Insert: </label>
        <input
          id="insert"
          type="file"
          value={insert}
          onChange={() => {
            setInsert(event.target.value);
          }}
        />
        <label for="sticker">sticker: </label>
        <input
          id="sticker"
          type="file"
          value={sticker}
          onChange={() => {
            setSticker(event.target.value);
          }}
        />
        <label for="tiffFile">TIFF File: </label>
        <input
          id="tiffFile"
          type="file"
          value={TIFFFile}
          onChange={() => {
            setTIFFFile(event.target.value);
          }}
        />
        <label for="AIfile">AI File: </label>
        <input
          id="AIfile"
          type="file"
          value={AIFile}
          onChange={() => {
            setAIFile(event.target.value);
          }}
        />
        Create Card
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}
