const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (results.length === 0) return res.status(401).json({ message: 'Invalid email ' });

        const admin = results[0];
        bcrypt.compare(password, admin.password, (err, match) => {
            if (err) return res.status(500).json({ message: 'Error comparing password' });

            if (match) {
                req.session = { adminId: admin.id };
                res.json({ message: 'Login successful', data: req.session });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.json({ message: 'Logout successful' });
    });
};
