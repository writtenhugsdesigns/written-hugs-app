import { useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function EditPitch() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const pitches = useSelector((store) => store.pitches.pitches);

  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
  }, []);

  const selectedPitch = pitches.filter(
    (individualPitch) => individualPitch.pitches_id == id
  );

  return (
    <div>
      <p>
        hi to the pitch description of{" "}
        {selectedPitch[0] && selectedPitch[0].description}
      </p>
    </div>
  );
}
