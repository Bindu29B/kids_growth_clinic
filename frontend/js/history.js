const sl_no = new URLSearchParams(window.location.search).get("sl_no");

async function fetchHistory() {
  const res = await fetch(`http://localhost:5000/api/history_records/${sl_no}`);
  const data = await res.json();

  document.getElementById("babyName").textContent = data.baby_name || "Child";

  const tableBody = document.getElementById("history-records");
  tableBody.innerHTML = "";

  data.records.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.todays_date?.split('T')[0]}</td>
      <td>
        <img src="/uploads/${entry.image_path}" 
            alt="Prescription" 
            style="width: 100px; cursor: zoom-in;" 
            onclick="openImageModal('/uploads/${entry.image_path}')">
      </td>
    `;
    tableBody.appendChild(row);
  });
}


async function uploadPrescription() {
  const fileInput = document.getElementById("prescriptionImage");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`http://localhost:5000/api/history_records/${sl_no}`, {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    document.getElementById("historyModal").close();
    fileInput.value = '';
    fetchHistory();
  } else {
    alert("Failed to upload image.");
  }
}

function openImageModal(imageUrl) {
  const modal = document.getElementById("imagePreviewModal");
  const img = document.getElementById("previewImg");
  img.src = imageUrl;
  modal.style.display = "block";
}

function closeImageModal() {
  document.getElementById("imagePreviewModal").style.display = "none";
}

window.onload = fetchHistory;
