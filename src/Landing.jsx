// src/Landing.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  // Smooth scroll helper
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-white font-manrope selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 bg-[#0A0A0C]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-white/20">
            <span className="material-symbols-outlined text-black text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          </div>
          <span className="font-bold tracking-tight text-sm">Financial UI</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => scrollTo('documentation')} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Documentation</button>
          <button onClick={() => scrollTo('enterprise')} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Enterprise</button>
          <button onClick={() => navigate('/login')} className="px-5 py-2 bg-white text-black text-xs font-bold rounded-md hover:bg-slate-200 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center border-b border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-white/10 rounded-full text-indigo-400 bg-indigo-500/10 mb-6 inline-block">
            Institutional Grade
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-tight">
            Advanced Financial Data <br/> Infrastructure.
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Secure, real-time ledger execution. Built for density, precision, and uncompromised performance at scale.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white text-black font-bold text-sm rounded-md shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-colors">
              Access Workspace
            </button>
            <button onClick={() => scrollTo('documentation')} className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold text-sm rounded-md hover:bg-white/5 transition-colors">
              Read the Docs
            </button>
          </div>
        </motion.div>
      </main>

      {/* Documentation Section */}
      <section id="documentation" className="py-24 px-8 border-b border-white/5">
         <div className="max-w-5xl mx-auto">
             <div className="mb-12">
                 <h2 className="text-3xl font-black tracking-tighter mb-4">Core Documentation</h2>
                 <p className="text-slate-400 text-sm max-w-2xl">Integrate Financial UI seamlessly into your stack. We provide native support for modern architectures including REST, GraphQL, and real-time WebSockets.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#111113] border border-white/10 p-8 rounded-xl relative overflow-hidden">
                   <div className="mb-6">
                      <span className="material-symbols-outlined text-indigo-400 mb-2 block">api</span>
                      <h3 className="text-xl font-bold mb-2">REST API Endpoints</h3>
                      <p className="text-xs text-slate-400 border-b border-white/10 pb-4 mb-4">Execute high-frequency ledger instructions via JSON payloads.</p>
                   </div>
                   <div className="bg-black/50 p-4 rounded-md font-mono text-xs text-green-400 border border-white/5">
                      <p>$ curl -X POST https://api.ledger-os.com/v1/tx \</p>
                      <p className="pl-4">-H "Authorization: Bearer sk_live_..." \</p>
                      <p className="pl-4">-d '{"{"}"amount": 50000, "currency": "USD"{"}"}'</p>
                   </div>
                </div>

                <div className="bg-[#111113] border border-white/10 p-8 rounded-xl relative overflow-hidden">
                   <div className="mb-6">
                      <span className="material-symbols-outlined text-indigo-400 mb-2 block">swap_calls</span>
                      <h3 className="text-xl font-bold mb-2">WebSockets Feed</h3>
                      <p className="text-xs text-slate-400 border-b border-white/10 pb-4 mb-4">Subscribe to real-time, low-latency financial state updates.</p>
                   </div>
                   <div className="bg-black/50 p-4 rounded-md font-mono text-xs text-indigo-300 border border-white/5">
                      <p>const ws = new WebSocket('wss://stream.ledger-os.com');</p>
                      <p className="mt-2">ws.onmessage = (event) =&gt; {"{"}</p>
                      <p className="pl-4">const data = JSON.parse(event.data);</p>
                      <p className="pl-4">console.log("New Entry:", data);</p>
                      <p>{"}"};</p>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-24 px-8 border-b border-white/5 bg-[#0F0F12]">
         <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
             <div className="flex-1">
                 <h2 className="text-3xl font-black tracking-tighter mb-4">Enterprise Grade Security & Compliance.</h2>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                     When you scale your financial operations, you require total assurance. The Financial UI Enterprise tier gives organizations dedicated networking, single tenancy, unlimited WebSocket scaling, and zero-trust auth integrations.
                 </p>
                 <ul className="space-y-4">
                     {['SOC 2 Type II Certified', 'SAML & SCIM SSO Integrations', '99.999% SLA Uptime Guarantee', 'Dedicated Private Slack Channel'].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                             <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                 <span className="material-symbols-outlined text-[12px] text-emerald-400 font-bold">check</span>
                             </div>
                             {item}
                         </li>
                     ))}
                 </ul>
                 <button onClick={() => navigate('/login')} className="mt-10 px-8 py-3 bg-white text-black font-bold text-sm rounded-md shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-colors">
                    Contact Enterprise Sales
                 </button>
             </div>
             <div className="flex-1 w-full bg-[#1A1A1E] border border-white/10 rounded-2xl p-8 relative">
                 <div className="absolute top-0 right-10 w-32 h-32 bg-indigo-500/20 blur-[60px]"></div>
                 <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                         <span className="material-symbols-outlined font-bold text-white">fingerprint</span>
                     </div>
                     <div>
                         <h4 className="font-bold text-lg">Zero Trust Topology</h4>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Active Monitoring</p>
                     </div>
                 </div>
                 <div className="space-y-3">
                     {[1,2,3].map(i => (
                         <div key={i} className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ x: "-100%" }} 
                                animate={{ x: "0%" }} 
                                transition={{ duration: 1.5 + i, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                                className="h-full bg-indigo-500 w-1/2 rounded-full"
                              ></motion.div>
                         </div>
                     ))}
                 </div>
                 <p className="text-xs text-slate-500 mt-6 font-mono text-center">Encrypting inbound payloadstreams...</p>
             </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[10px] text-slate-500 font-medium tracking-wide uppercase">
        © 2026 Financial UI Systems Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
