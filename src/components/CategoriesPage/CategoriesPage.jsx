import { useHistory } from "react-router-dom";

export default function CategoriesPage(){
    const history = useHistory();

    return (
        <div className = 'container'>
            Categories
            <button onClick = {() => history.push("/createCategory")}>Add Category</button>
        </div>
    )
}