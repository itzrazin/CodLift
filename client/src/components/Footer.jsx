import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();
  
  // Hide footer on specific full-screen app routes where it breaks layout
  const hiddenRoutes = ['/learn', '/arena', '/onboarding'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (isHidden) return null;

  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md py-8 mt-auto z-50">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} CodLift Platform. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link to="/about" className="text-gray-400 hover:text-cyan transition-colors">About</Link>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-cyan transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-gray-400 hover:text-cyan transition-colors">Terms of Service</Link>
          <a href="mailto:hello@codlift.site" className="text-gray-400 hover:text-cyan transition-colors">hello@codlift.site</a>
        </div>
      </div>
    </footer>
  );
};
