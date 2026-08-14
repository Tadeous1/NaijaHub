/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { Scholarships } from './pages/Scholarships';
import { Advice } from './pages/Advice';
import { AITools } from './pages/AITools';
import { AuthPage } from './pages/Auth';
import { PostListing } from './pages/PostListing';
import { Apply } from './pages/Apply';
import { AuthProvider } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/advice" element={<Advice />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/post-a-listing" element={<PostListing />} />
              <Route path="/apply/:id" element={<Apply />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
