const db = require('../config/db');
const path = require('path');

exports.getHistory = (req, res) => {
  const sl_no = req.params.sl_no;

  const query = `
    SELECT h.todays_date, h.image_path, p.baby_name
    FROM history_records h
    JOIN patients p ON h.sl_no = p.sl_no
    WHERE h.sl_no = ?
    ORDER BY h.todays_date DESC
  `;

  db.query(query, [sl_no], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    const baby_name = results[0]?.baby_name || 'Child';
    res.json({ baby_name, records: results });
  });
};

exports.uploadHistory = (req, res) => {
  const sl_no = req.params.sl_no;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No image uploaded' });

  const query = `INSERT INTO history_records (sl_no, image_path) VALUES (?, ?)`;

  db.query(query, [sl_no, file.filename], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to insert record', error: err });
    res.json({ message: 'Prescription uploaded successfully' });
  });
};
