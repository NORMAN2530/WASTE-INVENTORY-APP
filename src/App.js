import React, { useState } from "react";

function App() {
  const initialRows = Array.from({ length: 20 }, (_, i) => ({
    containerNo: i + 1,
    gross: "",
    tare: "",
  }));

  const [rows, setRows] = useState(initialRows);

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const totalNet = rows.reduce((sum, row) => {
    const net = parseFloat(row.gross || 0) - parseFloat(row.tare || 0);
    return sum + (isNaN(net) ? 0 : net);
  }, 0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h2>Net Waste Calculator</h2>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Container No</th>
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
                <td>{row.containerNo}</td>
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
            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>Total Net Waste:</td>
            <td style={{ fontWeight: "bold" }}>{totalNet.toFixed(2)} kg</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
