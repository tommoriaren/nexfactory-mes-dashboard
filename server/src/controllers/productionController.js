const db = require('../config/db');

/**
 * @desc    Mengambil ringkasan total produksi per lini (Dashboard Cards & Chart)
 * @route   GET /api/production/summary
 */
const getProductionSummary = async (req, res) => {
    try {
        // COALESCE digunakan untuk mengubah NULL menjadi 0 agar Frontend tidak error
        const [rows] = await db.query(`
            SELECT 
                l.id as line_id,
                l.line_name, 
                COALESCE(SUM(p.qty_ok), 0) as total_ok, 
                COALESCE(SUM(p.qty_reject), 0) as total_reject 
            FROM production_lines l
            LEFT JOIN production_logs p ON l.id = p.line_id
            GROUP BY l.id
        `);

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching production summary:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal Server Error saat mengambil ringkasan produksi' 
        });
    }
};

/**
 * @desc    Menambah data produksi baru (Input dari Modal Frontend)
 * @route   POST /api/production/log
 */
const createProductionLog = async (req, res) => {
    const { line_id, machine_id, qty_ok, qty_reject, shift, operator_name } = req.body;

    // Validasi sederhana
    if (!line_id || !machine_id || qty_ok === undefined || shift === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'Mohon lengkapi data wajib: Line, Machine, Qty OK, dan Shift.'
        });
    }

    try {
        const sql = `
            INSERT INTO production_logs (line_id, machine_id, qty_ok, qty_reject, shift, operator_name) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.execute(sql, [
            line_id, 
            machine_id, 
            qty_ok, 
            qty_reject || 0, 
            shift, 
            operator_name || 'Anonymous'
        ]);

        res.status(201).json({
            status: 'success',
            message: 'Data produksi berhasil disimpan',
            logId: result.insertId
        });
    } catch (error) {
        console.error('Error saving production log:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Gagal menyimpan data ke database' 
        });
    }
};

/**
 * @desc    Mengambil riwayat downtime mesin (Downtime Table)
 * @route   GET /api/production/downtime
 */
const getDowntimeLogs = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                d.id,
                m.line_id,       -- Ambil line_id dari tabel machines (m)
                l.line_name,
                d.machine_id,
                m.machine_name,
                d.reason_category,
                d.start_time,
                d.end_time,
                d.description
            FROM downtime_logs d
            JOIN machines m ON d.machine_id = m.id
            JOIN production_lines l ON m.line_id = l.id  -- Join line via machine
            ORDER BY d.start_time DESC
        `);

        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        console.error('Error fetching downtime logs:', error);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data downtime' });
    }
};

const updateDowntimeStatus = async (req, res) => {
    const { id } = req.params; // ID downtime yang akan ditutup
    try {
        const sql = `UPDATE downtime_logs SET end_time = NOW() WHERE id = ? AND end_time IS NULL`;
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan atau sudah pernah ditutup' });
        }

        res.status(200).json({ status: 'success', message: 'Downtime resolved' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getMachines = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT m.*, pl.line_name 
            FROM machines m 
            JOIN production_lines pl ON m.line_id = pl.id
        `);
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const addMachine = async (req, res) => {
    const { machine_name, line_id, status } = req.body;
    try {
        await db.execute(
            'INSERT INTO machines (machine_name, line_id, status) VALUES (?, ?, ?)',
            [machine_name, line_id, status || 'active']
        );
        res.status(201).json({ status: 'success', message: 'Mesin berhasil didaftarkan' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getProductionLines = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM production_lines ORDER BY id DESC');
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const addProductionLine = async (req, res) => {
    const { line_name } = req.body;
    try {
        await db.execute('INSERT INTO production_lines (line_name) VALUES (?)', [line_name]);
        res.status(201).json({ status: 'success', message: 'Lini produksi berhasil ditambah' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { 
    getProductionSummary, 
    createProductionLog,
    getDowntimeLogs,
    updateDowntimeStatus,
    getMachines,
    addMachine,
    getProductionLines,
    addProductionLine
};