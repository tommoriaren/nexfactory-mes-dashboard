import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Factory } from 'lucide-react';
import { getProductionLines, addProductionLine } from '../../services/api';

const LineManager = ({ isOpen, onClose }) => {
    const [lines, setLines] = useState([]);
    const [newLineName, setNewLineName] = useState('');

    const loadLines = useCallback(async () => {
        try {
            const data = await getProductionLines();
            setLines(data || []);
        } catch (error) {
            console.error("Gagal memuat lini:", error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isOpen) loadLines();
    }, [isOpen, loadLines]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProductionLine({ line_name: newLineName });
            setNewLineName('');
            loadLines();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Gagal menambah lini.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-70 p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <Factory size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Kelola Lini Produksi</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input 
                            className="flex-1 border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Contoh: Line 04 - Packing"
                            value={newLineName}
                            onChange={(e) => setNewLineName(e.target.value)}
                            required
                        />
                        <button className="bg-blue-600 text-white px-4 rounded-lg font-bold hover:bg-blue-700 transition-all">
                            <Plus size={20}/>
                        </button>
                    </form>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {lines.map((line) => (
                            <div key={line.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                                <span className="font-bold text-slate-700">{line.line_name}</span>
                                <button className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineManager;