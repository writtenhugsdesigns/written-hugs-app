import Swal from "sweetalert2";
import { CardActions, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function EditFile({fileType, currentId, folderName}) {
    const dispatch = useDispatch();
    const currentEditingCard = useSelector((store) => (store.cardsReducer.editCurrentCard))
    console.log(currentEditingCard);
    
    const updateFileOnClick = (action) => {
        action.preventDefault();
        const fileToSend = new FormData();
        const { value: file } = Swal.fire({
            title: "Select new file",
            input: "file",
            inputAttributes: {
            "accept": "image/*",
            "aria-label": "Upload your updated file"
            }
        });
        fileToSend.append(`${fileType}`, file)
        fileToSend.append("currentId", currentId)
        fileToSend.append("folderName", folderName)
        fileToSend.append("cardID", currentEditingCard.card_id)
        dispatch({
            type: "SAGA/EDIT_CARD_FILE",
            payload: fileToSend
        })
    }

  return (
    <CardActions>
      <IconButton
        onClick={() => updateFileOnClick(event)}
      >
        <EditIcon />
      </IconButton>
    </CardActions>
  );
}
