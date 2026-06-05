import React, { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { 
  Search, Filter, MoreVertical, 
  ShieldAlert, Trash2, 
  RotateCcw, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const [showUserMenu, setShowUserMenu] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', {
        params: {
          page,
          search,
          role: roleFilter,
          status: statusFilter,
          sortBy,
          sortOrder
        }
      });
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleBan = async () => {
    if (!banReason) return showError('Reason required');
    try {
      await api.put(`/admin/users/${selectedUser.id}/ban`, { reason: banReason });
      setShowBanModal(false);
      setBanReason('');
      fetchUsers();
    } catch (err) {
      showError('Ban failed');
    }
  };

  const handleUnban = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/unban`);
      fetchUsers();
    } catch (err) {
      showError('Unban failed');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== 'DELETE') return;
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
      fetchUsers();
    } catch (err) {
      showError('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-syne font-black uppercase tracking-tight">User Management</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-xs focus:border-purple/50 outline-none w-64"
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-xs outline-none focus:border-purple/50"
          >
            <option value="all">ALL ROLES</option>
            <option value="admin">ADMINS</option>
            <option value="user">USERS</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-xs outline-none focus:border-purple/50"
          >
            <option value="all">ALL STATUS</option>
            <option value="active">ACTIVE</option>
            <option value="banned">BANNED</option>
          </select>
        </div>
      </div>
      
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[10px] text-center uppercase tracking-[0.2em] animate-pulse">
          {errorMsg}
        </div>
      )}

      <GlassCard className="border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-white/5 text-gray-500 border-b border-white/10">
                <th className="py-4 px-4 font-black uppercase tracking-widest">USER</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">ROLE</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">LEVEL</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">XP</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">STATUS</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">JOINED</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-white/5 transition-colors ${user.is_banned ? 'bg-red-500/5' : ''}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-lg">
                        {user.avatar?.split(':')[0] || '👾'}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.username}</p>
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded uppercase text-[9px] font-black tracking-widest ${user.role === 'admin' ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-400 uppercase tracking-tighter">{user.level || 'beginner'}</td>
                  <td className="py-4 px-4 font-bold text-yellow">{(user.xp_total ?? 0).toLocaleString()}</td>
                  <td className="py-4 px-4">
                    {user.is_banned ? (
                      <span className="flex items-center gap-1.5 text-red-500 font-black text-[9px] uppercase tracking-widest animate-pulse">
                        <ShieldAlert className="w-3 h-3" /> BANNED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-cyber-green font-black text-[9px] uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2 relative">
                      {user.is_banned ? (
                        <button
                          onClick={() => handleUnban(user.id)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyber-green transition-all"
                          title="Unban User"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setSelectedUser(user); setShowBanModal(true); }}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                          title="Ban User"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {showUserMenu === user.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0f1c] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={() => { console.log('View Profile', user.id); setShowUserMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-mono text-gray-300">View Profile</button>
                          <button onClick={() => { api.put(`/admin/users/${user.id}/role`, { role: user.role === 'admin' ? 'user' : 'admin' }).then(fetchUsers); setShowUserMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-mono text-gray-300">{user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}</button>
                          <button onClick={() => { api.put(`/admin/users/${user.id}/reset-xp`).then(fetchUsers); setShowUserMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-mono text-gray-300">Reset XP</button>
                          <button onClick={() => { api.put(`/admin/users/${user.id}/reset-progress`).then(fetchUsers); setShowUserMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-mono text-gray-300">Reset Progress</button>
                          <button onClick={() => { api.post(`/admin/users/${user.id}/send-email`, { subject: 'Admin Notice', message: 'Hello' }).then(() => console.log('Sent')); setShowUserMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-mono text-gray-300">Send Email</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            Page {page} of {totalPages}
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

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <GlassCard className="max-w-md w-full p-8 border-red-500/30">
            <h3 className="text-xl font-syne font-black uppercase tracking-tight text-red-500 mb-2">Ban User Account</h3>
            <p className="text-sm text-gray-400 mb-6 font-mono">You are about to restrict access for <span className="text-white font-bold">{selectedUser?.username}</span>. This will invalidate all active sessions.</p>
            
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Reason for Suspension</label>
            <textarea 
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g. Terms of Service violation, Bot behavior..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs focus:border-red-500/50 outline-none mb-6 resize-none"
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setShowBanModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-mono text-xs font-bold transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleBan}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
              >
                CONFIRM BAN
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <GlassCard className="max-w-md w-full p-8 border-red-500/30">
            <h3 className="text-xl font-syne font-black uppercase tracking-tight text-red-500 mb-2">Delete User Account</h3>
            <p className="text-sm text-gray-400 mb-6 font-mono">You are about to permanently delete <span className="text-white font-bold">{selectedUser?.username}</span>. This action cannot be undone.</p>
            
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Type DELETE to confirm</label>
            <input 
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs focus:border-red-500/50 outline-none mb-6 text-center tracking-widest"
            />

            <div className="flex gap-4">
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmation(''); }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-mono text-xs font-bold transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleteConfirmation !== 'DELETE'}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 transition-all"
              >
                CONFIRM DELETE
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
