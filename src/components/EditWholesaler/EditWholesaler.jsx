import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";

export default function EditWholesaler({ handleClose }) {
  const currentWholesaler = useSelector(
    (store) => store.wholesalersReducer.currentWholesaler
  );
  const [wholesalerName, setWholesalerName] = useState(
    currentWholesaler.company_name
  );
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  /**
   * Dispatch to PUT wholesaler edits, then  alert success
   */
  async function editWholesaler() {
    await dispatch({
      type: "SAGA/EDIT_WHOLESALER",
      payload: { company_name: wholesalerName, id: currentWholesaler.id },
    });
    setShowAlert(true);
  }

  return (
    <div className="modalContainerSmall">
      <div className="smallModalBar">
        <div className="modalBack">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIos />}
            onClick={handleClose}
          >
            Back
          </Button>
        </div>
        <h1>Edit Wholesaler</h1>
      </div>

      {showAlert && (
        <Alert severity="success">Wholesaler successfully updated</Alert>
      )}
      <div className="smallModalForm">
        <form onSubmit={editWholesaler}>
          <input
            value={wholesalerName}
            onChange={(e) => setWholesalerName(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
