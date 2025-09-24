const db = require('../config/db');

exports.getUsers = (query, params, callback) => {
    db.query(query, params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

exports.addUser = (user, callback) => {
    const sql = 'INSERT INTO patients SET ?';
    db.query(sql, user, (err, result) => {
        if (err) return callback(err, null);
        callback(null, { sl_no: user.sl_no, ...user });
    });
};

exports.checkEmailExists = (email, callback) => {
    db.query("SELECT * FROM patients WHERE email = ?", [email], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

exports.editUser = (sl_no, updatedFields, callback) => {
    const sql = `UPDATE patients SET ? WHERE sl_no = ?`;
    db.query(sql, [updatedFields, sl_no], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

exports.addBMI = (sl_no, weight, height, callback) => {
    const sql = 'INSERT INTO bmi_records (sl_no, weight, height, date) VALUES (?, ?, ?, NOW())';
    db.query(sql, [sl_no, weight, height], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};
