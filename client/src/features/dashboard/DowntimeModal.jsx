import React, { useState } from 'react';
import { X, AlertOctagon } from 'lucide-react';
import axios from 'axios';

const DowntimeModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    machine_id: 1,
    reason_category: 'mechanical',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint ini harus sesuai dengan backend POST log downtime
      await axios.post('http://localhost:5000/api/production/downtime', formData);
      alert("Laporan Downtime Berhasil Dikirim!");
      onRefresh();
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Gagal mengirim laporan.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-red-500">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2 text-red-600">
            <AlertOctagon size={24} />
            <h3 className="text-xl font-bold">Laporkan Kendala Mesin</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Pilih Mesin yang Bermasalah</label>
            <select 
              className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none"
              value={formData.machine_id}
              onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
            >
              <option value={1}>Welding Robot A1</option>
              <option value={2}>Screw Driver Auto</option>
              <option value={3}>Main Press Machine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kategori Kendala</label>
            <div className="grid grid-cols-1 gap-2">
              {['mechanical', 'electrical', 'material_shortage', 'quality_issue'].map((cat) => (
                <label key={cat} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${formData.reason_category === cat ? 'bg-red-50 border-red-200' : 'hover:bg-slate-50'}`}>
                  <input 
                    type="radio" name="cat" className="hidden" 
                    value={cat} checked={formData.reason_category === cat}
                    onChange={(e) => setFormData({...formData, reason_category: e.target.value})}
                  />
                  <span className="capitalize text-sm font-medium">{cat.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Masalah</label>
            <textarea 
              required
              className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none h-24"
              placeholder="Contoh: Motor panas berlebih atau baut macet..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-200">
            Kirim Laporan Downtime
          </button>
        </form>
      </div>
    </div>
  );
};

export default DowntimeModal;