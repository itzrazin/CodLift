import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { BarChart3, TrendingDown, Award, Globe, Code2 } from 'lucide-react';
import api from '../../api/axios';

const AnalyticsTab = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/stats/lesson-completion');
        if (res.data.success) {
          const detectLang = (id) => {
            if (id.includes('html')) return 'HTML';
            if (id.includes('css')) return 'CSS';
            if (id.includes('js') || id.includes('javascript')) return 'JS';
            if (id.includes('py') || id.includes('python')) return 'PY';
            return id.split('-')[0].toUpperCase().slice(0, 4);
          };

          const mappedStats = res.data.data.map(item => ({
            id: item.lesson_id,
            title: item.lesson_id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            lang: detectLang(item.lesson_id),
            attempts: parseInt(item.total_attempts),
            completions: parseInt(item.total_completions),
            rate: parseFloat(item.completion_rate)
          }));
          setStats(mappedStats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 rounded-3xl bg-cyber-cyan/10 border border-cyber-cyan/20">
          <BarChart3 className="w-8 h-8 text-cyber-cyan" />
        </div>
        <div>
          <h2 className="text-3xl font-syne font-black uppercase tracking-tight">Curriculum Analytics</h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">Behavioral insights and completion funnel tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5 bg-red-500/5 border-red-500/10">
          <TrendingDown className="w-6 h-6 text-red-500 mb-4" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Highest Drop-off</h4>
          <p className="text-xl font-syne font-black text-white mt-1">
            {stats.length ? stats.reduce((a, b) => a.rate < b.rate ? a : b)?.title : 'N/A'}
          </p>
          <p className="text-[10px] font-mono text-red-400 mt-2">
            {stats.length ? `${100 - stats.reduce((a, b) => a.rate < b.rate ? a : b)?.rate}% of users stall here` : '---'}
          </p>
        </GlassCard>
        
        <GlassCard className="p-6 border-white/5 bg-cyber-green/5 border-cyber-green/10">
          <Award className="w-6 h-6 text-cyber-green mb-4" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Golden Path</h4>
          <p className="text-xl font-syne font-black text-white mt-1">
            {stats.length ? stats.reduce((a, b) => a.rate > b.rate ? a : b)?.title : 'N/A'}
          </p>
          <p className="text-[10px] font-mono text-cyber-green mt-2">
            {stats.length ? `${stats.reduce((a, b) => a.rate > b.rate ? a : b)?.rate}% completion efficiency` : '---'}
          </p>
        </GlassCard>

        <GlassCard className="p-6 border-white/5">
          <Globe className="w-6 h-6 text-blue-400 mb-4" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Platform Average</h4>
          <p className="text-xl font-syne font-black text-white mt-1">
            {stats.length ? (stats.reduce((sum, s) => sum + s.rate, 0) / stats.length).toFixed(1) : '0.0'}% Rate
          </p>
          <p className="text-[10px] font-mono text-gray-500 mt-2">Overall completion average</p>
        </GlassCard>
      </div>

      <GlassCard className="border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple" /> Detailed Completion Rates
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="py-4 px-6">LESSON MODULE</th>
                <th className="py-4 px-4 text-center">LANG</th>
                <th className="py-4 px-4 text-center">ATTEMPTS</th>
                <th className="py-4 px-4 text-center">SUCCESS</th>
                <th className="py-4 px-6">COMPLETION BAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-all group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white group-hover:text-cyber-cyan transition-colors">{item.title}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-tighter mt-0.5">{item.id}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-gray-400">{item.lang}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-gray-300">{item.attempts.toLocaleString()}</td>
                  <td className="py-4 px-4 text-center font-bold text-cyber-green">{item.completions.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${item.rate}%` }}
                          className={`h-full transition-all duration-1000 ${item.rate > 70 ? 'bg-cyber-green' : item.rate > 40 ? 'bg-yellow' : 'bg-red-500'}`}
                        />
                      </div>
                      <span className={`text-[10px] font-black w-8 ${item.rate > 70 ? 'text-cyber-green' : item.rate > 40 ? 'text-yellow' : 'text-red-500'}`}>
                        {item.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AnalyticsTab;
