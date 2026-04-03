// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F7F9] dark:bg-[#0A0A0C]">
      <div className="max-w-[400px] w-full">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-800 dark:border-white/20">
            <span className="material-symbols-outlined text-white dark:text-black" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Sign in to Financial UI</h1>
        </div>

        {/* Dense Form Card */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/5 p-8 rounded-xl shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Email address</label>
              <input 
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@editorial.com" 
                className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" 
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">Forgot?</a>
              </div>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" 
                required
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white dark:bg-white dark:text-black py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors mt-2">
              Sign In
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
               Don't have an account? <a href="#" className="text-slate-900 dark:text-white font-semibold">Contact Sales</a>
            </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
