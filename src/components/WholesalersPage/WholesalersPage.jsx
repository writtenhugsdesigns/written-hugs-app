import { useHistory } from "react-router-dom";
import WholesalersList from "../WholesalersList/WholesalersList";

export default function WholesalersPage(){
    const history = useHistory();

    return (
        <div className = 'container'>
            <button onClick = {() => history.push("/createWholesaler")}>Add Wholesaler</button>
            Wholesalers Page
            <WholesalersList/>
        </div>
    )
}