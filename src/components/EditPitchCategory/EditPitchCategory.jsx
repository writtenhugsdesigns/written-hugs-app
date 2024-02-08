import React, { useState } from 'react';
import { Button } from '@mui/material';
import EditPitchCard from '../EditPitchCard/EditPitchCard';
import { useDispatch, useSelector } from 'react-redux';

export default function PitchCategory({categoryContents}){
    const dispatch = useDispatch();
    const edit = useSelector(store => store.editPitchReducer.editPitch);

    const addCategoryToEdit = () => {
        dispatch({
            type: 'ADD_CATEGORY_TO_EDIT',
            payload: categoryContents.cardsArray
        })
    }

    const removeCategoryFromEdit = () => {
        dispatch({
            type: 'REMOVE_CATEGORY_FROM_EDIT',
            payload: categoryContents.cardsArray
        })
    }

    /**
     * @returns a boolean value indicating whether a specific card has been added
     *  to the pitch cart
     */
    const isInCart = (card) => {
        for(let object of edit){
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
                <Button sx={{height: '3em', alignSelf: 'center'}} onClick={addCategoryToEdit} variant='contained'>Add All</Button>
                <Button sx={{height: '3em', alignSelf: 'center'}} onClick={removeCategoryFromEdit} color='error' variant='contained'>Remove All</Button>
            </div>
            <div className = 'categoryCardContainer'>
                {categoryContents.cardsArray.map((x) => {
                    return <EditPitchCard key={x.card_id} card={x} isInCart={isInCart}/>
                })
                }
            </div>
        </div>
    )
}