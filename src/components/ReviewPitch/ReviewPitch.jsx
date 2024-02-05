import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function ReviewPitch(){
    const pitches = useSelector(store => store.pitches.pitches);
    const history = useHistory();

    // When user clicks the create pitch button, POST new pitch, then redirect user to view the pitch
    const handleCreate = () => {
        console.log("Will do something eventually");
        dispatch({
            type: "SAGA/POST_PITCH",
            payload: newPitch
        })
    }
    
console.log('pitches', pitches);
    return (
        <div className = 'container'>
            Review Pitch
            <button onClick = {() => history.push("/createPitch")}>Back</button>
            <button onClick = {handleCreate}>Create</button>
        </div>
    )
}