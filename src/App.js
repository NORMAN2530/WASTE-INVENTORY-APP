import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";

function App() {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("wasteData");
    return saved ? JSON.parse(saved) : [{ gross: "", tare: "" }];
  });

  useEffect(() => {
    localStorage.setItem("wasteData", JSON.stringify(rows));
  }, [rows]);

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { gross: "", tare: "" }]);
  };

  const totalGross = rows.reduce((sum, row) => sum + parseFloat(row.gross || 0), 0);
  const totalTare = rows.reduce((sum, row) => sum + parseFloat(row.tare || 0), 0);
  const totalNet = totalGross - totalTare;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img src={logo} alt="HICOM Logo" style={{ width: "80px", marginRight: "20px" }} />
        <h1>Net Waste Calculator</h1>
      </header>

      <table width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Gross Weight (kg)</th>
            <th>Container (Tare) Weight (kg)</th>
            <th>Net Waste (kg)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const net = parseFloat(row.gross || 0) - parseFloat(row.tare || 0);
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="number"
                    value={row.gross}
                    onChange={(e) => handleChange(index, "gross", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.tare}
                    onChange={(e) => handleChange(index, "tare", e.target.value)}
                  />
                </td>
                <td>{isNaN(net) ? "" : net.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="1">Total</td>
            <td>{totalGross.toFixed(2)} kg</td>
            <td>{totalTare.toFixed(2)} kg</td>
            <td>{totalNet.toFixed(2)} kg</td>
          </tr>
        </tfoot>
      </table>

      <button onClick={addRow} style={{ marginTop: "20px", padding: "10px 20px", background: "#1b6ca8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        + Add Row
      </button>

      <footer style={{ marginTop: "40px", fontSize: "14px", textAlign: "center", color: "#a9bcd0" }}>
        Created by Norman Azim • HICOM Diecasting Sdn. Bhd.
      </footer>
    </div>
  );
}

export default App;
