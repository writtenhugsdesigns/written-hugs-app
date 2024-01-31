import React, { useState, useEffect } from "react";
import CategoriesList from "../CategoriesList/CategoriesList";
import { useHistory } from "react-router-dom";

export default function CategoriesPage(){
    const history = useHistory();
    
    return (
        <div className = 'container'>
            <div className = 'wholesalerBar'>
                <h1>Card Categories</h1>
                <button className = 'pageButton' onClick = {() => history.push("/createCategory")}>Add Category</button>
            </div>
            <CategoriesList/>
        </div>
    )
}