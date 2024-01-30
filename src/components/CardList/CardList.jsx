export default function CardList({ index }) {
  const viewIndex = () => {
    console.log("This will do pop up stuff Ig.");
  };

  const editIndex = () => {
    console.log("This will do pop up stuff for edit.");
  };

  const deleteIndex = () => {
    console.log("BEGONE THINGY WITH INDEX", index.id);
  };

  return (
    <tr>
      <td>{index.category}</td>
      <td>{index.inserted_at}</td>
      <td>{index.description}</td>
      <td>
        <button onClick={viewIndex}>View</button>
        <button onClick={editIndex}>Edit</button>
        <button onClick={deleteIndex}>Delete</button>
      </td>
    </tr>
  );
}
