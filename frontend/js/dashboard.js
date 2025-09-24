async function addUser() {
    const sl_no = document.querySelector('#sl-no').value;
    const baby_name = document.querySelector('#babyName').value;
    const dob = document.querySelector('#dob').value;
    const gender = document.querySelector('#gender').value;
    const blood_type = document.querySelector('#bloodType').value;
    const medical_history = document.querySelector('#medicalHistory').value;
    const doctor_name = document.querySelector('#doctorName').value;
    const spl_cond = document.querySelector('#specialConditions').value;
    const next_visit = document.querySelector('#nextVisit').value;
    const parent_name = document.querySelector('#parentName').value;
    const phone = document.querySelector('#phone').value.trim();
    const email = document.querySelector('#email').value;
    const address = document.querySelector('#address').value;
    const emergency_contact = document.querySelector('#emergencyContactName').value;
    const emergency_number = document.querySelector('#emergencyContactNumber').value.trim();
    const emergency_instructions = document.querySelector('#emergencyInstructions').value;
    try {
        const response = await fetch('http://localhost:5000/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sl_no: parseInt(sl_no),
                baby_name,
                dob: dob ? new Date(dob).toISOString().split('T')[0] : null,
                gender,
                blood_type,
                medical_history,
                doctor_name,
                spl_cond,
                next_visit: next_visit ? new Date(next_visit).toISOString().split('T')[0] : null,
                parent_name,
                phone,
                email,
                address,
                emergency_contact,
                emergency_number,
                emergency_instructions,
            })
        });

        const data = await response.json();
        if (response.ok) {
            closeModel();
            fetchUsers();
        } else {
            console.error('Error:', data.message); // Log the error message from the backend
        }
    } catch (error) {
        console.error('Fetch Error:', error); // Log any fetch-related errors
    }
}

async function fetchUsers(filterType = '') {
    const search = document.querySelector('#search').value;
    const visitStart = document.querySelector('#visit-start').value;
    const visitEnd = document.querySelector('#visit-end').value;

    try {
        const response = await fetch('http://localhost:5000/api/getUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search, visitStart, visitEnd })
        });

        if (!response.ok) throw new Error('Failed to fetch users');

        usersData = await response.json();
        if (!window.keepCurrentPage) {
            currentPage = 1;
        }
        renderUsers();
        setupPagination();
    } catch (error) {
        console.error("Fetch error:", error);
        usersData = [];
        document.querySelector('#user-table-body').innerHTML = `<tr><td colspan="17">No data found.</td></tr>`;
    }
}

let usersData = [];       // Holds all patients from backend
let currentPage = 1;      // Tracks the active page
const usersPerPage = 10;  // Number of users to display per page

// Function to display users based on current page
function renderUsers() {
    const tableBody = document.querySelector('#user-table-body');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = usersData.slice(startIndex, endIndex);

    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.id = `user-tr-${String(user.sl_no)}`;
        row.innerHTML = `
           <td id="sl_no${user.sl_no}" contenteditable="false">${user.sl_no}</td>
           <td id="baby_name${user.sl_no}" contenteditable="false">${user.baby_name}</td>
            <td id="dob${user.sl_no}" contenteditable="false">${user.dob ? user.dob.split('T')[0] : 'N/A'}</td>
            <td id="gender${user.sl_no}" contenteditable="false">${user.gender}</td>
            <td id="blood_type${user.sl_no}" contenteditable="false">${user.blood_type}</td>
            <td id="medical_history${user.sl_no}" contenteditable="false">${user.medical_history}</td>
            <td id="doctor_name${user.sl_no}" contenteditable="false">${user.doctor_name}</td>
            <td id="spl_cond${user.sl_no}" contenteditable="false">${user.spl_cond}</td>
            <td id="next_visit${user.sl_no}" contenteditable="false">${user.next_visit ? user.next_visit.split('T')[0] : 'N/A'}</td>
            <td id="parent_name${user.sl_no}" contenteditable="false">${user.parent_name}</td>
            <td id="phone${user.sl_no}" contenteditable="false">${user.phone}</td>
            <td id="email${user.sl_no}" contenteditable="false">${user.email}</td>
            <td id="address${user.sl_no}" contenteditable="false">${user.address}</td>
            <td id="emergency_contact${user.sl_no}" contenteditable="false">${user.emergency_contact}</td>
            <td id="emergency_number${user.sl_no}" contenteditable="false">${user.emergency_number}</td>
            <td id="emergency_instructions${user.sl_no}" contenteditable="false">${user.emergency_instructions}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editUser(${user.sl_no})">Edit</button>
                    <button class="vaccine-btn" onclick="goToVaccine(${user.sl_no})">Vaccine</button>
                    <button class="history-btn" onclick="goToHistory(${user.sl_no})">History</button>
                    <button class="bmi-btn" onclick="goToBMI(${user.sl_no})">BMI</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to create pagination buttons
function setupPagination() {
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(usersData.length / usersPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-btn');
        if (i === currentPage) button.classList.add('active');
        button.addEventListener('click', () => changePage(i));
        paginationContainer.appendChild(button);
    }
}

// Function to change page
function changePage(page) {
    currentPage = page;
    renderUsers();
    setupPagination();
}

function clearFilters() {
    document.querySelector('#search').value = '';
    document.querySelector('#visit-start').value = '';
    document.querySelector('#visit-end').value = '';

    fetchUsers(); // Fetch users again without filters
}

// Attach event listener to the clear button
document.querySelector('#clear').addEventListener('click', clearFilters);

function closeModel() {
    const sl_no = document.querySelector('#sl-no');
    const baby_name = document.querySelector('#babyName');
    const dob = document.querySelector('#dob');
    const gender = document.querySelector('#gender');
    const blood_type = document.querySelector('#bloodType');
    const medical_history = document.querySelector('#medicalHistory');
    const doctor_name = document.querySelector('#doctorName');
    const spl_cond = document.querySelector('#specialConditions');
    const next_visit = document.querySelector('#nextVisit');
    const parent_name = document.querySelector('#parentName');
    const phone = document.querySelector('#phone');
    const email = document.querySelector('#email');
    const address = document.querySelector('#address');
    const emergency_contact = document.querySelector('#emergencyContactName');
    const emergency_number = document.querySelector('#emergencyContactNumber');
    const emergency_instructions = document.querySelector('#emergencyInstructions');
    document.getElementById('myModal').close();
    sl_no.value = '';
    baby_name.value = '';
    dob.value = '';
    gender.value = '';
    blood_type.value = '';
    medical_history.value = '';
    doctor_name.value = '';
    spl_cond.value = '';
    next_visit.value = '';
    parent_name.value = '';
    phone.value = '';
    email.value = '';
    address.value = '';
    emergency_contact.value = '';
    emergency_number.value = '';
    emergency_instructions.value = '';
}

async function editUser(sl_no) {
    console.log('Editing user with sl_no:', sl_no);
    // Scroll to the row being edited
    const rowElement = document.getElementById(`user-tr-${sl_no}`);
    if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    //Open the model
    document.getElementById('editModal').showModal();

    const getSafeText = (id) => {
        const el = document.querySelector(`#${id}${sl_no}`);
        return el ? el.innerHTML.trim() : '';
    };

    const getValidDate = (raw) => {
        return raw && raw !== 'N/A' ? raw.split('T')[0] : '';
    };

    document.querySelector('#edit-sl-no').value = getSafeText('sl_no') || '';

    document.querySelector('#edit-babyName').value = getSafeText('baby_name');
    document.querySelector('#edit-dob').value = getValidDate(getSafeText('dob'));
    document.querySelector('#edit-gender').value = getSafeText('gender');
    document.querySelector('#edit-bloodType').value = getSafeText('blood_type');
    document.querySelector('#edit-medicalHistory').value = getSafeText('medical_history');
    document.querySelector('#edit-doctorName').value = getSafeText('doctor_name');
    document.querySelector('#edit-specialConditions').value = getSafeText('spl_cond');
    document.querySelector('#edit-nextVisit').value = getValidDate(getSafeText('next_visit'));
    document.querySelector('#edit-parentName').value = getSafeText('parent_name');
    document.querySelector('#edit-phone').value = getSafeText('phone');
    document.querySelector('#edit-email').value = getSafeText('email');
    document.querySelector('#edit-address').value = getSafeText('address');
    document.querySelector('#edit-emergencyContactName').value = getSafeText('emergency_contact');
    document.querySelector('#edit-emergencyContactNumber').value = getSafeText('emergency_number');
    document.querySelector('#edit-emergencyInstructions').value = getSafeText('emergency_instructions');
}


function closeEditModal() {
    document.querySelector('#edit-sl-no').value = '';
    document.querySelector('#edit-babyName').value = '';
    document.querySelector('#edit-dob').value = '';
    document.querySelector('#edit-gender').value = '';
    document.querySelector('#edit-bloodType').value = '';
    document.querySelector('#edit-medicalHistory').value = '';
    document.querySelector('#edit-doctorName').value = '';
    document.querySelector('#edit-specialConditions').value = '';
    document.querySelector('#edit-nextVisit').value = '';
    document.querySelector('#edit-emergencyInstructions').value = '';
    document.querySelector('#edit-parentName').value = '';
    document.querySelector('#edit-phone').value = '';
    document.querySelector('#edit-email').value = '';
    document.querySelector('#edit-address').value = '';
    document.querySelector('#edit-emergencyContactName').value = '';
    document.querySelector('#edit-emergencyContactNumber').value = '';
    document.getElementById('editModal').close();
}

async function saveUser() {
    const sl_no = document.querySelector('#edit-sl-no').value.trim();
    const baby_name = document.querySelector('#edit-babyName').value;
    const dob = document.querySelector('#edit-dob').value;
    const gender = document.querySelector('#edit-gender').value;
    const blood_type = document.querySelector('#edit-bloodType').value;
    const medical_history = document.querySelector('#edit-medicalHistory').value;
    const doctor_name = document.querySelector('#edit-doctorName').value;
    const spl_cond = document.querySelector('#edit-specialConditions').value;
    const next_visit = document.querySelector('#edit-nextVisit').value;
    const parent_name = document.querySelector('#edit-parentName').value;
    const phone = document.querySelector('#edit-phone').value;
    const email = document.querySelector('#edit-email').value;
    const address = document.querySelector('#edit-address').value;
    const emergency_contact = document.querySelector('#edit-emergencyContactName').value;
    const emergency_number = document.querySelector('#edit-emergencyContactNumber').value;
    const emergency_instructions = document.querySelector('#edit-emergencyInstructions').value;
    try {
        const response = await fetch(`http://localhost:5000/api/patients/${sl_no}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sl_no: parseInt(sl_no),
                baby_name,
                dob: dob ? new Date(dob).toISOString().split('T')[0] : null,
                gender,
                blood_type,
                medical_history,
                doctor_name,
                spl_cond,
                next_visit: next_visit ? new Date(next_visit).toISOString().split('T')[0] : null,
                parent_name,
                phone,
                email,
                address,
                emergency_contact,
                emergency_number,
                emergency_instructions
            })
        });

        const data = await response.json();
        if (response.ok) {
            closeEditModal();
            fetchUsers();
            showMessage("User data saved successfully!", "success");
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}
function showMessage(message, type) {
    const messageBox = document.createElement("div");
    messageBox.textContent = message;
    messageBox.style.position = "fixed";
    messageBox.style.bottom = "20px";
    messageBox.style.right = "20px";
    messageBox.style.padding = "10px 20px";
    messageBox.style.borderRadius = "5px";
    messageBox.style.color = "#fff";
    messageBox.style.fontSize = "16px";
    messageBox.style.zIndex = "1000";

    if (type === "success") {
        messageBox.style.backgroundColor = "#28a745"; // Green
    } else if (type === "error") {
        messageBox.style.backgroundColor = "#dc3545"; // Red
    }

    document.body.appendChild(messageBox);

    // Remove message after 3 seconds
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

async function exportExcel() {
    try {
        const search = document.querySelector('#search').value;
        const visitStart = document.querySelector('#visit-start').value;
        const visitEnd = document.querySelector('#visit-end').value;

        const response = await fetch('http://localhost:5000/api/getUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search, visitStart, visitEnd })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        let patients = await response.json();

        if (patients.length === 0) {
            alert("No data available to export!");
            return;
        }

        // Format date fields before exporting
        patients = patients.map(user => ({
            ...user,
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
            next_visit: user.next_visit ? new Date(user.next_visit).toISOString().split('T')[0] : ''
        }));

        // Convert data to Excel format
        const worksheet = XLSX.utils.json_to_sheet(patients);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

        // Create and download the Excel file
        XLSX.writeFile(workbook, `Visit_${visitStart || 'All'}_to_${visitEnd || 'All'}.xlsx`);

    } catch (error) {
        console.error("Error exporting data:", error);
        alert("Failed to export data. Please try again.");
    }
}

async function importExcel() {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an Excel file to import.");
        return;
    }

    // Restrict file type to .xlsx or .xls
    const allowedExtensions = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (!allowedExtensions.includes(file.type)) {
        alert("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch("http://localhost:5000/api/patients/importExcel", {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        console.log(data)
        alert(JSON.stringify(data)); // Display success or error message
        location.reload(); // Refresh to reflect imported data
    } catch (error) {
        console.error("Error importing file:", error);
        alert("Failed to import data. Please try again.");
    }
}

function logOut() {
    window.location.href = '../pages/index.html'
}

window.onload = fetchUsers;

function goToVaccine(sl_no) {
    window.open(`vaccine.html?sl_no=${sl_no}`, '_blank');
}

function goToHistory(sl_no) {
    window.open(`history.html?sl_no=${sl_no}`, '_blank');
}

function goToBMI(sl_no) {
    window.open(`bmi.html?sl_no=${sl_no}`, '_blank');
}
