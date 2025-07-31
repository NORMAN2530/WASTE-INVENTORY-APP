function loadData() {
  const saved = localStorage.getItem("wasteData");
  if (saved) {
    const data = JSON.parse(saved);
    data.forEach((row, index) => addRow(row.gross, row.container));
  } else {
    addRow(); // default single row
  }
}

function addRow(gross = "", container = "") {
  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  const index = tableBody.rows.length + 1;

  row.innerHTML = `
    <td>${index}</td>
    <td><input type="number" step="any" value="${gross}" oninput="updateTotals()" /></td>
    <td><input type="number" step="any" value="${container}" oninput="updateTotals()" /></td>
    <td class="net">0</td>
    <td><button onclick="deleteRow(this)">🗑</button></td>
  `;

  tableBody.appendChild(row);
  updateTotals();
}

function deleteRow(button) {
  button.closest("tr").remove();
  updateTotals();
}

function updateTotals() {
  const rows = document.querySelectorAll("#tableBody tr");
  let totalGross = 0;
  let totalContainer = 0;
  let totalNet = 0;

  const dataToSave = [];

  rows.forEach(row => {
    const grossInput = row.cells[1].querySelector("input");
    const containerInput = row.cells[2].querySelector("input");
    const netCell = row.cells[3];

    const gross = parseFloat(grossInput.value) || 0;
    const container = parseFloat(containerInput.value) || 0;
    const net = gross - container;

    totalGross += gross;
    totalContainer += container;
    totalNet += net;

    netCell.textContent = net.toFixed(2);

    dataToSave.push({
      gross: grossInput.value,
      container: containerInput.value
    });
  });

  document.getElementById("totalGross").textContent = totalGross.toFixed(2);
  document.getElementById("totalContainer").textContent = totalContainer.toFixed(2);
  document.getElementById("totalNet").textContent = totalNet.toFixed(2);

  localStorage.setItem("wasteData", JSON.stringify(dataToSave));
}

window.onload = loadData;
