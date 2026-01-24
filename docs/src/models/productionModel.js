const db = require('../config/db');

const ProductionModel = {
    // Mengambil semua log produksi
    getAllLogs: async () => {
        const [rows] = await db.query('SELECT * FROM production_logs ORDER BY created_at DESC');
        return rows;
    },

    // Menambah data produksi baru dari operator
    createLog: async (lineId, qtyOk, qtyReject) => {
        const sql = 'INSERT INTO production_logs (line_id, qty_ok, qty_reject) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [lineId, qtyOk, qtyReject]);
        return result;
    }
};

module.exports = ProductionModel;