import { useHistory } from "react-router-dom"

export default function CreateWholesaler(){
    const history = useHistory();

    return (
        <div className = 'container'>
            Create Wholesaler
            <form>
                <input
                    placeholder = "Organization name"
                />
                <button type = "reset" onClick = {() => history.push("/wholesalers")}>Cancel</button>
                
            </form>
            <button onClick = {() => history.push("/wholesalers")}>Back</button>
        </div>
    )
}