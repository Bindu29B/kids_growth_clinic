const db = require('../config/db');
exports.getVaccines = (req, res) => {
    const sl_no = req.params.sl_no;

    const query = `
        SELECT p.baby_name, v.vaccination, v.date_vaccine, v.next_vaccine, v.next_vaccine_name
        FROM vaccine_records v
        JOIN patients p ON p.sl_no = v.sl_no
        WHERE v.sl_no = ?
        ORDER BY v.date_vaccine ASC
    `;

    db.query(query, [sl_no], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const baby_name = results[0]?.baby_name || 'Child';
        res.json({ baby_name, vaccines: results });
    });
};

exports.addVaccine = (req, res) => {
    const sl_no = req.params.sl_no;
    const { vaccination, date_vaccine, next_vaccine, next_vaccine_name } = req.body;
    const sql = 'INSERT INTO vaccine_records (sl_no, vaccination, date_vaccine, next_vaccine, next_vaccine_name) VALUES (?, ?, ?, ?, ?)';
    db.query(
        sql,
        [sl_no, vaccination, date_vaccine || null, next_vaccine || null, next_vaccine_name || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Vaccine record added successfully' });
        }
    );
};
