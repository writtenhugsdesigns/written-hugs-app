import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia
} from '@mui/material';
import './CreatePitchPage.css';

export default function CreatePitchPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);
    const newPitch = useSelector(store => store.pitches.newPitch);
    const [isHoveredId, setIsHoveredId] = useState('');

    useEffect(() => {
        dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
    }, []);

    const addButton = (card) => {
        dispatch({
            type: 'ADD_CARD_TO_PITCH',
            payload: card
        })
    }
    const removeButton = (card) => {
        dispatch({
            type: 'REMOVE_CARD_FROM_PITCH',
            payload: card
        })
    }
    const toReview = () => {
        history.push("/reviewPitch")
    }

    return (
        <div className='container'>
            Create Pitch Page
            <button onClick={toReview}>Create Pitch 🛒</button>
            <br /><br /><br />
            {cardsByCategory.map((category) => {
                return (
                    <>
                        <p>{category.category_name}</p>
                        {category.cardsArray.map((card) => {
                            return (
                                <div className="accordianRow">
                                    <Card
                                        sx={{ maxWidth: 345 }}
                                        variant="outlined"
                                        onMouseOver={() => setIsHoveredId(card.card_id)}
                                        onMouseOut={() => setIsHoveredId('')}>
                                        {isHoveredId == card.card_id ?
                                            <CardMedia
                                                component="img"
                                                alt={card.name}
                                                height="140"
                                                image={card.inner_img.display}
                                            />
                                            :
                                            <CardMedia
                                                component="img"
                                                alt={card.name}
                                                height="140"
                                                image={card.front_img.display}
                                            />
                                        }
                                        <CardContent>
                                            <p>{card.name}</p>
                                            <p>{card.description}</p>
                                        </CardContent>
                                        <CardActions>
                                            <Button onClick={()=>addButton(card)}>Add to pitch</Button>
                                            <Button onClick={()=>removeButton(card)}>Remove from pitch</Button>
                                            <Button>View Card</Button>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })}
                    </>
                )
            })}
        </div>
    )
}