# 🏭 NexFactory - Industrial Production Monitoring System

NexFactory adalah aplikasi **Manufacturing Execution System (MES)** berbasis web yang dirancang untuk memantau output produksi dan manajemen *downtime* mesin secara real-time. Sistem ini mengintegrasikan Dashboard analitik dengan manajemen data master industri untuk meningkatkan efisiensi pabrik.



## 🚀 Fitur Unggulan

* **Real-time Production Dashboard**: Visualisasi output produksi per-lini menggunakan grafik interaktif dan indikator performa.
* **Automated Auto-Refresh**: Data disinkronkan secara otomatis setiap 60 detik untuk memastikan informasi di lantai produksi selalu mutakhir.
* **Downtime Management System**: Fitur pelaporan kendala mesin dengan logika "Resolve" untuk mencatat durasi kerusakan secara akurat.
* **Master Data Management**: Kelola entitas industri seperti **Lini Produksi** dan **Daftar Mesin** secara dinamis.
* **Contextual UI/UX**: Antarmuka yang adaptif, menyembunyikan aksi yang tidak relevan berdasarkan menu yang sedang dibuka.
* **Responsive & Industrial Design**: Menggunakan palet warna slate & blue yang profesional, cocok untuk monitor pengawasan di area pabrik.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Styling)
* Lucide React (Iconography)
* Axios (API Handling)
* Recharts (Data Visualization)

**Backend:**
* Node.js & Express.js
* MySQL (Database)
* CORS (Cross-Origin Resource Sharing)



## 📋 Prasyarat Sistem

* Node.js (versi 16 atau terbaru)
* XAMPP / MySQL Server
* NPM (Node Package Manager)

## 🔧 Instalasi & Konfigurasi

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/nexfactory-app.git](https://github.com/username/nexfactory-app.git)
    cd nexfactory-app
    ```

2.  **Konfigurasi Database**
    * Buka phpMyAdmin dan buat database baru bernama `nexfactory_db`.
    * Impor file SQL yang tersedia di folder `/server/database/db.sql`.

3.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Buat file .env dan sesuaikan kredensial database Anda
    npm run dev
    ```

4.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 📂 Struktur Database

Sistem ini menggunakan relasi database yang terstruktur:
* `production_lines`: Menyimpan data departemen/area.
* `machines`: Menyimpan aset mesin (berelasi dengan lini).
* `production_logs`: Mencatat output OK & Reject per jam.
* `downtime_logs`: Mencatat durasi dan alasan mesin berhenti.



## 💡 Konsep Pengembangan

Proyek ini dibangun dengan prinsip **Clean Code** dan **Component-Based Architecture**. Penggunaan *hooks* seperti `useCallback` dan `useEffect` dioptimalkan untuk mencegah *memory leak* pada fitur *auto-refresh*, menjadikannya solusi yang stabil untuk lingkungan industri yang sibuk.

---
Dibuat dengan ❤️ untuk Masa Depan Industri Indonesia.
