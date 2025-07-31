import React, { useState, useEffect } from "react";

function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [{ gross: "", container: "" }];
  });

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { gross: "", container: "" }]);
  };

  const total = entries.reduce(
    (acc, { gross, container }) => {
      const g = parseFloat(gross) || 0;
      const c = parseFloat(container) || 0;
      acc.gross += g;
      acc.container += c;
      acc.net += g - c;
      return acc;
    },
    { gross: 0, container: 0, net: 0 }
  );

  return (
    <div className="container">
      <h1>Net Waste Calculator</h1>
      <p>Created by Norman Azim</p>
      {entries.map((entry, index) => (
        <div key={index}>
          <label>Gross Weight (kg):</label>
          <input
            type="number"
            value={entry.gross}
            onChange={(e) => handleChange(index, "gross", e.target.value)}
          />
          <label>Container Weight (kg):</label>
          <input
            type="number"
            value={entry.container}
            onChange={(e) => handleChange(index, "container", e.target.value)}
          />
          <p>Net Weight: {(parseFloat(entry.gross || 0) - parseFloat(entry.container || 0)).toFixed(2)} kg</p>
          <hr />
        </div>
      ))}
      <button onClick={addEntry}>Add Entry</button>
      <h2>Total Summary</h2>
      <p>Total Gross: {total.gross.toFixed(2)} kg</p>
      <p>Total Container: {total.container.toFixed(2)} kg</p>
      <p>Total Net: {total.net.toFixed(2)} kg</p>
    </div>
  );
}

export default App;