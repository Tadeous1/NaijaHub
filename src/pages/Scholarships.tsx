/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Calendar, Award, ExternalLink, Search } from 'lucide-react';
import { FEATURED_SCHOLARSHIPS } from '../constants';
import { cn } from '../lib/utils';

export function Scholarships() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedField, setSelectedField] = useState('All');

  const allFields = ['All', ...new Set(FEATURED_SCHOLARSHIPS.flatMap(s => s.fieldOfStudy))];

  const filteredScholarships = FEATURED_SCHOLARSHIPS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesField = selectedField === 'All' || s.fieldOfStudy.includes(selectedField) || s.fieldOfStudy.includes('All Fields');
    return matchesCategory && matchesField;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-emerald-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Fund Your Future
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100 text-lg max-w-2xl mx-auto opacity-70"
          >
            Access educational grants and scholarships for undergraduate and postgraduate studies locally and abroad.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-200 mb-12 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Undergraduate', 'Postgraduate', 'Research', 'Short Course'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                  selectedCategory === cat 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Filter by Course:</label>
            <select 
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="bg-slate-50 border-none rounded-full px-6 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            >
              {allFields.map(field => <option key={field} value={field}>{field}</option>)}
            </select>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredScholarships.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-transparent hover:border-emerald-200 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                  s.coverage === 'Full' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                )}>
                  {s.coverage} Scholarship
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{s.title}</h3>
              <p className="text-gray-500 font-sans mb-6 line-clamp-2">{s.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">{s.provider}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Deadline: {s.deadLine}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widests">{s.category}</div>
                <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
                  Apply Now <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredScholarships.length === 0 && (
           <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No scholarships found in this category.</p>
           </div>
        )}
      </div>
    </div>
  );
}
