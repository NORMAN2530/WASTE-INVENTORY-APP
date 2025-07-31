import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function App() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    type: "",
    code: "",
    quantity: "",
    dateGenerated: "",
    disposalDate: "",
    remarks: ""
  });

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEntries([...entries, newEntry]);
    setNewEntry({
      type: "",
      code: "",
      quantity: "",
      dateGenerated: "",
      disposalDate: "",
      remarks: ""
    });
  };

  const calculateDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.round((e - s) / (1000 * 60 * 60 * 24));
  };

  const exportToExcel = () => {
    const data = entries.map(entry => ({
      ...entry,
      storageDuration: calculateDays(entry.dateGenerated, entry.disposalDate)
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Waste Inventory");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Waste_Inventory.xlsx");
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Waste Inventory Calculation Table</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginBottom: "10px" }}>
        <input name="type" placeholder="Waste Type" value={newEntry.type} onChange={handleChange} />
        <input name="code" placeholder="Waste Code" value={newEntry.code} onChange={handleChange} />
        <input name="quantity" placeholder="Quantity (kg/L)" value={newEntry.quantity} onChange={handleChange} />
        <input type="date" name="dateGenerated" value={newEntry.dateGenerated} onChange={handleChange} />
        <input type="date" name="disposalDate" value={newEntry.disposalDate} onChange={handleChange} />
        <input name="remarks" placeholder="Remarks" value={newEntry.remarks} onChange={handleChange} />
      </div>
      <button onClick={handleAdd}>Add Entry</button>
      <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Code</th>
            <th>Quantity</th>
            <th>Date Generated</th>
            <th>Disposal Date</th>
            <th>Storage Duration (Days)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const days = calculateDays(entry.dateGenerated, entry.disposalDate);
            return (
              <tr key={index} style={{ backgroundColor: days > 180 ? "#f8d7da" : "transparent" }}>
                <td>{entry.type}</td>
                <td>{entry.code}</td>
                <td>{entry.quantity}</td>
                <td>{entry.dateGenerated}</td>
                <td>{entry.disposalDate}</td>
                <td>{days}</td>
                <td>{entry.remarks}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={exportToExcel} style={{ marginTop: "20px" }}>Export to Excel</button>
    </div>
  );
}

export default App;
