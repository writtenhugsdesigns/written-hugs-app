import React, { useState } from 'react';
import { Button } from '@mui/material';
import PitchCard from '../PitchCard/PitchCard';
import './PitchCategory.css';
import { useDispatch, useSelector } from 'react-redux';

export default function PitchCategory({categoryContents}){
    const dispatch = useDispatch();
    const cart = useSelector(store => store.cartReducer.cart);

    const addCategoryToCart = () => {
        dispatch({
            type: 'ADD_CATEGORY_TO_CART',
            payload: categoryContents.cardsArray
        })
    }

    const removeCategoryFromCart = () => {
        
    }

    /**
     * @returns a boolean value indicating whether a specific card has been added
     *  to the pitch cart
     */
    const isInCart = (card) => {
        for(let object of cart){
            if(object.card_id == card.card_id){
                return true;
            }
        }
        return false;
    }

    return (
        <div className = 'pitchCategoryContainer'>
            <div className = 'pitchCategoryHeader'>
                <h2 className = 'pitchH2'>{categoryContents.category_name}</h2>
                <Button sx={{height: '3em', alignSelf: 'center'}} onClick={addCategoryToCart} variant='contained'>Add All</Button>
                <Button sx={{height: '3em', alignSelf: 'center'}} onClick={removeCategoryFromCart} color='error' variant='contained'>Remove All</Button>
            </div>
            <div className = 'categoryCardContainer'>
                {categoryContents.cardsArray.map((x) => {
                    return <PitchCard key={x.card_id} card={x} isInCart={isInCart}/>
                })
                }
            </div>
        </div>
    )
}