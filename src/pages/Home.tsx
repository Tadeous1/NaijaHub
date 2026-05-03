/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Search, Briefcase, GraduationCap, PenTool, ArrowRight, TrendingUp, Users, Award, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEATURED_JOBS, FEATURED_SCHOLARSHIPS } from '../constants';
import { cn } from '../lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <main className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[160px]">
        {/* Search & Hero Section (Bento Primary) */}
        <section className="md:col-span-8 md:row-span-2 bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center border border-emerald-800 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 z-10 tracking-tight leading-tight"
          >
            Find your next big <br /> break in Nigeria.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100 mb-8 z-10 max-w-lg text-lg opacity-80"
          >
            Connecting local talent with global opportunities across Lagos, Abuja, and beyond.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-2 z-10 bg-white p-2 rounded-2xl shadow-lg">
            <input 
              type="text" 
              placeholder="Job title, keyword, or company..." 
              className="flex-grow px-4 py-3 text-sm focus:outline-none text-slate-900 font-medium"
            />
            <div className="hidden sm:block w-px h-10 bg-slate-200 my-auto"></div>
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </section>

        {/* AI CV Builder (Bento Tool) */}
        <section className="md:col-span-4 md:row-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm group hover:border-indigo-200 transition-all">
          <div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">AI CV Builder</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Create a professional ATS-friendly CV in minutes. Tailored for Nigerian recruiters and modern standard.
            </p>
          </div>
          <Link 
            to="/ai-tools"
            className="w-full py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 text-center transition-colors"
          >
            Generate My CV
          </Link>
        </section>

        {/* Featured Jobs (Bento List) */}
        <section className="md:col-span-4 md:row-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Hot Jobs</h3>
            <Link to="/jobs" className="text-xs font-bold text-emerald-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {FEATURED_JOBS.map((job) => (
              <div 
                key={job.id} 
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4 hover:border-emerald-200 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs uppercase">
                  {job.company[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate text-slate-900 group-hover:text-emerald-600 transition-colors">{job.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">{job.company} • {job.location}</p>
                  <p className="text-[11px] font-bold text-emerald-600 mt-1">{job.salary || 'Negotiable'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scholarships (Bento Info) */}
        <section className="md:col-span-5 md:row-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              Scholarships <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </h3>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-tight">Active Rewards</span>
          </div>
          <div className="space-y-5">
            {FEATURED_SCHOLARSHIPS.map((s, i) => (
              <div key={s.id} className="group cursor-pointer">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{s.category}</p>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors leading-tight">{s.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                {i < FEATURED_SCHOLARSHIPS.length - 1 && <div className="h-px bg-slate-100 mt-5"></div>}
              </div>
            ))}
          </div>
          <Link to="/scholarships" className="mt-auto pt-6 flex items-center gap-2 text-emerald-600 text-sm font-bold hover:gap-3 transition-all">
            See All Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Insights (Bento Accent) */}
        <section className="md:col-span-3 md:row-span-3 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex flex-col shadow-sm">
          <h3 className="font-bold text-emerald-900 text-lg mb-6 flex items-center gap-2">
            Career Lab <Lightbulb className="w-5 h-5 text-amber-500" />
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 group cursor-pointer hover:shadow-md transition-all">
              <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Salary Tips</p>
              <h4 className="text-sm font-bold text-slate-800 leading-snug">Negotiating pay in a Nigerian startup.</h4>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 group cursor-pointer hover:shadow-md transition-all">
              <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Interview</p>
              <h4 className="text-sm font-bold text-slate-800 leading-snug">The 5 questions every bank will ask.</h4>
            </div>
            <div className="mt-auto hidden lg:block">
              <p className="text-xs text-emerald-800 opacity-60 italic leading-relaxed">"Knowledge is power, but a great CV gets you in the door."</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-200 border-2 border-white overflow-hidden flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                  TA
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-900 leading-none">Tunde Ajayi</p>
                  <p className="text-[10px] text-emerald-700 mt-1 opacity-75">HR Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
