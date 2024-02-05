import { useState } from "react";
import { Button, Alert } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { useDispatch } from "react-redux";

export default function CreateWholesaler({ handleClose }) {
    let [wholesalerName, setWholesalerName] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();

    // User hits submit button, POSTs a new wholesaler, alerts success
    async function handleSubmit(e){
        e.preventDefault();
        await dispatch({
            type: 'SAGA/POST_WHOLESALER',
            payload: {company_name: wholesalerName}
        })
        setShowAlert(true);
        setWholesalerName('')
    };

    return (
        <div className='modalContainerSmall'>
            <div className = 'smallModalBar'>
                <div className = 'modalBack'>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIos />}
                        onClick={handleClose}
                    >
                        Back
                    </Button>
                </div>
                <h1>Add Wholesaler</h1>
            </div>

            {showAlert && <Alert severity='success'>Wholesaler successfully added</Alert>}
            <div className = 'smallModalForm'>
                <form>
                    <input
                        value={wholesalerName}
                        label="Wholesaler Name"
                        placeholder="Wholesaler Name"
                        onChange={(event) => setWholesalerName(event.target.value)}
                        id="wholesaler"
                    />
                    <Button variant='contained' type="submit" onClick={handleSubmit}>Add Wholesaler</Button>
                </form>
            </div>
        </div>
    )
}