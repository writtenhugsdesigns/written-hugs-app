import { useHistory } from "react-router-dom";

export default function ReviewPitch(){
    const history = useHistory();

    // When user clicks the create pitch button, POST new pitch, then redirect user to view the pitch
    const handleCreate = () => {
        console.log("Will do something eventually");
    }

    return (
        <div className = 'container'>
            Review Pitch
            <button onClick = {() => history.push("/createPitch")}>Back</button>
            <button onClick = {handleCreate}>Create</button>
        </div>
    )
}