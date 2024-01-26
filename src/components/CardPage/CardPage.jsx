import { useHistory } from "react-router-dom"
import CardList from "../CardList/CardList"

export default function CardPage(){
    const history = useHistory();

    return (
        <div className = 'container'>
            <button onClick = {() => history.push('/createCard')}>New Card</button>
            Card Page
            <CardList/>
        </div>
    )
}