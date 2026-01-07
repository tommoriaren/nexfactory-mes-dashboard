const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const productionRoutes = require('./routes/productionRoutes');

const app = express();

// --- 1. MIDDLEWARE KEAMANAN & UTILITAS ---

// Helmet membantu mengamankan aplikasi Express dengan menyetel berbagai HTTP headers
app.use(helmet()); 

// Morgan berfungsi sebagai logger untuk memantau request yang masuk di terminal
app.use(morgan('dev')); 

// Konfigurasi CORS agar Frontend (React) bisa mengakses API ini
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan port Vite/React kamu
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser: Mengubah request body (JSON) menjadi objek JavaScript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. DEFINISI ROUTES ---

// Route pengecekan dasar (Health Check)
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to NexFactory Industrial API",
        status: "Active",
        version: "1.0.0"
    });
});

// Daftarkan route spesifik fitur (Gunakan prefix /api/v1 untuk best practice)
app.use('/api/production', productionRoutes);

// --- 3. HANDLING ROUTE TIDAK DITEMUKAN (404) ---
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint tidak ditemukan'
    });
});

// --- 4. GLOBAL ERROR HANDLER ---
// Middleware ini akan menangkap semua error yang terjadi di aplikasi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Terjadi kesalahan pada server Internal'
    });
});

module.exports = app;