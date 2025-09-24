# Growth Clinic Dashboard

A web-based dashboard for managing baby patient details at a child's clinic. This project provides user authentication, patient data management, and an intuitive UI for doctors and clinic staff.

## 🚀 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Authentication:** JWT  
- **Middleware:** Express Middleware  
- **File Uploads:** Multer
- **Excel Processing:** XLSX.js
- **Storage:** Local /uploads directory

---

## 📂 Project Structure
```
Growth-Clinic-Project/
│-- backend/
│   │-- config/
│   │   ├── db.js
│   │-- controllers/
│   │   ├── authController.js
│   │   ├── userController.js
|   |   ├── vaccineController.js
│   │   ├── bmiController.js
│   │   └── historyController.js
│   │-- middleware/
│   │   ├── authMiddleware.js
│   │-- models/
│   │   ├── adminModel.js
│   │   ├── userModel.js
│   │-- routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
|   |-- server.js
│-- frontend/
|   |-- css/
|   |   ├── style.css
|   |-- js/
|   |   ├── dashboard.js
|   |   ├── login.js
│   │   ├── vaccine.js
│   │   ├── bmi.js
│   │   |── history.js
|   |-- pages/
|   |   ├── admin_dashboard.js
|   |   ├── index.html
│   |   ├── vaccine.html
│   |   ├── bmi.html
│   |   |── history.html
|-- node_modules/
|-- uploads/
|-- .env
│-- package.json
│-- README.md
│-- package-lock.json
```
---

## Features

1. **Admin Authentication**:
   - Admins can log in using a specific email and password.
   - Session management for secure access.

2. **Patient Management**:
   - **Add New patient**: Admins can add new patients with detailed information.
   - **Edit patient**: Admins can update patients details.
   - **View patients**: Display all patients in a table with pagination and search functionality.

3. **Search and Filter**:
   - Search patients by `sl_no`, `parent_name`, `phone`, `email`, or other fields.
   - Filter patients by `next_vaccine` and `next_visit` (start date and end date).

4. **Excel Import/Export**:
   - Import user data from an Excel file. Add only new patients and remove the existing patients. Make sure the headings are matching the table you have created in db.
   - Export filtered or complete user data to an Excel file.

5. **BMI Tracking**:
   - Record weight and height
   - Automatically calculate BMI
   - View BMI history per child

6.  **Prescription History**
   - Upload and preview prescription images
   - Store with upload date and display in modal for full-screen view

7. **Vaccine Records**:
   - Add vaccine name, date, next vaccine, and next vaccine name
   - View all past vaccines for a specific child

8. **Responsive Design**:
   - The dashboard is designed to work seamlessly on both desktop and mobile devices. 

---

## Setup Instructions

### Prerequisites

1. **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
2. **MySQL**: Install MySQL from [mysql.com](https://www.mysql.com/).
3. **Git**: Install Git from [git-scm.com](https://git-scm.com/).

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/clinic-dashbaord.git
   cd crm-dashboard
   ```

2. **Set Up the Database**:
   - Create a MySQL database named `baby_clinic`.
   - Run the following SQL query to create the `patients` table:
     ```sql
    CREATE TABLE patients (
        sl_no INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        parent_name VARCHAR(255) NOT NULL,
        phone VARCHAR(10) DEFAULT NULL,
        email VARCHAR(255) UNIQUE DEFAULT NULL,
        address TEXT NOT NULL,
        emergency_contact VARCHAR(255) NOT NULL,
        emergency_number VARCHAR(10) DEFAULT NULL,
        baby_name VARCHAR(255) NOT NULL,
        dob DATE DEFAULT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        blood_type VARCHAR(5) NOT NULL,
        medical_history TEXT DEFAULT NULL,
        vaccination VARCHAR(255) DEFAULT NULL,
        date_vaccine DATE DEFAULT NULL,
        next_vaccine DATE DEFAULT NULL,
        doctor_name VARCHAR(255) DEFAULT NULL,
        spl_cond TEXT DEFAULT NULL,
        last_visit DATE DEFAULT NULL,
        next_visit DATE DEFAULT NULL,
        emergency_instructions TEXT DEFAULT NULL,
        consent ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
        insurance VARCHAR(255) DEFAULT NULL,
        status TINYINT(1) DEFAULT 1
    );
     ```

   `vaccine_records` table:
   ```sql
      CREATE TABLE vaccine_records (
         sl_no INT NOT NULL,
         vaccination VARCHAR(255),
         date_vaccine DATE,
         next_vaccine DATE,
         next_vaccine_name VARCHAR(255),
         FOREIGN KEY (sl_no) REFERENCES patient(sl_no)
      );
   ```

   `bmi_records` table:
   ```sql
      CREATE TABLE bmi_records (
         sl_no INT NOT NULL,
         weight DECIMAL(5,2),
         height DECIMAL(5,2),
         date DATE DEFAULT CURRENT_DATE,
         FOREIGN KEY (sl_no) REFERENCES patient(sl_no)
      );
   ```
    
   `history_records` table:
   ```sql
      CREATE TABLE history_records (
         sl_no INT NOT NULL,
         todays_date DATE DEFAULT CURRENT_DATE,
         image_path VARCHAR(255),
         FOREIGN KEY (sl_no) REFERENCES patients(sl_no)
      );
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory and add the following:
     ```env
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=baby_clinic
     SECRET_KEY=your_secret_key
     ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Start the Server**:
   ```bash
   npm start
   or 
   npm run dev
   ```
   - The server will start on `http://localhost:5000`.

6. **Access the Application**:
   - Open `http://localhost:5000` in your browser.
   - Use the following credentials to log in:
     - **Email**: `admin@example.com`
     - **Password**: `SecurePass123`

---

## API Endpoints

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/api/login`                  | Admin login                     |
| POST   | `/api/getUsers`               | Fetch/filter all patients       |
| POST   | `/api/patients`               | Add a new patient               |
| PUT    | `/api/patients/:sl_no`        | Update a patient                |
| POST   | `/api/patients/importExcel`   | Bulk import via Excel           |
| GET    | `/api/vaccine_records/:sl_no` | Get vaccine records for a child |
| POST   | `/api/vaccine_records/:sl_no` | Add a vaccine record            |
| GET    | `/api/bmi/:sl_no`             | Get BMI records for a child     |
| POST   | `/api/bmi/:sl_no`             | Add a new BMI record            |
| GET    | `/api/history_records/:sl_no` | Get prescription images         |
| POST   | `/api/history_records/:sl_no` | Upload new prescription image   |

---

## 🚀 Future Enhancements
✅ Add Patient Growth Charts
✅ Implement Role-Based Access Control
✅ Integrate Email Notifications for Appointments
✅ Deploy on AWS or Netlify

---

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Bootstrap](https://getbootstrap.com/) (for styling inspiration)

---

Feel free to customize this README file further to suit your project! 
