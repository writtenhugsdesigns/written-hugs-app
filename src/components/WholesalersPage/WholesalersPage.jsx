import { useHistory } from "react-router-dom";
import WholesalersList from "../WholesalersList/WholesalersList";
import './WholesalersPage.css';

export default function WholesalersPage(){
    const history = useHistory();

    

    return (
        <div className = 'container'>
            <div className = 'wholesalerBar'>
                <h1>Wholesalers</h1>
                <button className = 'pageButton' onClick = {() => history.push("/createWholesaler")}>Add Wholesaler</button>
            </div>
            
            <WholesalersList/>
        </div>
    )
}