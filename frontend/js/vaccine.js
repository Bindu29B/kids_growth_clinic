const sl_no = new URLSearchParams(window.location.search).get("sl_no");

async function fetchVaccines() {
  const res = await fetch(`http://localhost:5000/api/vaccine_records/${sl_no}`);
  const data = await res.json();
  const tableBody = document.getElementById("vaccine-records");
  document.getElementById("babyName").textContent = data.baby_name;

  tableBody.innerHTML = "";
  data.vaccines.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.vaccination}</td>
      <td>${v.date_vaccine?.split('T')[0] || ''}</td>
      <td>${v.next_vaccine?.split('T')[0] || ''}</td>
      <td>${v.next_vaccine_name}</td>
    `;
    tableBody.appendChild(row);
  });
}

async function addVaccine() {
  const vaccination = document.getElementById("vaccination").value;
  const date_vaccine = document.getElementById("dateOfVaccine").value;
  const next_vaccine = document.getElementById("nextVaccine").value;
  const next_vaccine_name = document.getElementById("nextVaccinename").value;

  const res = await fetch(`http://localhost:5000/api/vaccine_records/${sl_no}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vaccination,
      date_vaccine,
      next_vaccine,
      next_vaccine_name
    })
  });

  if (res.ok) {
    // Clear fields only after save is successful
    document.getElementById("vaccination").value = '';
    document.getElementById("dateOfVaccine").value = '';
    document.getElementById("nextVaccine").value = '';
    document.getElementById("nextVaccinename").value = '';

    document.getElementById("vaccineModal").close();
    fetchVaccines();
  } else {
    alert("Error adding vaccine");
  }
}

function openVaccineModal() {
  // Clear all form fields
  document.getElementById("vaccination").value = '';
  document.getElementById("dateOfVaccine").value = '';
  document.getElementById("nextVaccine").value = '';
  document.getElementById("nextVaccinename").value = '';

  // Open modal
  document.getElementById("vaccineModal").showModal();
}

window.onload = fetchVaccines;
