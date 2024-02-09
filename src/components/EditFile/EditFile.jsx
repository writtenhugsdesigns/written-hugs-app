import Swal from "sweetalert2";

Swal;

export default function EditFile() {
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
