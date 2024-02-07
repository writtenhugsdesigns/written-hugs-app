import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBackIos } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  Icon,
} from "@mui/material";
import { green } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import MultipleSelect from "../MultiSelectCategories/MultiSelectCategories";
import { useParams } from "react-router-dom/";

export default function EditCard() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const newCardToSend = new FormData();
    const [newCategory, setNewCategory] = useState("");
  
    //This use effect triggers the saga "getCurrentFolders"
    //After this is triggered a useSelector will get the current folders array
    //and save it in a local array
    useEffect(() => {
        dispatch({
        type: "SAGA/FETCH_CATEGORIES",
        });
        dispatch({
            type: "SAGA/FETCH_CARD",
            payload: params.id
        })
    }, []);

    const databaseCategories = useSelector((store) => store.categoriesReducer);
    const selectedCard = useSelector((store) => store.selectedCard);
    console.log("this is the current selected card object:", selectedCard);
  
    let [variationName, setVariationName] = useState(null);
    let [UPCNumber, setUPCNumber] = useState("");
    let [vendorStyle, setVendorStyle] = useState(null);
    let [description, setDescription] = useState(null);
    let [barcode, setBarcode] = useState([]);
    let [front, setFront] = useState([]);
    let [insideInsertion, setInsideInsertion] = useState([]);
    let [insert, setInsert] = useState([]);
    let [sticker, setSticker] = useState([]);
    let [TIFFFile, setTIFFFile] = useState([]);
    let [AIFile, setAIFile] = useState([]);
    let [categoriesInput, setCategoriesInput] = useState([]);
  
    const folderName = vendorStyle + " " + variationName;
    /**
     * Get  the user selected category ids
     * @returns an array of the ids of the checked categories
     */
    // const getCategories = () => {
    //   let checkboxes = document.querySelectorAll(
    //     'input[name="categories"]:checked'
    //   );
    //   let values = [];
    //   checkboxes.forEach((checkbox) => {
    //     values.push(checkbox.value);
    //   });
    //   return values;
    // };
  
    // User hits submit button, checks if the variant name matches current folders in google drive,
    //POSTs a new card, redirects back to /cards
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
        console.log("categories array:", categoriesInput);
        // Do the dispatch
        history.push("/cards");
      }
      // Clear fields
      handleClear(e);
    };
  
    // Clears form inputs when user hits the clear button
    const handleClear = (e) => {
      e.preventDefault();
      setVariationName(null);
      setUPCNumber(null);
      setVendorStyle(null);
    };
  
    //This function verifies a users desire to leave the page, and lose information
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
  
    //Still under development, used to create a new category
    const createCategory = () => {
      const inputValue = "";
      Swal.fire({
        input: "text",
        inputLabel: "New Category Name",
        inputPlaceholder: "Type your cateory here",
        inputValue,
        inputAttributes: {
          "aria-label": "Type your category here",
        },
        showCancelButton: true,
        confirmButtonText: "Submit",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(inputValue);
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
                onChange={() => setVariationName(event.target.value)}
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
                onChange={() => setUPCNumber(event.target.value)}
                id="UPCNumber"
              />
            </Grid>
  
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={4}>
              <TextField
                value={vendorStyle}
                fullWidth
                label="Vendor Style"
                placeholder="Vendor Style"
                onChange={() => setVendorStyle(event.target.value)}
                id="vendorStyle"
              />
            </Grid>
            <Grid item sx={{ p: 2 }} lg={4}>
              <MultipleSelect
                categories={databaseCategories.categories}
                categoriesValue={categoriesInput}
                setCategories={setCategoriesInput}
              />
              {/* <Button onClick={createCategory}>
              <Typography variant='body2'>New Category</Typography>
              <AddCircleIcon/>
              </Button> */}
            </Grid>
            <Grid item sx={{ p: 2 }} lg={8}>
              <TextField
                value={description}
                multiline
                fullWidth
                minRows={4}
                label="Card Varient Description"
                placeholder="Card Varient Description"
                onChange={() => setDescription(event.target.value)}
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
                onChange={() => {
                  setBarcode(event.target.files);
                }}
              />
            </Grid>
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">Front Image</Typography>
              </div>
              <TextField
                id="front"
                type="file"
                onChange={() => {
                  setFront(event.target.files);
                }}
              />
            </Grid>
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">Inside Image</Typography>
              </div>
              <TextField
                id="insideInsertion"
                type="file"
                onChange={() => {
                  setInsideInsertion(event.target.files);
                }}
              />
            </Grid>
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">Insert Image</Typography>
              </div>
              <TextField
                id="insert"
                type="file"
                onChange={() => {
                  setInsert(event.target.files);
                }}
              />
            </Grid>
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">Sticker Image</Typography>
              </div>
              <TextField
                id="sticker"
                type="file"
                onChange={() => {
                  setSticker(event.target.files);
                }}
              />
            </Grid>
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">Sticker PDF</Typography>
              </div>
              <TextField
                id="stickerPdf"
                type="file"
                onChange={() => {
                  setStickerPdf(event.target.files);
                }}
              />
            </Grid>
  
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">TIFF File</Typography>
              </div>
              <TextField
                id="tiffFile"
                type="file"
                onChange={() => {
                  setTIFFFile(event.target.files);
                }}
              />
            </Grid>
  
            <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
              <div>
                <Typography variant="overline">AI File</Typography>
              </div>
              <TextField
                id="AIfile"
                type="file"
                onChange={() => {
                  setAIFile(event.target.files);
                }}
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
  };
