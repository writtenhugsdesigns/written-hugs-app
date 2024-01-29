import { useHistory } from "react-router-dom";
import { useState } from "react";

export default function CreateCard() {
  const history = useHistory();

  let [variationName, setVariationName] = useState("");
  let [UPCNumber, setUPCNumber] = useState("");
  let [vendorStyle, setVendorStyle] = useState("");

  // User hits submit button, POSTs a new card, redirects back to /cards
  const handleSubmit = () => {
    console.log("In handleSubmit");
    // Do the dispatch
    history.push("/cards");
  };

  return (
    <div className="container">
      <form>
        <input
          value={variationName}
          label="Variation Name"
          placeholder="Variation Name"
          onChange={() => setVariationName(event.target.value)}
        />
        <input
          value={UPCNumber}
          label="UPC Number"
          placeholder="UPC Number"
          onChange={() => setUPCNumber(event.target.value)}
        />
        <input
          value={vendorStyle}
          label="Vendor Style"
          placeholder="Vendor Style"
          onChange={() => setVendorStyle(event.target.value)}
        />
        <p>Select your favorite colors:</p>
        <input type="checkbox" name="color" value="red" id="c1" />
        <input type="checkbox" name="color" value="green" id="c2" />
        <input type="checkbox" name="color" value="blue" id="c3" />
        <p>
          <button id="btn">Get Selected Colors</button>
        </p>
        Create Card
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}
