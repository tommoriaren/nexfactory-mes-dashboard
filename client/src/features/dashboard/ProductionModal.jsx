import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createProductionLog } from '../../services/api';

const ProductionModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    line_id: 1,
    machine_id: 1,
    qty_ok: '',
    qty_reject: '',
    shift: 1,
    operator_name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProductionLog(formData);
      alert("Data berhasil disimpan!");
      onRefresh(); // Refresh data dashboard
      onClose();   // Tutup modal
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Gagal menyimpan data.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-slate-800">Input Log Produksi</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Line</label>
            <select 
              className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.line_id}
              onChange={(e) => setFormData({...formData, line_id: e.target.value})}
            >
              <option value={1}>Line Welding 01</option>
              <option value={2}>Line Assembly 02</option>
              <option value={3}>Line Paint Shop 03</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qty OK</label>
              <input 
                type="number" required
                className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                value={formData.qty_ok}
                onChange={(e) => setFormData({...formData, qty_ok: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qty Reject</label>
              <input 
                type="number"
                className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                value={formData.qty_reject}
                onChange={(e) => setFormData({...formData, qty_reject: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
            <select 
              className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.shift}
              onChange={(e) => setFormData({...formData, shift: e.target.value})}
            >
              <option value={1}>Shift 1 (Pagi)</option>
              <option value={2}>Shift 2 (Sore)</option>
              <option value={3}>Shift 3 (Malam)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Operator</label>
            <input 
              type="text" required
              className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan nama"
              value={formData.operator_name}
              onChange={(e) => setFormData({...formData, operator_name: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-4"
          >
            Simpan Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductionModal;