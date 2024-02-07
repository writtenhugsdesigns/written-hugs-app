import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import PitchCategory from "../PitchCategory/PitchCategory";

export default function EditPitch() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const pitches = useSelector((store) => store.pitches.pitches);
  const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);


  useEffect(() => {
    dispatch({ type: "SAGA/FETCH_PITCHES" });
    dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
  }, []);

  const selectedPitch = pitches.filter(
    (individualPitch) => individualPitch.pitches_id == id
  );

  console.log(selectedPitch)

  return (
    <div className='container'>
      <div className='wholesalerBar'>
        <h1>Edit Pitch</h1>
        <button className='pageButton' onClick={() => history.push("/reviewPitch")}> 🛒 Review Pitch (#)</button>
      </div>
      {cardsByCategory.map((x, i) => {
                return <PitchCategory key={i} categoryContents={x}/>
            })}
    </div>
  );
}
