import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function CardList({ card }) {
  const dispatch = useDispatch();

  const viewCard = () => {
    console.log("This will do pop up stuff Ig.");
  };

  const editCard = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deleteCard = () => {
    console.log("BEGONE THINGY WITH card", card.id);
  };

  return (
    <tr>
      <td>{card.category}</td>
      <td>{card.inserted_at}</td>
      <td>{card.description}</td>
      <td>
        <button onClick={viewCard}>View</button>
        <button onClick={editCard}>Edit</button>
        <button onClick={deleteCard}>Delete</button>
      </td>
    </tr>
  );
}
