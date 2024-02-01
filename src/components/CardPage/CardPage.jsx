import { useHistory } from "react-router-dom";
import CardList from "../CardList/CardList";

export default function CardPage() {
  const history = useHistory();
  let dummyCards = [
    {
      id: 1,
      name: "goat",
      category: "Fake news / hardcoded data",
      description: "Fake hardcoded data about goats? NOOOOO",
      UPC: 111,
      SKU: 1111,
      barcode: 11111,
      front_img:
        "https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY",
      front_tiff:
        "https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY",
      inner_img: "https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY",
      insert_image: "https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY",
      insert_ai: "ai",
      raw_art: "Raw art woo",
      sticker_id: 1,
      inserted_at: "2024-01-29 14:29:04.5343-06",
      updated_at: "2024-01-29 14:29:04.5343-06",
    },
  ];

  return (
    <div className="container">
      <div className = 'wholesalerBar'>
        <h1>Card Variations</h1>
        <div className = 'buttonGroup'>
          <button className = 'pageButton' onClick = {() => history.push("/categories")}>Manage Categories</button>
          <button className = 'pageButton' onClick = {() => history.push("/createCard")}>New Card</button>
        </div>
      </div>
      
      <CardList/>
    </div>
  );
}
