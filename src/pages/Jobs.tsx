/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Filter, ArrowRight } from 'lucide-react';
import { FEATURED_JOBS } from '../constants';
import { cn } from '../lib/utils';

export function Jobs() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  const filteredJobs = FEATURED_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesExperience = selectedExperience === 'All' || job.experienceLevel === selectedExperience;
    return matchesSearch && matchesType && matchesExperience;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Find Your Next Job</h1>
        <p className="text-gray-500 font-sans max-w-2xl text-lg">Browse through verified job openings across Nigeria. Use the filters to find roles that match your experience level.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Refine Search
            </h3>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">Experience Level</label>
                <div className="space-y-1.5">
                  {['All', 'Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedExperience(level)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                        selectedExperience === level ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">Job Type</label>
                <div className="space-y-1.5">
                  {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                        selectedType === type ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Location</label>
                <select className="w-full bg-gray-50 border-none rounded-lg text-sm p-3 focus:ring-2 focus:ring-emerald-500">
                  <option>All States</option>
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Rivers</option>
                  <option>Kano</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-2xl p-6 text-white text-center">
            <h4 className="font-bold mb-2">Get Job Alerts</h4>
            <p className="text-xs text-emerald-100 mb-4">We'll notify you whenever a job matching your profile is posted.</p>
            <input type="email" placeholder="Email address" className="w-full rounded-xl bg-emerald-500 border-none text-sm placeholder:text-emerald-200 mb-3 focus:ring-white" />
            <button className="w-full bg-white text-emerald-600 py-3 rounded-xl text-sm font-bold shadow-lg">Subscribe</button>
          </div>
        </div>

        {/* Job List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by role, company, or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-emerald-200 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-800 text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                        {job.company?.[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-medium"><Briefcase className="w-3.5 h-3.5" /> {job.company}</span>
                          <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="font-bold text-slate-900 tracking-tight">{job.salary || 'Negotiable'}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Posted {job.postedAt}</div>
                      </div>
                      <button className="bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 group-hover:px-10">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                 <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-gray-900 mb-1">No jobs found</h3>
                 <p className="text-gray-500">Try adjusting your search filters or keywords.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
