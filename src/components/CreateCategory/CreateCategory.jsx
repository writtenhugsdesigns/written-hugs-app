import { useHistory } from "react-router-dom"

export default function CreateCategory(){
    const history = useHistory();
    
    return (
        <div className = 'container'>
            Create Category
            <form>
                <input
                    placeholder = "Category name"
                />
                <button type = "reset" onClick = {() => history.push("/categories")}>Cancel</button>
                
            </form>
            <button onClick = {() => history.push("/categories")}>Back</button>
        </div>
    )
}