import React from 'react';
import { useSelector } from 'react-redux';

export default function ViewCard({handleClose}) {
    const selectedCard = useSelector(store => store.cardsReducer.selectedCard);

    const editCardText = () => {
        console.log("This will do pop up stuff for edit.");
    };

    const editCardFiles = () => {
        console.log("This will do pop up stuff for edit.");
    };

    const deleteCard = () => {
        console.log("BEGONE THINGY WITH card", selectedCard.id);
    };

    return (
        <div className="container">
            <h2>Name: {selectedCard.name}</h2>
            <p>Description: {selectedCard.description}</p>
            <p>Front Image:</p><img src={selectedCard.front_img} />
            <p>Front Tiff:</p><img src={selectedCard.front_tiff} />
            <p>Inner Image:</p><img src={selectedCard.inner_img} />
            <p>Insert Image:</p><img src={selectedCard.insert_image} />
            <button onClick={editCardText}>Edit Card Text</button>
            <button onClick={editCardFiles}>Edit Card Files</button>
            <button onClick={deleteCard}>Delete</button>
            <button onClick={handleClose}>Back</button>
        </div>
    )
}