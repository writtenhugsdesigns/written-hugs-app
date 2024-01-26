import PitchList from "../PitchList/PitchList"
import { useHistory } from "react-router-dom"

export default function PitchPage(){
    const history = useHistory();

    return (
        <div className = 'container'>
            <button onClick = {() => history.push('/createPitch')}>New Pitch</button>
            Pitch Page
            <PitchList/>
        </div>
    )
}