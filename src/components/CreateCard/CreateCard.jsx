import { useHistory } from "react-router-dom";
import { useState } from "react";

export default function CreateCard() {
  const history = useHistory();

  let [variationName, setVariationName] = useState("");
  let [UPCNumber, setUPCNumber] = useState("");
  let [vendorStyle, setVendorStyle] = useState("");

  const dummyCategories = [
    { id: 1, name: "goats" },
    { id: 2, name: "pikefish" },
    { id: 3, name: "stuck in placehold data" },
  ];

  const getCategories = () => {
    let checkboxes = document.querySelectorAll(
      'input[name="categories"]:checked'
    );
    let values = [];
    checkboxes.forEach((checkbox) => {
      values.push(checkbox.value);
    });
    console.log(values);
    return values;
  };

  // User hits submit button, POSTs a new card, redirects back to /cards
  const handleSubmit = (e) => {
    console.log("In handleSubmit");
    e.preventDefault();
    // Do the dispatch
    // history.push("/cards");
    console.log(variationName, UPCNumber, vendorStyle, getCategories());
  };

  return (
    <div className="container">
      <form>
        Variation Name
        <input
          value={variationName}
          label="Variation Name"
          placeholder="Variation Name"
          onChange={() => setVariationName(event.target.value)}
          id="variation"
        />
        <br></br>
        UPC Number
        <input
          value={UPCNumber}
          label="UPC Number"
          placeholder="UPC Number"
          onChange={() => setUPCNumber(event.target.value)}
          id="UPCNumber"
        />
        <br></br>
        Vendor Style
        <input
          value={vendorStyle}
          label="Vendor Style"
          placeholder="Vendor Style"
          onChange={() => setVendorStyle(event.target.value)}
          id="vendorStyle"
        />
        <p>Categories</p>
        {dummyCategories[0] &&
          dummyCategories.map((index) => {
            return (
              <div>
                {index.name}
                <input
                  type="checkbox"
                  name="categories"
                  value={index.name}
                  id={index.id}
                />
              </div>
            );
          })}
        Create Card
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}
