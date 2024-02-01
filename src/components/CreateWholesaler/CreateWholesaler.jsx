import { useHistory } from "react-router-dom"
import { useState } from "react";

export default function CreateWholesaler({ handleClose }) {
    const history = useHistory();
    let [wholesalerName, setWholesalerName] = useState('');

    // User hits submit button, POSTs a new wholesaler, closes modal
    const handleSubmit = (e) => {
        console.log("In handleSubmit");
        e.preventDefault();
        // Do the dispatch
        handleClose()
        setWholesalerName('')
        console.log(
            wholesalerName,
        );
    };

    return (
        <div className='container'>
            Create Wholesaler
            <form>
                <input
                    value={wholesalerName}
                    label="Wholesaler Name"
                    placeholder="Wholesaler Name"
                    onChange={() => setWholesalerName(event.target.value)}
                    id="wholesaler"
                />
                <button type="reset" onClick={handleSubmit}>Add Wholesaler</button>
                <button type="reset" onClick={handleClose}>Back</button>
            </form>
        </div>
    )
}