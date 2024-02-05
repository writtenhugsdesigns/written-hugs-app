import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    Button
}
    from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CreatePitchPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardsByCategory = useSelector(store => store.cardsReducer.cardsListByCategory);

    useEffect(() => {
        // dispatch({ type: "SAGA/FETCH_CARDS" });
        dispatch({ type: "SAGA/FETCH_CARDS_BY_CATEGORY" });
    }, []);

    const categories =
        cardsByCategory.map((category) => {
            return category
        });

    function Category(props) {
        const { category } = props;
        return (
            <React.Fragment>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id={category.category_id}
                    >
                        {category.category_name}
                    </AccordionSummary>
                    <AccordionDetails>
                        <AccordionActions>
                            <Button>Add All to pitch</Button>
                        </AccordionActions>
                        {category.cardsArray.map((card) => {
                            return (
                                <>
                                    <p>{card.name}</p>
                                    <div className="imgPageContainer">
                                        <div className="imgLeft">
                                            <img className="frontImg" src={card.front_img.display} />
                                        </div>
                                        <div className="imgRight">
                                            <p>Inner Image:</p>
                                            <img src={card.inner_img.display} />
                                            <p>Insert Image:</p>
                                            <img src={card.insert_img.display} />
                                            <p>Sticker Image:</p>
                                            <img src={card.sticker_jpeg.display} />
                                        </div>
                                    </div>
                                    <AccordionActions>
                                        <Button>Add to pitch</Button>
                                        <Button>View Card</Button>
                                    </AccordionActions>
                                </>
                            )
                        })}
                    </AccordionDetails >
                </Accordion>
            </React.Fragment>
        )
    }

    return (
        <div className='container'>
            Create Pitch Page
            <button onClick={() => history.push("/reviewPitch")}>Create Pitch 🛒</button>
            <br /><br /><br />
            {categories.map((category) => (
                <Category key={category.category_id} category={category} />
            ))}
        </div>
    )
}
