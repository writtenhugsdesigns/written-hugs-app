import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import './EditCategory.css';

export default function EditCategory({handleClose}){
    const currentCategory = useSelector(store => store.categoriesReducer.currentCategory);
    const [categoryName, setCategoryName] = useState(currentCategory.name);
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();

    async function editCategory(){
        await dispatch({
            type: 'SAGA/EDIT_CATEGORY',
            payload: {name: categoryName, id: currentCategory.id}
        })
        setShowAlert(true);
    }
    
    return (
        <div className = 'modalContainerSmall'>
            <div className = 'smallModalBar'>
                <div className = 'modalBack'>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIos />}
                        onClick={handleClose}
                    >
                        Back
                    </Button>
                </div>
                <h1>Edit Category</h1>
            </div>
            
            {showAlert && <Alert severity='success'>Category successfully updated</Alert>}
            <div className = 'smallModalForm'>
                <form onSubmit = {() => editCategory()}>
                    <input
                        value = {categoryName}
                        onChange = {(e) => setCategoryName(e.target.value)}
                    />
                    <Button variant='contained' type='submit'>Submit</Button>
                </form>
            </div>
        </div>
    )
}