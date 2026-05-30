import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle2, XCircle, X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../utils/config';

export const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dismissed_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Fetch active announcements (public endpoint)
        const res = await axios.get(`${API_URL}/announcements`);
        const activeAnnouncements = res.data.announcements || [];
        setAnnouncements(activeAnnouncements);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDismiss = (id) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    sessionStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed));
  };

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 p-4 max-w-7xl mx-auto z-50 relative">
      <AnimatePresence>
        {visibleAnnouncements.map((ann) => {
          let Icon = Bell;
          let colors = 'bg-blue-500/10 border-blue-500/30 text-blue-400';
          if (ann.type === 'error') {
            Icon = XCircle;
            colors = 'bg-red-500/10 border-red-500/30 text-red-500';
          } else if (ann.type === 'warning') {
            Icon = AlertTriangle;
            colors = 'bg-orange-500/10 border-orange-500/30 text-orange-500';
          } else if (ann.type === 'success') {
            Icon = CheckCircle2;
            colors = 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green';
          }

          return (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-start justify-between p-4 rounded-xl border backdrop-blur-md ${colors}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-syne font-bold text-white">{ann.title}</h4>
                  <p className="font-mono text-xs opacity-90 mt-1">{ann.message}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDismiss(ann.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-4 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
