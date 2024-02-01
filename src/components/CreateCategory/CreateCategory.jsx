import { useState } from "react";

export default function CreateCategory({handleClose}){
    let [categoryName, setCategoryName] = useState('');

    // User hits submit button, POSTs a new category, closes modal
    const handleSubmit = (e) => {
        console.log("In handleSubmit");
        e.preventDefault();
        // Do the dispatch
        handleClose()
        setCategoryName('')
        console.log(
            categoryName,
        );
    };

    return (
        <div className='container'>
            Create Category
            <form>
                <input
                    value={categoryName}
                    label="Category Name"
                    placeholder="Category Name"
                    onChange={() => setCategoryName(event.target.value)}
                    id="category"
                />
                <button type="reset" onClick={handleSubmit}>Add Category</button>
                <button type="reset" onClick={handleClose}>Back</button>
            </form>
        </div>
    )
}