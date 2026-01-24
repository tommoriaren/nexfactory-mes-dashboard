import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Cpu } from 'lucide-react';
import { getMachines, addMachine } from '../../services/api';

const MachineManager = ({ isOpen, onClose }) => {
    const [machines, setMachines] = useState([]);
    const [newMachine, setNewMachine] = useState({ machine_name: '', line_id: 1 });

    // Membungkus loadMachines dengan useCallback untuk menghilangkan warning linter
    // dan mencegah render berlebih (garis merah hilang)
    const loadMachines = useCallback(async () => {
        try {
            const data = await getMachines();
            setMachines(data || []);
        } catch (error) {
            console.error("Gagal memuat daftar mesin:", error);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadMachines();
        }
    }, [isOpen, loadMachines]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addMachine(newMachine);
            setNewMachine({ machine_name: '', line_id: 1 });
            loadMachines(); // Refresh daftar setelah menambah data
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Gagal menyimpan mesin baru.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-70 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-800">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <Cpu size={20} />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight">Database Mesin</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-all"
                    >
                        <X size={24}/>
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* FORM TAMBAH */}
                    <div className="space-y-4">
                        <div className="pb-2 border-b border-slate-100">
                            <h4 className="font-bold text-slate-700">Tambah Mesin Baru</h4>
                            <p className="text-xs text-slate-400 font-medium">Daftarkan aset baru ke sistem</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nama Mesin</label>
                                <input 
                                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                    placeholder="Contoh: Robot Welding X"
                                    value={newMachine.machine_name}
                                    onChange={(e) => setNewMachine({...newMachine, machine_name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Penempatan Lini</label>
                                <select 
                                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={newMachine.line_id}
                                    onChange={(e) => setNewMachine({...newMachine, line_id: e.target.value})}
                                >
                                    <option value={1}>Line 01 - Welding</option>
                                    <option value={2}>Line 02 - Assembly</option>
                                    <option value={3}>Line 03 - Paint Shop</option>
                                </select>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                <Plus size={18}/> Simpan Mesin
                            </button>
                        </form>
                    </div>

                    {/* DAFTAR MESIN */}
                    <div className="flex flex-col h-full max-h-87.5">
                        <div className="pb-2 border-b border-slate-100 mb-4 flex justify-between items-center">
                            <h4 className="font-bold text-slate-700">Daftar Aktif</h4>
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-500">{machines.length} Aset</span>
                        </div>
                        <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                            {machines.length > 0 ? (
                                machines.map((m, index) => (
                                    <div key={m.id || index} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{m.machine_name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{m.line_name}</p>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400">
                                    <p className="text-xs italic font-medium">Belum ada mesin terdaftar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineManager;