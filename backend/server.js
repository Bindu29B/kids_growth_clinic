require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const vaccineController = require('./controllers/vaccineController');
const bmiController = require('./controllers/bmiController');
const historyController = require('./controllers/historyController');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || '702f3a9330fa3bef46b75dc74fbc7523c43c43587d9aa9c811cafad5a4f59a9a';
var hashKey = '';
const db = require('./config/db');

async function hashPassword() {
    const hashedPassword = await bcrypt.hash('SecurePass123', 10);
    hashKey = hashedPassword;
    console.log('Hashed Password:', hashedPassword);
}

hashPassword();

app.use(express.json());
app.use(
    cors({
        origin: "*", // Allow all origins (Not recommended for production)
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const excelUpload = multer({ dest: 'uploads/' }); // Ensure 'uploads/' directory exists
app.post('/api/patients/importExcel', excelUpload.single('file'), userController.importExcel);

app.post('/api/login', authController.login);
app.post('/api/patients', userController.addUser);
app.put('/api/patients/:sl_no', userController.editUser);
app.post('/api/getUsers', userController.getUsers);
app.get('/api/vaccine_records/:sl_no', vaccineController.getVaccines);
app.post('/api/vaccine_records/:sl_no', vaccineController.addVaccine);
app.get('/api/bmi/:sl_no', bmiController.getBMI);
app.post('/api/bmi/:sl_no', bmiController.addBMI);

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const imageUpload = multer({ storage: imageStorage });

app.use('/uploads', express.static('uploads'));

app.get('/api/history_records/:sl_no', historyController.getHistory);
app.post('/api/history_records/:sl_no', imageUpload.single('image'), historyController.uploadHistory);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
