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
  CardContent,
  Card,
  CardActions,
  IconButton,
  Link,
} from "@mui/material";
import Swal from "sweetalert2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import MultipleSelect from "../MultiSelectCategories/MultiSelectCategories";
import { useParams } from "react-router-dom/";
import EditFile from "../EditFile/EditFile";

export default function EditCard() {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const [folderId, setFolderId] = useState("");

  useEffect(() => {
    // dispatch({
    //   type: "SET_CURRENT_CARD_TO_EDIT",
    //   payload: selectedCard,
    // });
    dispatch({
      type: "SAGA/GET_FOLDERS",
    });
  }, []);

  const databaseCategories = useSelector((store) => store.categoriesReducer);
  const selectedCard = useSelector((store) => store.cardsReducer.selectedCard);
  const cardToEdit = useSelector((store) => store.cardsReducer.editCurrentCard);
  const folderList = useSelector((store) => store.cardsReducer.currentFolders);
  const folderName = cardToEdit.vendor_style + " " + cardToEdit.name;

  const createCurrentCategories = (cardToEdit) => {
    let currentCategories = [];
    for (let category of cardToEdit.categories_array) {
      currentCategories.push(category.category_id);
    }
    return currentCategories;
  };
  const [categoryInput, setCategoryInput] = useState(
    createCurrentCategories(cardToEdit),
  );

  for (let folder of folderList) {
    if (folder.name === folderName && folderId === "") {
      setFolderId(folder.id);
    }
  }

  const handleVariationNameChange = (newName) => {
    dispatch({
      type: "VARIATION_NAME_CHANGE",
      payload: newName,
    });
  };

  const handleVariationUPCChange = (newUPC) => {
    dispatch({
      type: "VARIATION_NAME_CHANGE",
      payload: newUPC,
    });
  };

  const handleVariationDescriptionChange = (newDescription) => {
    dispatch({
      type: "VARIATION_DESCRIPTION_CHANGE",
      payload: newDescription,
    });
  };

  const handleVariationVendorStyleChange = (newVendorStyle) => {
    dispatch({
      type: "VARIATION_VENDOR_STYLE_CHANGE",
      payload: newVendorStyle,
    });
  };

  const handleVariationUpcChange = (newUpc) => {
    dispatch({
      type: "VARIATION_UPC_CHANGE",
      payload: newUpc,
    });
  };

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
  async function handleSubmit(e){
    e.preventDefault();
    await dispatch({
      type: "SAGA/EDIT_CARD",
      payload: {card: cardToEdit,
        categories_array_for_query: categoryInput}
    });
    // Do the dispatch
    history.push("/cards");
    // Clear fields
  };
  // Clears form inputs when user hits the clear button
  // const handleClear = (e) => {
  //   e.preventDefault();
  //   setUPCNumber(null);
  //   setVendorStyle(null);
  //   setDescription(null)
  // };

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
    Swal.fire({
      input: "text",
      inputLabel: "New Category Name",
      inputPlaceholder: "Type your cateory here",
      inputAttributes: {
        "aria-label": "Type your category here",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({
          type: "SAGA/POST_CATEGORY",
          payload: { name: result.value },
        });
      }
    });
  };
  const barcodeId = selectedCard.barcode.raw;
  console.log("this is the card to edit:", cardToEdit);

  //This form is divided using MUI Grid elements inside of a form div
  return (
    <div className="container">
      <Grid container sx={{ m: 3 }}>
        <Grid item lg={6}>
          <Typography variant="h2">Edit Card Variation</Typography>
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
              value={cardToEdit.name || ""}
              fullWidth
              disabled
              helperText="The variation name is not able to be edited because it is used to set the folder on google drive."
              label="Variation Name"
              onChange={(event) =>
                handleVariationNameChange(event.target.value)
              }
              id="variation"
            />
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={4}>
            <TextField
              value={cardToEdit.upc || ""}
              fullWidth
              required
              label="UPC Number"
              onChange={() => handleVariationUpcChange(event.target.value)}
              id="UPCNumber"
            />
          </Grid>

          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={4}>
            <TextField
              value={cardToEdit.vendor_style || ""}
              fullWidth
              disabled
              helperText="The vendor style is not able to be edited because it is used to set the folder on google drive."
              label="Vendor Style"
              onChange={() =>
                handleVariationVendorStyleChange(event.target.value)
              }
              id="vendorStyle"
            />
          </Grid>
          <Grid item sx={{ p: 2 }} lg={4}>
            <MultipleSelect
              categories={databaseCategories.categories}
              categoriesValue={categoryInput}
              setCategories={setCategoryInput}
            />
            <Button onClick={createCategory}>
              <Typography variant="body2">New Category</Typography>
              <AddCircleIcon />
            </Button>
          </Grid>
          <Grid item sx={{ p: 2 }} lg={8}>
            <TextField
              value={cardToEdit.description || ""}
              multiline
              fullWidth
              minRows={4}
              label="Card Varient Description"
              onChange={() =>
                handleVariationDescriptionChange(event.target.value)
              }
              id="description"
            />
          </Grid>

          <Grid sx={{ p: 2 }} item xs={12} md={6} lg={3}>
            <Card id="barcodeImage" sx={{ width: 200, height: 300 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">Barcode Image</Typography>
                </div>
                <img src={`${selectedCard.barcode.display}`} />
              </CardContent>
              <EditFile
                cardId={params}
                fileType="barcode"
                currentId={selectedCard.barcode.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card sx={{ width: 200, height: 300 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">Front Image</Typography>
                </div>
                <img src={`${selectedCard.front_img.display}`} />
              </CardContent>
              <EditFile
                cardId={params}
                fileType="front_img"
                currentId={selectedCard.front_img.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card sx={{ width: 200, height: 300 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">Inside Image</Typography>
                </div>
                <img src={`${selectedCard.inner_img.display}`} />
              </CardContent>
              <EditFile
                cardId={params.id}
                fileType="inner_img"
                currentId={selectedCard.inner_img.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card sx={{ width: 200, height: 300 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">Insert Image</Typography>
                </div>
                <img src={`${selectedCard.insert_img.display}`} />
              </CardContent>
              <EditFile
                cardId={params.id}
                fileType="insert_img"
                currentId={selectedCard.insert_img.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card sx={{ width: 200, height: 300 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">Sticker Image</Typography>
                </div>
                <img src={`${selectedCard.sticker_jpeg.display}`} />
              </CardContent>
              <EditFile
                cardId={params.id}
                fileType="sticker_jpeg"
                currentId={selectedCard.sticker_jpeg.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>
          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card sx={{ width: 200, height: 200 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">Sticker PDF</Typography>
                </div>
                <div>
                  <Link
                    target="_blank"
                    variant="h5"
                    href={`${selectedCard.sticker_pdf.display}`}
                  >
                    Link to Current File
                  </Link>
                </div>
              </CardContent>
              <EditFile
                cardId={params.id}
                fileType="sticker_pdf"
                currentId={selectedCard.sticker_pdf.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>

          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card sx={{ width: 200, height: 200 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">TIFF File</Typography>
                </div>
                <div>
                  <Link
                    target="_blank"
                    variant="h5"
                    href={`${selectedCard.front_tiff.display}`}
                  >
                    Link to Current File
                  </Link>
                </div>
              </CardContent>
              <EditFile
                cardId={params.id}
                fileType="front_tiff"
                currentId={selectedCard.front_tiff.raw}
                folderId={folderId}
              />
            </Card>
          </Grid>

          <Grid item sx={{ p: 2 }} xs={12} md={6} lg={3}>
            <Card id="insert_ai" sx={{ width: 200, height: 200 }}>
              <CardContent>
                <div>
                  <Typography variant="overline">AI File</Typography>
                </div>
                <div>
                  <Link
                    target="_blank"
                    variant="h5"
                    href={`${selectedCard.insert_ai.display}`}
                  >
                    Link to Current File
                  </Link>
                </div>
              </CardContent>
              <EditFile
                cardId={params.id}
                fileType="insert_ai"
                currentId={selectedCard.insert_ai.raw}
                folderId={folderId}
              />
            </Card>
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
