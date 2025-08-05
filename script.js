function loadData() {
  const savedWasteType = localStorage.getItem("wasteType");
  if (savedWasteType) {
    document.getElementById("wasteTypeSelect").value = savedWasteType;
  }

  const saved = localStorage.getItem("wasteData");
  if (saved) {
    const data = JSON.parse(saved);
    data.forEach((row) => addRow(row.gross, row.container));
  } else {
    addRow(); // default single row
  }
}

function saveWasteType() {
  const type = document.getElementById("wasteTypeSelect").value;
  localStorage.setItem("wasteType", type);
}

function addRow(gross = "", container = "") {
  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="index">0</td>
    <td><input type="number" step="any" value="${gross}" oninput="updateTotals()" /></td>
    <td><input type="number" step="any" value="${container}" oninput="updateTotals()" /></td>
    <td class="net">0</td>
    <td><button onclick="deleteRow(this)">🗑</button></td>
  `;

  tableBody.appendChild(row);
  updateIndexes();
  updateTotals();
}

function deleteRow(button) {
  button.closest("tr").remove();
  updateIndexes();
  updateTotals();
}

function updateIndexes() {
  const indexes = document.querySelectorAll("#tableBody .index");
  indexes.forEach((cell, i) => {
    cell.textContent = i + 1;
  });
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

function resetStorage() {
  if (confirm("Are you sure you want to reset all data?")) {
    localStorage.removeItem("wasteData");
    document.getElementById("tableBody").innerHTML = "";
    addRow();
    updateTotals();
  }
}

function saveAsImage() {
  html2canvas(document.getElementById("captureArea")).then(canvas => {
    const link = document.createElement("a");
    link.download = "waste-inventory.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  html2canvas(document.getElementById("captureArea")).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("waste-inventory.pdf");
  });
}

function closePopup() {
  document.getElementById("welcomePopup").style.display = "none";
}

window.onload = () => {
  loadData();
  document.getElementById("welcomePopup").style.display = "flex";
};
