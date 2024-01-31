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
        "https://drive.google.com/file/d/1w82PH57o43XCZt87nxZS3OHikUzkfkBV/view?usp=sharing",
      front_tiff:
        "https://drive.google.com/file/d/1dwMYyhnjNdhXUu30PmmHKN1be243VDlZ/view?usp=sharing",
      inner_img: "ee",
      insert_image: "dummy data",
      insert_ai:
        "https://drive.google.com/file/d/1OgZMW-bqU2igOazlL6vhQ6r1qOBrysQ4/view?usp=sharing",
      raw_art: "Raw art woo",
      sticker_id: 1,
      inserted_at: "2024-01-29 14:29:04.5343-06",
      updated_at: "2024-01-29 14:29:04.5343-06",
    },
  ];

  return (
    <div className="container">
      <button onClick = {() => history.push("/categories")}>Manage Categories</button>
      <button onClick={() => history.push("/createCard")}>New Card</button>
      Card Page
      <tr>
        <th>Variation Name</th>
        <th>Date</th>
        <th>Description</th>
      </tr>
      {dummyCards[0] &&
        dummyCards.map((card) => {
          return <CardList card={card} />;
        })}
    </div>
  );
}
