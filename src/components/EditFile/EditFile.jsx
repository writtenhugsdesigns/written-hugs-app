import Swal from "sweetalert2";

Swal;

export default function EditFile() {
  return (
    <CardActions>
      <IconButton
        aria-label="Edit Photo"
        onClick={(e) => updateFileOnClick(e)}
      >
        <EditIcon />
      </IconButton>
    </CardActions>
  );
}
