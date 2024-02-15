import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBackIos } from "@mui/icons-material";
import {
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import MultipleSelect from "../MultiSelectCategories/MultiSelectCategories";
import "./CreateCard.css";
import axios from "axios";

export default function CreateCard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const newCardToSend = new FormData();
  const currentFoldersArray = useSelector(store => store.cardsReducer.currentFolders);
  const databaseCategories = useSelector((store) => store.categoriesReducer);
  const createdCategory = useSelector((store) => store.categoriesReducer.currentCategory);

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

  let [variationName, setVariationName] = useState('');
  let [UPCNumber, setUPCNumber] = useState("");
  let [vendorStyle, setVendorStyle] = useState('');
  let [description, setDescription] = useState('');
  let [barcode, setBarcode] = useState([]);
  let [front, setFront] = useState([]);
  let [insideInsertion, setInsideInsertion] = useState([]);
  let [insert, setInsert] = useState([]);
  let [sticker, setSticker] = useState([]);
  let [stickerPdf, setStickerPdf] = useState([]);
  let [TIFFFile, setTIFFFile] = useState([]);
  let [AIFile, setAIFile] = useState([]);
  let [categoriesInput, setCategoriesInput] = useState([createdCategory.id]);

  const folderName = vendorStyle + " " + variationName;

  /**
   * When user hits submit, check if the variant name matches a current folder name in Google Drive. Then,
   * POSTs the card and redirects the user to the cards page
   * @param {*} e event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const sameName = currentFoldersArray.find(
      (index) => index.name === folderName
    );

    if (sameName) {
      Swal.fire("This card variant already exists. Choose a different name.");
    } else {
      newCardToSend.append("front_img", front[0]);
      newCardToSend.append("front_tiff", TIFFFile[0]);
      newCardToSend.append("inner_img", insideInsertion[0]);
      newCardToSend.append("insert_img", insert[0]);
      newCardToSend.append("sticker_jpeg", sticker[0]);
      newCardToSend.append("sticker_pdf", stickerPdf[0]);
      newCardToSend.append("barcode", barcode[0]);
      newCardToSend.append("insert_ai", AIFile[0]);
      newCardToSend.append("upc", UPCNumber);
      newCardToSend.append("vendor_style", vendorStyle);
      newCardToSend.append("name", variationName);
      newCardToSend.append("description", description);
      newCardToSend.append("categoriesArray", categoriesInput);
      dispatch({
        type: "SAGA/POST_CARD",
        payload: newCardToSend,
      });
      history.push("/cards");
    }
    // Clear fields
    handleClear(e);
  };

  /**
   * Clear the form fields after form submission
   * @param {*} e event
   */
  const handleClear = (e) => {
    e.preventDefault();
    setVariationName(null);
    setUPCNumber(null);
    setVendorStyle(null);
  };

  /**
   * When the user clicks the cancel button, confirms the user wants to abandon the form. If yes, redirects back to
   * cards page
   */
  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this form and lose the information!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f9b98c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        history.push("/cards");
      }
    });
  };

  /**
   * Displays sweet alert prompting user to provide a category name when they click the New Category button,  then POSTs the 
   * new category
   */
  const createCategory = () => {
    Swal.fire({
      input: "text",
      inputLabel: "New Category Name",
      inputPlaceholder: "Type your category here",
      inputAttributes: {
        "aria-label": "Type your category here",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });
  };

  //This form is divided using MUI Grid elements inside of a form div
  return (
    <div className="container">
      <Grid container sx={{ m: 3 }}>
        <Grid item lg={6}>
          <Typography variant="h2">New Card Variation</Typography>
        </Grid>
        <Grid item lg={3}>
          <button className="pageButton" onClick={handleCancel}>
            <ArrowBackIos />
            Back
          </button>
        </Grid>
        <Grid item lg={3}>
          <button className="pageButton" onClick={handleSubmit}>
            Submit
          </button>
        </Grid>
      </Grid>
      <form>
        <Grid container sx={{ border: 1 }}>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={4}>
            <TextField
              value={variationName}
              fullWidth
              label="Variation Name"
              placeholder="Variation Name"
              onChange={(e) => setVariationName(e.target.value)}
              id="variation"
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={4}>
            <TextField
              value={UPCNumber}
              fullWidth
              required
              label="UPC Number"
              placeholder="UPC Number"
              onChange={(e) => setUPCNumber(e.target.value)}
              id="UPCNumber"
            />
          </Grid>

          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={4}>
            <TextField
              value={vendorStyle}
              fullWidth
              label="Vendor Style"
              placeholder="Vendor Style"
              onChange={(e) => setVendorStyle(e.target.value)}
              id="vendorStyle"
            />
          </Grid>
          <Grid item sx={{ p: 2 }} lg={4}>
            <MultipleSelect
              categories={databaseCategories.categories}
              categoriesValue={categoriesInput}
              setCategories={setCategoriesInput}
            />
            <Button onClick={createCategory}>
              <Typography variant='body2'>New Category</Typography>
              <AddCircleIcon />
            </Button>
          </Grid>
          <Grid item sx={{ p: 2 }} lg={8}>
            <TextField
              value={description}
              multiline
              fullWidth
              minRows={4}
              label="Card Varient Description"
              placeholder="Card Varient Description"
              onChange={(e) => setDescription(e.target.value)}
              id="description"
            />
          </Grid>

          <Grid sx={{ p: 2 }} item xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">Barcode Image</Typography>
            </div>
            <TextField
              id="barcode"
              name="Barcode Image"
              type="file"
              onChange={(e) => {setBarcode(e.target.files);}}
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">Front Image</Typography>
            </div>
            <TextField
              id="front"
              type="file"
              onChange={(e) => {setFront(e.target.files);}}
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">Inside Image</Typography>
            </div>
            <TextField
              id="insideInsertion"
              type="file"
              onChange={(e) => {setInsideInsertion(e.target.files);}}
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">Insert Image</Typography>
            </div>
            <TextField
              id="insert"
              type="file"
              onChange={(e) => {setInsert(e.target.files);}}
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">Sticker Image</Typography>
            </div>
            <TextField
              id="sticker"
              type="file"
              onChange={(e) => {setSticker(e.target.files);}}
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">Sticker PDF</Typography>
            </div>
            <TextField
              id="stickerPdf"
              type="file"
              onChange={(e) => {setStickerPdf(e.target.files);}}
            />
          </Grid>

          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">TIFF File</Typography>
            </div>
            <TextField
              id="tiffFile"
              type="file"
              onChange={(e) => {setTIFFFile(e.target.files);}}
            />
          </Grid>

          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <div>
              <Typography variant="overline">AI File</Typography>
            </div>
            <TextField
              id="AIfile"
              type="file"
              onChange={(e) => {setAIFile(e.target.files);}}
            />
          </Grid>
        </Grid>
        <Grid sx={{ p: 3 }} container>
          <Grid item lg={6}></Grid>
          <Grid item lg={3}>
            <button className="pageButton" onClick={handleCancel}>
              <ArrowBackIos />
              Back
            </button>
          </Grid>
          <Grid item lg={3}>
            <button className="pageButton" onClick={handleSubmit}>
              Submit
            </button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
