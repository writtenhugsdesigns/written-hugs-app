import { useHistory } from "react-router-dom";
import CardList from "../CardList/CardList";
import { AddCircleOutline } from "@mui/icons-material";

export default function CardPage() {
  const history = useHistory();
  
  return (
    <div className="container">
      <div className = 'wholesalerBar'>
        <h1>Card Variations</h1>
        <div className = 'buttonGroup'>
          <button className = 'pageButton' onClick = {() => history.push("/categories")}>Manage Categories</button>
          <button className = 'pageButton' onClick = {() => history.push("/createCard")}><AddCircleOutline/>New Card</button>
        </div>
      </div>
      <CardList/>
    </div>
  );
}
