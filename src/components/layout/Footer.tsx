/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="h-12 px-4 sm:px-8 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0 text-[11px] text-slate-400 font-medium">
      <div className="flex gap-6">
        <span>© {new Date().getFullYear()} NaijaHub</span>
        <button className="hover:text-emerald-600 transition-colors">Terms of Service</button>
        <button className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
      </div>
      <div className="hidden md:flex gap-4">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 5,000+ Active Jobs</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 200+ Scholarships</span>
      </div>
    </footer>
  );
}
