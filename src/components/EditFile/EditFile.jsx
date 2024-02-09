import Swal from "sweetalert2";
import { CardActions, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function EditFile(event, fileid) {

  const functi  
  return (
    <CardActions>
      <IconButton
        aria-label="Edit Photo"
        onClick={() => updateFileOnClick(event)}
      >
        <EditIcon />
      </IconButton>
    </CardActions>
  );
}
