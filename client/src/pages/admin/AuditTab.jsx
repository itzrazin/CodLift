import React, { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { ShieldCheck, Download, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const AuditTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/audit-log', { params: { page } });
      setLogs(res.data.logs);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const downloadCSV = () => {
    const headers = ['Timestamp', 'Admin', 'Action', 'Target Type', 'Target ID', 'Details'];
    const csvData = logs.map(log => [
      new Date(log.performed_at).toISOString(),
      log.admin_email,
      log.action,
      log.target_type,
      log.target_id,
      JSON.stringify(log.details).replace(/"/g, '""')
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `codlift_audit_log_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-syne font-black uppercase tracking-tight">System Audit Log</h2>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mt-1 text-cyber-cyan">Immutable record of all administrative operations</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" /> EXPORT CSV
        </button>
      </div>

      <GlassCard className="border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="bg-white/5 text-gray-500 border-b border-white/10">
                <th className="py-4 px-4 font-black uppercase">TIMESTAMP</th>
                <th className="py-4 px-4 font-black uppercase">ADMINISTRATOR</th>
                <th className="py-4 px-4 font-black uppercase">ACTION</th>
                <th className="py-4 px-4 font-black uppercase">TARGET</th>
                <th className="py-4 px-4 font-black uppercase">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-gray-400 whitespace-nowrap">{new Date(log.performed_at).toLocaleString()}</td>
                  <td className="py-4 px-4 font-bold text-white uppercase">{log.admin_email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-black border ${log.action.includes('DELETE') || log.action.includes('BAN') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">{log.target_type}</span>
                      <span className="text-white font-bold">{log.target_id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <pre className="max-w-[200px] truncate bg-black/40 p-2 rounded border border-white/5 text-[8px] group-hover:max-w-none group-hover:whitespace-pre-wrap transition-all">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            Showing entry {((page-1)*50)+1} - {Math.min(page*50, logs.length)}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AuditTab;
