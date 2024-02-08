import { useSelector, useDispatch } from "react-redux";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import EditPitchCategory from "../EditPitchCategory/EditPitchCategory";

export default function EditPitch() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const pitches = useSelector((store) => store.pitches.pitches);
  const cardsByCategory = useSelector(
    (store) => store.cardsReducer.cardsListByCategory
  );
  const currentPitch = useSelector(
    (store) => store.editPitchReducer.selectedPitch
  );
  const wholesalers = useSelector(
    (store) => store.wholesalersReducer.wholesalers
  );

  const [pitchName, setPitchName] = useState(currentPitch.name);
  const [pitchDescription, setPitchDescription] = useState(
    currentPitch.description
  );
  const [wholesalerID, setWholesalerID] = useState(currentPitch.wholesaler_id);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
    dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
    dispatch({ type: "SAGA/FETCH_WHOLESALERS" });
  }, []);

  const selectedPitch = pitches.filter(
    (individualPitch) => individualPitch.pitches_id == id
  );

  if (
    selectedPitch[0] &&
    selectedPitch[0].pitches_id != currentPitch.pitches_id
  ) {
    dispatch({ type: "SET_EDIT_CART", payload: selectedPitch[0].cards });
    dispatch({ type: "SET_SELECTED_PITCH", payload: selectedPitch[0] });
  }

  const savePitch = () => {
    console.log("Save our souls!", selectedPitch);
  };

  const displayFunction = (display, defaultDisplay) => {
    if (typeof display === "string") {
      return display;
    } else if (selectedPitch[0]) {
      return defaultDisplay;
    }
  };

  const handeWholesalerChange = (e) => {
    setWholesalerID(e.target.value);
  };

  return (
    <div className="container">
      <div className="wholesalerBar">
        <h1>Edit Pitch</h1>
        <button className="pageButton" onClick={savePitch}>
          {" "}
          Save Pitch (#)
        </button>
      </div>
      <div className="wholesalerBar">
        <p>
          Name:{" "}
          <input
            onChange={() => setPitchName(() => event.target.value)}
            value={
              selectedPitch[0] &&
              displayFunction(pitchName, selectedPitch[0].name)
            }
          ></input>
        </p>
        <p>
          Description:{" "}
          <input
            onChange={() => setPitchDescription(() => event.target.value)}
            value={
              selectedPitch[0] &&
              displayFunction(pitchDescription, selectedPitch[0].description)
            }
          ></input>
        </p>
        <p>
          Wholesaler:{" "}
          <select
            value={
              wholesalerID ||
              (selectedPitch[0] && selectedPitch[0].wholesaler_id)
            }
            onChange={handeWholesalerChange}
          >
            {wholesalers.map((wholesaler) => {
              return (
                <option value={wholesaler.id}>{wholesaler.company_name}</option>
              );
            })}
          </select>
        </p>
        <button className="pageButton">Set Current</button>
      </div>
      {cardsByCategory.map((x, i) => {
        return <EditPitchCategory key={i} categoryContents={x} />;
      })}
    </div>
  );
}
