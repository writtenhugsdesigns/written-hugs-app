import { useHistory } from "react-router-dom"

export default function CreateCard(){
    const history = useHistory();

    // User hits submit button, POSTs a new card, redirects back to /cards
    const handleSubmit = () => {
        console.log("In handleSubmit");
        // Do the dispatch
        history.push("/cards");
    }

    return (
        <div className = 'container'>
            Create Card
            <button onClick = {handleSubmit}>Submit</button>
        </div>
    )
}