/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { ADVICE_ARTICLES } from '../constants';
import { Lightbulb, ChevronRight, User, Calendar, BookOpen, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Advice() {
  const [selectedArticle, setSelectedArticle] = useState<typeof ADVICE_ARTICLES[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans tracking-tight">Career Insight & Advice</h1>
        <p className="text-gray-500 font-sans max-w-2xl">Expert tips and strategies to help you navigate the Nigerian job market and grow professionally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ADVICE_ARTICLES.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group hover:border-emerald-200 flex flex-col"
          >
            <div className="aspect-video bg-emerald-100 flex items-center justify-center text-emerald-600 relative overflow-hidden">
               <Lightbulb className="w-16 h-16 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
               <span className="absolute bottom-4 left-6 text-white text-xs font-bold uppercase tracking-widest bg-emerald-600/80 px-4 py-1 rounded-full backdrop-blur-sm">
                 {article.category}
               </span>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{article.title}</h3>
              <p className="text-gray-500 font-sans mb-6 line-clamp-3 leading-relaxed text-sm">{article.excerpt}</p>
              
              <div className="mt-auto space-y-6">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <div className="flex items-center gap-2"><User className="w-3 h-3" /> {article.author}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {article.date}</div>
                </div>
                
                <button 
                  onClick={() => setSelectedArticle(article)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 text-emerald-600 py-4 rounded-2xl font-bold border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"
                >
                  <BookOpen className="w-5 h-5" /> Read Full Article
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          >
             <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />
             <motion.div
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl"
             >
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-emerald-100 hover:text-emerald-600 transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-14">
                  <span className="inline-block px-4 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 tracking-widest uppercase mb-6">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">{selectedArticle.title}</h2>
                  
                  <div className="flex items-center gap-6 mb-12 py-6 border-y border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                        {selectedArticle.author[0]}
                      </div>
                      <div>
                        <div className="text-gray-900 font-bold">{selectedArticle.author}</div>
                        <div className="text-xs uppercase font-bold tracking-widest text-emerald-600">Expert Contributor</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                       Published {selectedArticle.date}
                    </div>
                  </div>

                  <div className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed font-sans">
                    <Markdown>{selectedArticle.content}</Markdown>
                  </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
