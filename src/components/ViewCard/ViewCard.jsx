import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

export default function ViewCard() {
    const selectedCard = useSelector(store => store.cardsReducer.selectedCard);

    return (
        <div>
            {selectedCard.name}
            {selectedCard.description}
        </div>
    )
}