const db = require('../config/db');

exports.getBMI = (req, res) => {
  const sl_no = req.params.sl_no;
  const sql = `
    SELECT b.date, b.weight, b.height, p.baby_name
    FROM bmi_records b
    JOIN patients p ON b.sl_no = p.sl_no
    WHERE b.sl_no = ?
    ORDER BY b.date ASC
  `;
  db.query(sql, [sl_no], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const baby_name = results[0]?.baby_name || "Child";
    const bmiData = results.map(({ date, weight, height }) => ({ date, weight, height }));
    res.json({ baby_name, bmi: bmiData });
  });
};

exports.addBMI = (req, res) => {
  const sl_no = req.params.sl_no;
  const { weight, height } = req.body;
  const sql = `INSERT INTO bmi_records (sl_no, weight, height, date) VALUES (?, ?, ?, CURDATE())`;
  db.query(sql, [sl_no, weight, height], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "BMI record added successfully" });
  });
};
