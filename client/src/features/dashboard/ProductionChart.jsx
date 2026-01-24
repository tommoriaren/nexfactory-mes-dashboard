// client/src/features/dashboard/ProductionChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductionChart = ({ data }) => {
  // Jika data belum ada, jangan render ResponsiveContainer dulu untuk menghindari error height -1
  if (!data || data.length === 0) return <div className="h-96 flex items-center justify-center text-slate-400">Tidak ada data untuk ditampilkan</div>;

  return (
    /* Pastikan div paling luar di komponen ini punya tinggi */
    <div className="w-full h-full min-h-96">
      {/* Tambahkan debounce={1} atau debounce={50} */}
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="line_name" />
          <YAxis />
          <Tooltip cursor={{fill: '#f8fafc'}} />
          <Legend />
          <Bar dataKey="total_ok" name="Unit OK" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="total_reject" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;