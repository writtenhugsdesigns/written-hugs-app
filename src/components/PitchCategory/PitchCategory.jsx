import React, { useState } from 'react';
import { Button } from '@mui/material';
import PitchCard from '../PitchCard/PitchCard';
import './PitchCategory.css';

export default function PitchCategory({categoryContents}){

    const [addToggle, setAddToggle] = useState(true);

    const handleToggle = (e) => {
        e.preventDefault();
        if(addToggle){
            console.log("Adding all")
        } else {
            console.log("Removing all");
        }
        setAddToggle(!addToggle);
    }

    return (
        <div className = 'pitchCategoryContainer'>
            <div className = 'pitchCategoryHeader'>
                <h2 className = 'pitchH2'>{categoryContents.category_name}</h2>
                {addToggle && 
                    <Button sx={{height: '3em', alignSelf: 'center'}} onClick={handleToggle} variant='contained'>Add All</Button>
                }
                {!addToggle &&
                    <Button sx={{height: '3em', alignSelf: 'center'}} onClick={handleToggle} color='error' variant='contained'>Remove All</Button>
                }
            </div>
            <div className = 'categoryCardContainer'>
                {categoryContents.cardsArray.map((x) => {
                    return <PitchCard key={x.card_id} card={x}/>
                })
                }
            </div>
        </div>
    )
}