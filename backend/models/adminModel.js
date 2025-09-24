const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.findAdminByEmail = (email, callback) => {
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
    });
};

exports.createAdmin = (email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return callback(err, null);

        db.query('INSERT INTO admin (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
            if (err) return callback(err, null);
            callback(null, { id: result.insertId, email });
        });
    });
};
