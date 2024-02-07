import React, { useState,  useEffect } from "react"
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export default function PitchCard({card}){

    const [isHoveredID, setIsHoveredID] = useState('');
    const dispatch = useDispatch();
    const cart = useSelector(store => store.cartReducer.cart);

    useEffect(() => {
        dispatch({type: 'GET_CART'});
    }, []);

    const removeCardFromCart = () => { 
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: card
        })
    }

    const addCardToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: card
        })
    }

    /**
     * 
     * @returns a boolean value indicating whether a specific card has been added
     * to the pitch cart
     */
    const isInCart = () => {
        for(let object of cart){
            if(object.card_id == card.card_id){
                return true;
            }
        }
        return false;
    }

    return (
        <Card sx={{height: '25em', width: '15em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <CardMedia
                height='20em'
                onMouseOver={() => setIsHoveredID(card.card_id)}
                onMouseOut={() => setIsHoveredID('')}
            >
                {isHoveredID == '' ?
                    <img height={'200'} src={`${card.front_img.display}`}/>
                    :
                    <img height={'200'} src={`${card.inner_img.display}`}/>
                }
                
            </CardMedia>
            <CardContent>
                <Typography sx={{textAlign: 'center'}} gutterBottom variant='h5' component='div'>
                    {card.name}
                </Typography>
                <Typography sx={{overflowY: 'auto', height: '4em'}}variant='body2' color='text.secondary'>
                    {card.description}
                </Typography>
            </CardContent>
            <CardActions sx={{marginTop: 'auto', marginBottom: '3px', justifyContent: 'center'}}>
                <Button variant='outlined' size='medium'>View</Button>
                {!isInCart() && 
                    <Button variant='contained' size='medium' onClick={addCardToCart}>Add</Button>
                }
                {isInCart() &&
                    <Button variant='contained' color='error' onClick={removeCardFromCart}>Remove</Button>
                }
            </CardActions>
        </Card>
    )
}