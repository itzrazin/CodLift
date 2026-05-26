import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { Mail, Clock, CheckCircle2, MessageSquare, Send, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const TicketsTab = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data.inquiries);
      if (res.data.inquiries.length > 0 && !selectedInquiry) {
        setSelectedInquiry(res.data.inquiries[0]);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admin/inquiries/${id}/status`, { status });
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleReply = async () => {
    if (!replyText) return;
    setSendingReply(true);
    try {
      await api.post(`/admin/inquiries/${selectedInquiry.id}/reply`, { message: replyText });
      setReplyText('');
      alert('Reply sent via email');
      fetchInquiries();
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
      {/* Ticket List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Open Tickets</h3>
        {inquiries.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => setSelectedInquiry(ticket)}
            className={`text-left p-4 rounded-2xl border transition-all ${selectedInquiry?.id === ticket.id ? 'bg-purple/10 border-purple/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${ticket.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-cyber-green/10 text-cyber-green border-cyber-green/20'}`}>
                {ticket.status}
              </span>
              <span className="text-[9px] font-mono text-gray-600">{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
            <p className="font-bold text-sm text-white truncate mb-1">{ticket.subject}</p>
            <p className="text-[10px] text-gray-500 font-mono truncate">{ticket.email}</p>
          </button>
        ))}
      </div>

      {/* Ticket Detail */}
      <div className="flex-1">
        {selectedInquiry ? (
          <GlassCard className="h-full flex flex-col border-white/5">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xl font-syne font-black text-white">{selectedInquiry.subject}</h3>
                <p className="text-xs text-gray-400 font-mono mt-1">From: {selectedInquiry.name} ({selectedInquiry.email})</p>
              </div>
              <div className="flex gap-2">
                {['Pending', 'In Progress', 'Resolved'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(selectedInquiry.id, s)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedInquiry.status === s ? 'bg-purple text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 bg-black/20">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-navy/20">
              <div className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the user..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-xs focus:border-purple/50 outline-none resize-none pr-32"
                />
                <button
                  disabled={!replyText || sendingReply}
                  onClick={handleReply}
                  className="absolute bottom-4 right-4 px-6 py-2.5 bg-purple text-black rounded-xl font-syne font-black text-[10px] uppercase tracking-wider hover:bg-purple/90 disabled:opacity-30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  {sendingReply ? 'SENDING...' : <><Send className="w-3.5 h-3.5" /> SEND REPLY</>}
                </button>
              </div>
              <p className="text-[9px] text-gray-600 font-mono mt-2 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" /> This will be sent to the user via official CodLift email
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsTab;
