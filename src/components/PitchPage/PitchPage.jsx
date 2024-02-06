import PitchList from "../PitchList/PitchList";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AddCircleOutline } from "@mui/icons-material";

export default function PitchPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
  }, []);

  return (
    <div className="container">
      <div className="wholesalerBar">
        <h1>Pitches</h1>
        <button className="pageButton" onClick={() => history.push('/createPitch')}>
          <AddCircleOutline />
          Create Pitch
        </button>
      </div>
      <PitchList />
    </div>
  );
}
