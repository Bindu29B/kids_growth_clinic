const sl_no = new URLSearchParams(window.location.search).get("sl_no");

async function fetchBMI() {
  const res = await fetch(`http://localhost:5000/api/bmi/${sl_no}`);
  const data = await res.json();
  const tableBody = document.getElementById("bmi-records");
  document.getElementById("baby-name").textContent = data.baby_name || "Child";

  tableBody.innerHTML = "";
  data.bmi.forEach(entry => {
    const bmi = (entry.weight / ((entry.height / 100) ** 2)).toFixed(2);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date?.split('T')[0]}</td>
      <td>${entry.weight}</td>
      <td>${entry.height}</td>
      <td>${bmi}</td>
    `;
    tableBody.appendChild(row);
  });
}

async function addBMI() {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  const res = await fetch(`http://localhost:5000/api/bmi/${sl_no}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weight, height })
  });

  if (res.ok) {
    document.getElementById("bmiModal").close();
    fetchBMI();
  } else {
    alert("Error adding BMI");
  }
}

window.onload = fetchBMI;
