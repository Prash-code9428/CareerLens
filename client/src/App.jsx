import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

function Home() {
  const [apiStatus, setApiStatus] = useState({ loading: true, success: false, message: '' });

  useEffect(() => {
    axios.get('/api/health')
      .then(res => {
        setApiStatus({ loading: false, success: res.data.success, message: res.data.message });
      })
      .catch(err => {
        setApiStatus({
          loading: false,
          success: false,
          message: err.response?.data?.message || 'Cannot reach API server'
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-6 bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          CareerLens
        </h1>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          AI-Powered Job & Internship Discovery Platform for Students.
        </p>

        <div className="pt-4 border-t border-slate-800/80">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs">
            <span className="text-slate-400">Backend Status:</span>
            {apiStatus.loading ? (
              <span className="text-amber-400">Checking...</span>
            ) : apiStatus.success ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {apiStatus.message}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4" />
                {apiStatus.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
