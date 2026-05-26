import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/Core';
import { Megaphone, Mail, Send, AlertCircle, Info } from 'lucide-react';
import api from '../../api/axios';

const BroadcastTab = () => {
  const [audience, setAudience] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to send this email to all ${audience} users?`)) return;
    
    setSending(true);
    try {
      await api.post('/admin/broadcast/email', { audience, subject, message });
      setSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Broadcast failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 rounded-3xl bg-cyber-pink/10 border border-cyber-pink/20">
          <Megaphone className="w-8 h-8 text-cyber-pink" />
        </div>
        <div>
          <h2 className="text-3xl font-syne font-black uppercase tracking-tight">Mass Broadcast</h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">Deploy high-priority communications across the grid</p>
        </div>
      </div>

      <GlassCard className="p-8 border-white/5 bg-navy/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Mail className="w-32 h-32" />
        </div>

        <form onSubmit={handleBroadcast} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Target Audience</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white outline-none focus:border-cyber-pink/50 transition-all appearance-none"
              >
                <option value="all">ALL ACTIVE LEARNERS</option>
                <option value="admins">ADMINISTRATORS ONLY</option>
                <option value="beginner">BEGINNER TRACK</option>
                <option value="pro">PRO TRACK</option>
                <option value="master">MASTER TRACK</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Priority Level</label>
              <div className="flex gap-2">
                {['Normal', 'High', 'Critical'].map(level => (
                  <div key={level} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-[10px] font-black text-gray-400 cursor-pointer hover:bg-white/10 transition-all uppercase tracking-tighter">
                    {level}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Subject</label>
            <input 
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter broadcast subject..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white outline-none focus:border-cyber-pink/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message Content (Markdown Supported)</label>
            <textarea 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compose your message to the community..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-xs text-white outline-none focus:border-cyber-pink/50 transition-all resize-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-400 font-mono leading-relaxed uppercase">
              Warning: This action will trigger a mass-email sequence. Emails are batched to maintain server reputation. 
              Estimated delivery time: <span className="text-orange-500 font-bold">~5-10 minutes</span> depending on audience size.
            </p>
          </div>

          {success && (
            <div className="p-4 rounded-xl bg-cyber-green/10 border border-cyber-green/20 text-cyber-green font-mono text-[10px] text-center uppercase tracking-[0.2em] animate-pulse">
              Broadcast Sequence Initiated Successfully
            </div>
          )}

          <button 
            disabled={sending}
            type="submit"
            className="w-full bg-cyber-pink text-black py-4 rounded-2xl font-syne font-black uppercase tracking-widest hover:bg-cyber-pink/90 disabled:opacity-30 transition-all shadow-[0_0_30px_rgba(255,0,255,0.3)] flex items-center justify-center gap-3"
          >
            {sending ? 'UPLOADING TO GRID...' : <><Send className="w-5 h-5" /> TRANSMIT BROADCAST</>}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default BroadcastTab;
