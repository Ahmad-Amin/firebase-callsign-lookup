import React, { useState } from "react";
import { db, collection, query, where, getDocs } from "../firebase";

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CallSignLookUpForm = () => {
  const [callsign, setCallsign] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const q = query(
        collection(db, "fcc_amateur_ahmad"),
        where("callsign", "==", callsign)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setResult(doc.data());
        });
      } else {
        setResult("No matching document found.");
      }
    } catch (error) {
      console.error("Error getting document:", error);
      setResult("Error fetching document.");
    }

    setLoading(false);
  };

  return (
    <div className=" flex items-center justify-center flex-col gap-2">
      <h1 className=" my-10 text-3xl font-semibold">Callsign Lookup</h1>
      <div className=" w-96">
        <form onSubmit={handleLookup} className=" flex flex-row gap-2 w-full mb-10">
          <input
            type="text"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            placeholder="Enter callsign ID#"
            className=" border border-gray-300 rounded-md px-3 py-2 flex-1"
            required
            disabled={loading}
          />
          <button
            className=" bg-blue-600 text-white px-3 py-2 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
        {result && (
          <div id="result">
            {typeof result === "string" ? (
              <p>{result}</p>
            ) : (
              <div>
                {Object.entries(result).map(([key, value]) => (
                  <div className=" w-full" key={key}>
                    <div className=" flex flex-row gap-2">
                      <p className=" w-32 font-semibold">{toTitleCase(key)}:</p>
                      <p> {value}</p>
                    </div>
                    <hr className=" my-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallSignLookUpForm;
