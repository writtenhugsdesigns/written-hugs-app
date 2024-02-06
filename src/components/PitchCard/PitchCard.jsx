import React, { useState } from "react"
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material"

export default function PitchCard({card}){

    const [addToggle, setAddToggle] = useState(true);
    const [isHoveredID, setIsHoveredID] = useState('');

    /**
     * Toggle the add button depending on if the card is in the cart or not
     * @param {*} e 
     */
    const handleToggle = (e) => {
        e.preventDefault();
        if(addToggle){
            // Add the card to the cart
            addCardToCart();
        } else {
            // Remove card from cart
            removeCardFromCart();
        }
        setAddToggle(!addToggle);
    }

    const removeCardFromCart = () => { 

    }

    const addCardToCart = () => {

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
                {addToggle && 
                    <Button variant='contained' size='medium' onClick={handleToggle}>Add</Button>
                }
                {!addToggle &&
                    <Button variant='contained' color='error' onClick={handleToggle}>Remove</Button>
                }
            </CardActions>
        </Card>
    )
}