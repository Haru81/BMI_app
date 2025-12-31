const db = require('../config/db');

// すべての記録を取得
exports.getAllRecords = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM records ORDER BY date DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 最新の記録を取得
exports.getLatestRecord = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bmi_records ORDER BY date DESC LIMIT 1');
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 新しい記録を追加
exports.createRecord = async (req, res) => {
    try {
        const { height, weight, date } = req.body;
        const bmi = (weight / Math.pow(height / 100, 2)).toFixed(2);
        const [result] = await db.query(
            'INSERT INTO bmi_records (weight, height, bmi, date) VALUES (?, ?, ?, ?)',
            [weight, height, bmi, date]
        );
        res.status(201).json({ id: result.insertId, weight, height, bmi, date });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 特定の記録を削除
exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM bmi_records WHERE id = ?', [id]);
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};