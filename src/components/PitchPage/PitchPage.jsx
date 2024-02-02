import PitchList from "../PitchList/PitchList";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PitchPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" }, []);
  });

  return (
    <div className="container">
      <button onClick={() => history.push("/createPitch")}>New Pitch</button>
      Pitch Page
      <PitchList />
    </div>
  );
}
