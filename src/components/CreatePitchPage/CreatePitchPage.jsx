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
    const [isHoveredId, setIsHoveredId] = useState('');

    useEffect(() => {
        // dispatch({ type: "SAGA/FETCH_CATEGORIES" });
        dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
    }, []);

    return (
        <div className='container'>
            Create Pitch Page
            <button onClick={() => history.push("/reviewPitch")}>Create Pitch 🛒</button>
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
                                                image='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
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
                                            <Button>Add to pitch</Button>
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