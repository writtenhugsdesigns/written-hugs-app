import Swal from "sweetalert2";
import { CardActions, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function EditFile({cardId, fileType, currentImageId, folderId}) {
    const dispatch = useDispatch();
    const currentEditingCard = useSelector((store) => (store.cardsReducer.editCurrentCard))
    
    const updateFileOnClick = async (action) => {
        action.preventDefault();
        const fileToSend = new FormData();
        const { value: file } = await Swal.fire({
            title: "Select new file",
            input: "file",
            showCancelButton: "true",

        })
      if(file){
        fileToSend.append(`${fileType}`, file)
        fileToSend.append("currentImageId", currentImageId)
        fileToSend.append("folderId", folderId)
        dispatch({
            type: "SAGA/EDIT_CARD_FILE",
            payload: 
            {fileToSend: fileToSend,
            cardId: cardId}
        })}
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
