import React from 'react';
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';
import { closeDowntime } from '../../services/api';

const DowntimeTable = ({ logs = [], onRefresh }) => {
  
  // Fungsi kalkulasi yang aman dari error 'null'
  const calculateDuration = (start, end) => {
    if (!start) return "-";
    try {
      const startTime = new Date(start);
      const endTime = end ? new Date(end) : new Date();
      
      // Validasi jika format tanggal salah
      if (isNaN(startTime.getTime())) return "Format Salah";

      const diffMins = Math.floor((endTime - startTime) / 60000);
      
      if (diffMins < 0) return "0 m";
      if (diffMins < 60) return `${diffMins} m`;
      return `${Math.floor(diffMins / 60)} j ${diffMins % 60} m`;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return "Error Time";
    }
  };

  const handleClose = async (id) => {
    if (window.confirm("Konfirmasi bahwa mesin sudah kembali beroperasi?")) {
      try {
        await closeDowntime(id);
        onRefresh(); // Refresh data dashboard setelah update berhasil
      } catch (error) {
        console.error("Error closing downtime:", error);
        alert("Gagal memperbarui status downtime.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <Clock className="text-orange-500" size={22} /> Riwayat Downtime Mesin
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          Total: {logs?.length || 0} Kejadian
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold border-b">Mesin</th>
              <th className="p-4 font-semibold border-b text-center">Status</th>
              <th className="p-4 font-semibold border-b">Kategori</th>
              <th className="p-4 font-semibold border-b">Mulai</th>
              <th className="p-4 font-semibold border-b">Durasi</th>
              <th className="p-4 font-semibold border-b">Keterangan</th>
              <th className="p-4 font-semibold border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={log.id || index} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-medium text-slate-700">
                    {log.machine_name || "Unknown Machine"}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {!log.end_time ? (
                        <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-bold uppercase">Down</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Circle size={8} fill="currentColor" />
                          <span className="text-[10px] font-bold uppercase">Fixed</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                      {log.reason_category ? log.reason_category.replace('_', ' ') : 'OTHER'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm font-mono">
                    {log.start_time ? new Date(log.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="p-4 font-bold text-slate-700 text-sm">
                    {calculateDuration(log.start_time, log.end_time)}
                  </td>
                  <td className="p-4 text-slate-500 text-sm italic max-w-50 truncate group-hover:whitespace-normal">
                    {log.description || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {!log.end_time ? (
                        <button 
                          onClick={() => handleClose(log.id)}
                          className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-600 hover:text-white border border-green-200 transition-all text-[10px] font-black uppercase tracking-wider"
                        >
                          <CheckCircle size={12} /> Resolve
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Selesai</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-16 text-center text-slate-400">
                   <p className="italic">Tidak ada data downtime yang ditemukan.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DowntimeTable;