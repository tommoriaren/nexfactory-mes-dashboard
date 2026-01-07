import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Factory, 
  Settings, 
  AlertTriangle, 
  Plus, 
  RefreshCcw, 
  AlertOctagon,
  Cpu
} from 'lucide-react';

// Services
import { getProductionSummary, getDowntimeLogs } from './services/api';

// Components
import ProductionChart from './features/dashboard/ProductionChart';
import ProductionModal from './features/dashboard/ProductionModal';
import DowntimeTable from './features/dashboard/DowntimeTable';
import DowntimeModal from './features/dashboard/DowntimeModal';
import MachineManager from './features/dashboard/MachineManager';
import LineManager from './features/dashboard/LineManager';

function App() {
  // --- STATES ---
  const [data, setData] = useState([]);
  const [downtimeData, setDowntimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
  const [isMachineManagerOpen, setIsMachineManagerOpen] = useState(false);
  const [isLineManagerOpen, setIsLineManagerOpen] = useState(false);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [prodRes, downRes] = await Promise.all([
        getProductionSummary(),
        getDowntimeLogs()
      ]);
      
      setData(prodRes || []);
      setDowntimeData(downRes || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Gagal sinkronisasi data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle for Initial Load & Auto Refresh
  useEffect(() => {
    fetchData(); 

    const interval = setInterval(() => {
      fetchData();
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Factory size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">NexFactory</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveMenu('downtime')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              activeMenu === 'downtime' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle size={20} /> <span className="font-medium">Downtime Log</span>
          </button>

          <button 
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              activeMenu === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings size={20} /> <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mt-auto">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">Live Monitoring Active</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* CONTEXTUAL HEADER */}
        <header className="mb-8 flex justify-between items-center border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">
              {activeMenu === 'dashboard' && 'Production Dashboard'}
              {activeMenu === 'downtime' && 'Downtime Monitoring'}
              {activeMenu === 'settings' && 'System Configuration'}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500 text-sm italic">
                {activeMenu === 'dashboard' && 'Monitoring real-time output - Bekasi Plant 1'}
                {activeMenu === 'downtime' && 'Tracking and resolving machine failures'}
                {activeMenu === 'settings' && 'Manage master data and system preferences'}
              </p>
              {activeMenu !== 'settings' && (
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tighter">
                  Last Sync: {lastUpdated.toLocaleTimeString('id-ID')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeMenu !== 'settings' ? (
              <>
                <button 
                  onClick={fetchData} 
                  className="p-2.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-lg transition-all active:rotate-180"
                  title="Refresh Data"
                >
                  <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                
                {activeMenu === 'downtime' ? (
                  <button onClick={() => setIsDowntimeModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95 font-bold uppercase text-xs tracking-wider">
                    <AlertOctagon size={18} /> <span>Lapor Kendala</span>
                  </button>
                ) : (
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95 font-bold uppercase text-xs tracking-wider">
                    <Plus size={18} /> <span>Input Log</span>
                  </button>
                )}
              </>
            ) : (
              <button onClick={() => alert("Hubungi IT Support di Ext: 1234")} className="text-sm font-bold text-blue-600 hover:underline">
                Need Help?
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold animate-pulse">Syncing with Factory Server...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* --- DASHBOARD VIEW --- */}
            {activeMenu === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{item.line_name}</h3>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-4xl font-black text-slate-900">{item.total_ok.toLocaleString()}</p>
                        <div className="text-right">
                           <p className="text-sm font-bold text-red-500">{item.total_reject} Reject</p>
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(item.total_ok / (item.total_ok + item.total_reject || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96 overflow-hidden">
                  <ProductionChart data={data} />
                </div>
              </>
            )}

            {/* --- DOWNTIME VIEW --- */}
            {activeMenu === 'downtime' && (
              <DowntimeTable logs={downtimeData} onRefresh={fetchData} />
            )}

            {/* --- SETTINGS VIEW --- */}
            {activeMenu === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Kartu Profil */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Factory size={18} className="text-blue-600" /> Profil Stasiun Kerja
                    </h3>
                    <div className="space-y-4 border-t border-slate-50 pt-4">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plant Location</label>
                        <p className="font-medium text-slate-700 font-sans">Bekasi West Java - Plant 1</p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Version</label>
                        <p className="font-medium text-slate-700 text-sm">NexFactory v1.0.4-stable (MERN)</p>
                      </div>
                    </div>
                  </div>

                  {/* Manajemen Data Master */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Settings size={18} className="text-blue-600" /> Manajemen Data Master
                    </h3>
                    <div className="space-y-3 border-t border-slate-50 pt-4">
                      {/* Kelola Mesin */}
                      <button 
                        onClick={() => setIsMachineManagerOpen(true)}
                        className="w-full text-left p-4 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-700 block">Kelola Daftar Mesin</span>
                          <span className="text-[10px] text-slate-400 italic font-medium">Tambah atau hapus aset mesin produksi</span>
                        </div>
                        <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                          <Cpu size={20} />
                        </div>
                      </button>

                      {/* Kelola Lini Produksi */}
                      <button 
                        onClick={() => setIsLineManagerOpen(true)}
                        className="w-full text-left p-4 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-700 block">Kelola Lini Produksi</span>
                          <span className="text-[10px] text-slate-400 italic font-medium">Pengaturan departemen dan area</span>
                        </div>
                        <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                          <Factory size={20} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Banner Bantuan */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg shadow-blue-100">
                  <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h4 className="font-bold text-lg">Butuh Bantuan Teknis?</h4>
                    <p className="text-blue-100 text-sm">Hubungi departemen IT jika terjadi kendala pada sinkronisasi server.</p>
                  </div>
                  <button 
                    onClick={() => alert("Pusat Bantuan: support@nexfactory.com")}
                    className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors w-full md:w-auto active:scale-95"
                  >
                    Buka Support
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODALS */}
        <ProductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchData} />
        <DowntimeModal isOpen={isDowntimeModalOpen} onClose={() => setIsDowntimeModalOpen(false)} onRefresh={fetchData} />
        <MachineManager isOpen={isMachineManagerOpen} onClose={() => setIsMachineManagerOpen(false)} />
        <LineManager isOpen={isLineManagerOpen} onClose={() => setIsLineManagerOpen(false)} />
        
      </main>
    </div>
  );
}

export default App;