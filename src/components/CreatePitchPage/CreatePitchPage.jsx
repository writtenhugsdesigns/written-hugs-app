import { useHistory } from "react-router-dom"

export default function CreatePitchPage(){
    const history = useHistory();

    return (
        <div className = 'container'>
            Create Pitch Page
            <button onClick = {() => history.push("/reviewPitch")}>Create Pitch 🛒</button>
        </div>
    )
}