/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { Briefcase, GraduationCap, PenTool, Lightbulb, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'Scholarships', path: '/scholarships', icon: GraduationCap },
  { name: 'AI Tools', path: '/ai-tools', icon: PenTool },
  { name: 'Advice', path: '/advice', icon: Lightbulb },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="h-16 px-4 sm:px-8 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Naija<span className="text-emerald-600">Hub</span>
          </span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-emerald-600" : "hover:text-emerald-600"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        {user ? <span className="max-w-28 truncate text-xs font-semibold text-slate-500">Hi, {user.name}</span> : null}
        <Link to={user ? '/post-a-listing' : '/auth'} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          {user ? 'Manage Listings' : 'Sign In'}
        </Link>
        {user ? <button onClick={() => signOut()} className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900">Sign out</button> : null}
        <Link to="/post-a-listing" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-full shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-colors">Post a Listing</Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 left-0 right-0 md:hidden bg-white border-b border-slate-200 shadow-xl z-50 p-6 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "p-3 rounded-xl text-base font-medium flex items-center gap-3",
                  location.pathname === item.path ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            <Link to={user ? '/post-a-listing' : '/auth'} onClick={() => setIsOpen(false)} className="w-full mt-4 bg-emerald-600 text-white px-5 py-4 rounded-full font-bold text-center">{user ? 'Manage Listings' : 'Sign In to Post'}</Link>
            {user ? <button onClick={() => { setIsOpen(false); signOut(); }} className="text-sm text-slate-500 py-2">Sign out</button> : null}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
