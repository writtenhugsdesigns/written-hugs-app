import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PitchCategory from "../PitchCategory/PitchCategory";
import './CreatePitchPage.css';

export default function CreatePitchPage({handleClose}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);
    const cartSize = useSelector(store => store.cartReducer.cart).length;

    useEffect(() => {
        dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
    }, []);

    useEffect(() => {
        dispatch({type: "GET_CART"});
    }, [cartSize])

    const toReview = () => {
        history.push("/reviewPitch");
    }

    return (
        <div className='container'>
            <div className='wholesalerBar'>
                <h1>Create New Pitch</h1>
                <button className='pageButton' onClick = {toReview}> 🛒 Review Pitch ({cartSize})</button>
            </div>
            {cardsByCategory.map((x, i) => {
                return <PitchCategory key={i} categoryContents={x}/>
            })}
        </div>
    )
}