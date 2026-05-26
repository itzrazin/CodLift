import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { Plus, Bell, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';

const AnnouncementsTab = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('info');

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/admin/announcements');
      setAnnouncements(res.data.announcements);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/announcements', { title: newTitle, message: newMessage, type: newType });
      setNewTitle('');
      setNewMessage('');
      setShowAddForm(false);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to create announcement');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-syne font-black uppercase tracking-tight">Platform Announcements</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple text-black rounded-xl font-mono text-[10px] font-black uppercase tracking-widest hover:bg-purple/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          {showAddForm ? 'CANCEL' : <><Plus className="w-3.5 h-3.5" /> NEW ANNOUNCEMENT</>}
        </button>
      </div>

      {showAddForm && (
        <GlassCard className="p-6 border-purple/30 bg-purple/5 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Announcement Title</label>
                <input 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-xs text-white outline-none focus:border-purple/50 transition-all"
                  placeholder="e.g. Scheduled Maintenance"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Banner Type</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-xs text-white outline-none focus:border-purple/50 transition-all appearance-none"
                >
                  <option value="info">INFO (BLUE)</option>
                  <option value="warning">WARNING (ORANGE)</option>
                  <option value="success">SUCCESS (GREEN)</option>
                  <option value="error">ERROR (RED)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message Body</label>
              <textarea 
                required
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white outline-none focus:border-purple/50 transition-all resize-none"
                placeholder="Details of the announcement..."
              />
            </div>
            <button type="submit" className="w-full py-3 bg-purple text-black rounded-xl font-mono text-[10px] font-black uppercase tracking-[0.2em] shadow-neo transition-all">
              DEPLOY ANNOUNCEMENT
            </button>
          </form>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((ann) => (
          <GlassCard key={ann.id} className="p-6 border-white/5 group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${ann.type === 'error' ? 'bg-red-500' : ann.type === 'warning' ? 'bg-orange-500' : ann.type === 'success' ? 'bg-cyber-green' : 'bg-blue-500'}`} />
            
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-2xl bg-white/5 ${ann.type === 'error' ? 'text-red-500' : ann.type === 'warning' ? 'text-orange-500' : ann.type === 'success' ? 'text-cyber-green' : 'text-blue-400'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-syne font-black text-white">{ann.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">{ann.message}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {new Date(ann.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${ann.is_active ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                      {ann.is_active ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                  {ann.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <Bell className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
            <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">No active announcements</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsTab;
