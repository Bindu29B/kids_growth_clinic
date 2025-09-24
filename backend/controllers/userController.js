const db = require('../config/db'); 
const userModel = require('../models/userModel');
const xlsx = require('xlsx');
const fs = require('fs');

exports.getUsers = (req, res) => {
    const { search, visitStart, visitEnd } = req.body;
    let flag = '';
    let searchParams = [];

    if (search) {
        flag += `AND (
            LOWER(parent_name) LIKE LOWER(?) OR
            LOWER(phone) LIKE LOWER(?) OR
            LOWER(email) LIKE LOWER(?) OR
            LOWER(baby_name) LIKE LOWER(?) OR
            LOWER(doctor_name) LIKE LOWER(?) OR
            LOWER(emergency_contact) LIKE LOWER(?)
        )`;
        searchParams = Array(6).fill(`%${search}%`);
    }

    if (visitStart && visitEnd) {
        flag += ` AND (next_visit BETWEEN ? AND ?)`;
        searchParams.push(visitStart, visitEnd);
    }

    const query = `SELECT *,
                    DATE_FORMAT(next_visit, '%Y-%m-%d') AS next_visit 
                    FROM patients 
                    WHERE status=1 ${flag} 
                    ORDER BY sl_no DESC`;

    userModel.getUsers(query, searchParams, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
        res.json(results);
    });
};

exports.addUser = (req, res) => {
    const user = req.body;
    userModel.checkEmailExists(user.email, (err, existingUsers) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        userModel.addUser(user, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding user' });
            res.json({ message: 'User added successfully' });
        });
    });
};

exports.editUser = (req, res) => {
    const updatedFields = req.body;
    const { sl_no } = req.params;

    userModel.editUser(sl_no, updatedFields, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating user', error: err });
        res.json({ message: 'User updated successfully' });
    });
};

exports.addBMI = (req, res) => {
    const { sl_no, weight, height } = req.body;
    userModel.addBMI(sl_no, weight, height, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error inserting BMI record' });
        res.json({ message: 'BMI added successfully' });
    });
};

function excelSerialToJSDate(serial) {
    if (!serial || isNaN(serial)) return null;
    const utc_days = Math.floor(serial - 25569);
    const date_info = new Date(utc_days * 86400 * 1000);
    return isNaN(date_info.getTime()) ? null : date_info.toISOString().split('T')[0];
}

exports.importExcel = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: 'Empty Excel file' });
        }

        const values = data.map(row => [
            row.sl_no || '',
            row.parent_name || '',
            row.phone || '',
            row.email || '',
            row.address || '',
            row.emergency_contact || '',
            row.emergency_number || '',
            row.baby_name || '',
            row.dob ? excelSerialToJSDate(row.dob) : null,               // ✅ NULL for missing date
            row.gender || '',
            row.blood_type || '',
            row.medical_history || '',
            row.doctor_name || '',
            row.spl_cond || '',
            row.next_visit ? excelSerialToJSDate(row.next_visit) : null, // ✅ NULL for missing date
            row.emergency_instructions || ''
        ]);

        const sql = `INSERT INTO patients 
            (sl_no, parent_name, phone, email, address, emergency_contact, emergency_number, baby_name, dob, gender, blood_type, medical_history, doctor_name, spl_cond, next_visit, emergency_instructions)
            VALUES ?`;

        db.query(sql, [values], (err, result) => {
            fs.unlinkSync(filePath);
            if (err) return res.status(500).json({ message: 'Error inserting data', error: err });
            res.json({ message: 'Data imported successfully', inserted: result.affectedRows });
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error processing Excel file', error: error.message });
    }
};
