// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, YAxis, Legend, PieChart, Pie, Cell } from 'recharts';

const assetAllocationData = [
  { name: 'Equities', value: 450000, color: '#818cf8' },
  { name: 'Real Estate', value: 200000, color: '#34d399' },
  { name: 'Cash Reserves', value: 100000, color: '#fbbf24' },
  { name: 'Crypto', value: 92500, color: '#f87171' },
];

const initialNotifications = [
    { id: 1, text: "AWS Billing cleared successfully", time: "2h ago", unread: true },
    { id: 2, text: "Large inflow detected from Stripe", time: "5h ago", unread: true },
    { id: 3, text: "Weekly system backup complete", time: "1d ago", unread: false },
];

const flowDataOptions = {
    'Quarterly': [{name:'Q1', Inflow:120000, Outflow:50000}, {name:'Q2', Inflow:140000, Outflow:65000}, {name:'Q3', Inflow:180000, Outflow:85000}, {name:'Q4', Inflow:250000, Outflow:110000}],
    'Monthly': [{name:'Jan', Inflow:40000, Outflow:15000}, {name:'Feb', Inflow:38000, Outflow:18000}, {name:'Mar', Inflow:42000, Outflow:17000}, {name:'Apr', Inflow:45000, Outflow:20000}, {name:'May', Inflow:50000, Outflow:25000}, {name:'Jun', Inflow:45000, Outflow:20000}]
};

const chartDataOptions = {
  '1M': [
    { name: 'W1', balance: 790000 }, { name: 'W2', balance: 815000 },
    { name: 'W3', balance: 830000 }, { name: 'W4', balance: 842500 },
  ],
  '3M': [
    { name: 'Apr', balance: 480000 }, { name: 'May', balance: 680000 }, { name: 'Jun', balance: 842500 },
  ],
  'YTD': [
    { name: 'Jan', balance: 420000 }, { name: 'Feb', balance: 390000 }, { name: 'Mar', balance: 520000 },
    { name: 'Apr', balance: 480000 }, { name: 'May', balance: 680000 }, { name: 'Jun', balance: 842500 },
  ]
};

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span className="font-mono text-xs text-slate-500">
            {time.toLocaleTimeString()}
        </span>
    );
};

const Dashboard = ({ onLogout, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');
  const [modalState, setModalState] = useState(null);
  const [chartRange, setChartRange] = useState('YTD');
  
  // Risk state
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);

  // Transaction Input state
  const [txAmount, setTxAmount] = useState('');
  
  // Dashboard Widget States
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [flowRange, setFlowRange] = useState('Quarterly');
  const [transferFrom, setTransferFrom] = useState('Vault');
  const [transferTo, setTransferTo] = useState('Operations');
  const [transferAmt, setTransferAmt] = useState('');

  // Dynamic Stats
  const [stats, setStats] = useState({
     portfolio: 842500.00,
     inflow: 124400.00,
     outflow: 48210.00
  });

  // Table Ledger State
  const initialFeed = [
      { id: 10023, date: '2026-04-02', brand: 'Apple Store Berlin', category: 'Equipment', status: 'Cleared', amt: -2499.00 },
      { id: 10022, date: '2026-04-01', brand: 'Venture Partners SA', category: 'Dividend', status: 'Pending', amt: 15000.00 },
      { id: 10021, date: '2026-03-30', brand: 'Lufthansa Airlines', category: 'Logistics', status: 'Cleared', amt: -1120.50 },
      { id: 10020, date: '2026-03-29', brand: 'Starbucks Corp', category: 'Operating', status: 'Cleared', amt: -45.00 },
      { id: 10019, date: '2026-03-28', brand: 'AWS Billing', category: 'Infrastructure', status: 'Failed', amt: -1842.20 }
  ];
  const [feed, setFeed] = useState(initialFeed);

  useEffect(() => {
    const interval = setInterval(() => {
       const companies = ['Stripe Inc.', 'AWS Billing', 'Uber Exec', 'Acme Corp', 'WeWork Hub', 'Google Cloud', 'Microsoft Azure', 'Tesla Logistics', 'SpaceX Contract'];
       const categories = ['Equipment', 'Logistics', 'Operating', 'Infrastructure', 'Dividend', 'Payroll'];
       const isPos = Math.random() > 0.6;
       const rawVal = Math.floor(Math.random() * 8000) + 120.50;
       
       const newItem = {
           id: Math.floor(Math.random() * 90000) + 10000,
           date: new Date().toISOString().split('T')[0],
           brand: companies[Math.floor(Math.random() * companies.length)],
           category: categories[Math.floor(Math.random() * categories.length)],
           status: 'Pending',
           amt: isPos ? rawVal : -rawVal
       };
       
       setFeed(prev => [newItem, ...prev].slice(0, 15)); // Keep 15 in table

       setStats(prev => ({
           portfolio: prev.portfolio + (isPos ? rawVal : -rawVal),
           inflow: isPos ? prev.inflow + rawVal : prev.inflow,
           outflow: !isPos ? prev.outflow + rawVal : prev.outflow
       }));

    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleAddTransaction = () => {
    const parsedVal = parseFloat(txAmount.replace(/[^0-9.-]+/g,""));
    if (!isNaN(parsedVal) && parsedVal !== 0) {
       const newItem = {
           id: Math.floor(Math.random() * 90000) + 10000,
           date: new Date().toISOString().split('T')[0],
           brand: 'Manual Entry (User)',
           category: 'Custom',
           status: 'Cleared',
           amt: parsedVal
       };
       
       setFeed(prev => [newItem, ...prev].slice(0, 15));
       
       setStats(prev => ({
           portfolio: prev.portfolio + parsedVal,
           inflow: parsedVal > 0 ? prev.inflow + parsedVal : prev.inflow,
           outflow: parsedVal < 0 ? prev.outflow + Math.abs(parsedVal) : prev.outflow
       }));
    }
    setTxAmount('');
    setModalState(null);
  };

  const handleQuickTransfer = () => {
      const val = parseFloat(transferAmt);
      if (val > 0) {
          // Dummy effect: log notification
          setNotifications([{
              id: Date.now(), text: `Transferred $${val} to ${transferTo}`, time: 'Just now', unread: true
          }, ...notifications]);
          setTransferAmt('');
      }
  };

  const exportCSV = () => {
      const headers = ["Date", "Ref ID", "Counterparty", "Category", "Status", "Amount"];
      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n"
          + feed.map(r => `${r.date},${r.id},"${r.brand}","${r.category}",${r.status},${r.amt}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "ledger_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const renderLedgerTable = () => (
      <section className="bg-white dark:bg-[#111113] rounded-lg border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
             <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Real-Time Ledger</h3>
             <button onClick={exportCSV} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">Export CSV</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs border-b border-slate-200 dark:border-white/5">
                        <th className="py-3 px-4 font-medium">Date</th>
                        <th className="py-3 px-4 font-medium">Ref ID</th>
                        <th className="py-3 px-4 font-medium">Counterparty</th>
                        <th className="py-3 px-4 font-medium hidden sm:table-cell">Category</th>
                        <th className="py-3 px-4 font-medium hidden md:table-cell">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {feed.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 text-xs font-mono text-slate-500">{row.date}</td>
                            <td className="py-3 px-4 text-xs font-mono text-slate-500">#{row.id}</td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{row.brand}</td>
                            <td className="py-3 px-4 text-slate-500 hidden sm:table-cell">{row.category}</td>
                            <td className="py-3 px-4 hidden md:table-cell">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                    row.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                    row.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                    'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                }`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className={`py-3 px-4 text-right font-mono text-xs font-medium ${row.amt > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                {row.amt > 0 ? '+' : ''}{row.amt.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </section>
  );

  const renderFlowAnalytics = () => (
     <div className="bg-white dark:bg-[#111113] p-6 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Flow Analytics</h2>
            <div className="flex bg-slate-100 dark:bg-white/5 rounded-md p-0.5">
                {['Quarterly', 'Monthly'].map(range => (
                    <button key={range} onClick={() => setFlowRange(range)} className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${flowRange === range ? 'bg-white shadow text-slate-900 dark:bg-[#111113] dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                        {range}
                    </button>
                ))}
            </div>
        </div>
        <div className="h-[280px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={flowDataOptions[flowRange]} margin={{top:0, right:0, left:-20, bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize:10, fill:'#64748b'}} />
              <YAxis tickLine={false} axisLine={false} tick={{fontSize:10, fill:'#64748b'}} />
              <RechartsTooltip contentStyle={{borderRadius:'6px', border:'1px solid #e2e8f0', backgroundColor: theme==='dark'?'#0A0A0C':'#fff', color: theme==='dark'?'#fff':'#0f172a', fontSize:'12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Inflow" fill="#818cf8" radius={[4,4,0,0]} barSize={24} />
              <Bar dataKey="Outflow" fill={theme==='dark'?'#e2e8f0':'#0f172a'} radius={[4,4,0,0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
     </div>
  );

  const renderOverview = () => (
    <div className="space-y-6 max-w-full">
      {/* Dense Metric Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111113] p-5 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 mb-1">Total Portfolio</p>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">${stats.portfolio.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
            <div className={`flex items-center gap-1 font-semibold text-xs ${stats.portfolio > 842500 ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span className="material-symbols-outlined text-[10px]">{stats.portfolio > 842500 ? 'arrow_upward' : 'arrow_downward'}</span>
              <span>12.4% MoM</span>
            </div>
        </div>
        <div className="bg-white dark:bg-[#111113] p-5 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
           <p className="text-xs font-semibold text-slate-500 mb-1">Cumulative Inflow</p>
           <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">${stats.inflow.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
           <div className="flex items-center gap-1 text-slate-500 font-semibold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Syncing feeds</span>
           </div>
        </div>
        <div className="bg-white dark:bg-[#111113] p-5 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
             <p className="text-xs font-semibold text-slate-500 mb-1">Operational Outflow</p>
             <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">${stats.outflow.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
             <div className="flex items-center gap-1 text-slate-500 font-semibold text-xs">
              <span>Updated just now</span>
           </div>
        </div>
        <div className="bg-slate-900 dark:bg-white p-5 rounded-lg shadow-sm border border-slate-800 dark:border-white/20 flex flex-col justify-between">
            <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">Vault Reserves</p>
                <h2 className="text-2xl font-bold tracking-tight text-white dark:text-slate-900">$210,000</h2>
            </div>
            <div className="mt-2">
                <span className="text-[10px] font-bold bg-white/10 dark:bg-black/10 px-2 py-1 rounded text-white dark:text-slate-900">85% SECURED</span>
            </div>
        </div>
      </section>

      {/* Middle Section: Main Chart + Side Widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111113] p-6 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="text-sm font-semibold mb-6 flex justify-between items-center text-slate-900 dark:text-white">
            Balance Progression
            <div className="flex items-center gap-2">
               <button onClick={() => setChartRange('1M')} className={`text-xs px-2 py-1 rounded font-medium ${chartRange === '1M' ? 'bg-slate-100 text-slate-900 dark:text-white dark:bg-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'} transition-colors`}>1M</button>
               <button onClick={() => setChartRange('3M')} className={`text-xs px-2 py-1 rounded font-medium ${chartRange === '3M' ? 'bg-slate-100 text-slate-900 dark:text-white dark:bg-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'} transition-colors`}>3M</button>
               <button onClick={() => setChartRange('YTD')} className={`text-xs px-2 py-1 rounded font-medium ${chartRange === 'YTD' ? 'bg-slate-100 text-slate-900 dark:text-white dark:bg-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'} transition-colors`}>YTD</button>
            </div>
          </h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataOptions[chartRange]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: theme === 'dark' ? '#0A0A0C' : '#fff', color: theme === 'dark' ? '#fff' : '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="balance" stroke={theme === 'dark' ? '#818cf8' : '#0f172a'} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Widgets (Spans 1 col) */}
        <div className="space-y-6 flex flex-col h-full">
            {/* Asset Allocation */}
            <div className="bg-white dark:bg-[#111113] p-5 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
               <h3 className="text-sm font-semibold mb-4 text-slate-900 dark:text-white">Asset Allocation</h3>
               <div className="h-[120px] w-full flex items-center justify-center relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                         <Pie data={assetAllocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} stroke="none" paddingAngle={2}>
                             {assetAllocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                         </Pie>
                         <RechartsTooltip contentStyle={{borderRadius:'6px', border:'1px solid #e2e8f0', backgroundColor: theme==='dark'?'#0A0A0C':'#fff', color: theme==='dark'?'#fff':'#0f172a', fontSize:'12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} itemStyle={{fontSize:'12px'}} formatter={(val) => '$'+val.toLocaleString()} />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-900 dark:text-white pointer-events-none">100%</div>
               </div>
               <div className="mt-4 space-y-2">
                   {assetAllocationData.map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span> <span className="text-slate-500">{item.name}</span></div>
                          <span className="font-semibold text-slate-900 dark:text-white">${item.value.toLocaleString()}</span>
                       </div>
                   ))}
               </div>
            </div>

            {/* Quick Action Widget */}
            <div className="bg-slate-900 dark:bg-white p-5 rounded-lg shadow-sm border border-slate-800 dark:border-white/20 flex flex-col justify-between" style={{flex: 1}}>
                <div>
                    <h3 className="text-sm font-semibold mb-4 text-white dark:text-slate-900">Quick Transfer</h3>
                    <div className="flex items-center gap-2 mb-3">
                        <select value={transferFrom} onChange={e => setTransferFrom(e.target.value)} className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] p-2 rounded w-full outline-none border border-slate-700 dark:border-slate-300 font-medium cursor-pointer">
                            <option>Vault</option><option>Operations</option><option>Treasury</option>
                        </select>
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-sm">arrow_forward</span>
                        <select value={transferTo} onChange={e => setTransferTo(e.target.value)} className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] p-2 rounded w-full outline-none border border-slate-700 dark:border-slate-300 font-medium cursor-pointer">
                             <option>Operations</option><option>Vault</option><option>Treasury</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 mt-2">
                   <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs font-semibold">$</span>
                      <input type="number" value={transferAmt} onChange={e => setTransferAmt(e.target.value)} placeholder="0.00" className="w-full bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700 dark:border-slate-300 rounded p-2 pl-7 text-xs outline-none focus:border-indigo-500 font-mono" />
                   </div>
                   <button onClick={handleQuickTransfer} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"><span className="material-symbols-outlined text-[14px]">send</span></button>
                </div>
            </div>
        </div>
      </section>

      {/* Detailed Ledger Table */}
      {renderLedgerTable()}
    </div>
  );

  return (
    <div className="flex min-h-screen font-inter bg-[#F7F7F9] dark:bg-[#0A0A0C] text-slate-900 dark:text-slate-100 w-full overflow-x-hidden transition-colors duration-200">
      {/* Professional Narrow Sidebar */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-white dark:bg-[#111113] flex-col py-6 px-4 z-50 border-r border-slate-200 dark:border-white/5 transition-colors duration-200">
        <div className="px-2 mb-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center dark:bg-white shrink-0">
              <span className="material-symbols-outlined text-white dark:text-black text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
            </div>
            <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Financial UI</h1>
            <span className="ml-auto text-[10px] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded font-semibold text-slate-500">PRO</span>
          </div>
          
          <div className="relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
             <input type="text" placeholder="Search..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-md py-1.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" />
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-4">Menu</p>
          {[{ name: 'Dashboard', icon: 'dashboard' }, { name: 'Transactions', icon: 'receipt_long' }, { name: 'Insights', icon: 'insights' }, { name: 'Settings', icon: 'settings' }].map((link) => (
            <a
              key={link.name} href="#"
              onClick={(e) => { e.preventDefault(); if (link.name === 'Settings') setModalState('SETTINGS'); else setActiveSidebar(link.name); }}
              className={`flex items-center gap-3 py-2 px-2 rounded-md transition-colors text-sm ${activeSidebar === link.name ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white font-medium' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[1.1rem] shrink-0" style={{ fontVariationSettings: activeSidebar === link.name ? "'FILL' 1" : undefined }}>{link.icon}</span>
              <span className="truncate">{link.name}</span>
            </a>
          ))}
        </nav>
        
        <div className="mt-auto border-t border-slate-200 dark:border-white/5 pt-4">
          <button onClick={() => setModalState('TRANSACTION')} className="w-full bg-slate-900 text-white dark:bg-white dark:text-black py-2 rounded-md font-semibold text-xs transition-colors hover:bg-slate-800 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span> New Entry
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen flex-1 relative z-10 flex flex-col max-w-full overflow-hidden">
        <header className="w-full sticky top-0 z-40 bg-[#F7F7F9]/80 dark:bg-[#0A0A0C]/80 backdrop-blur-md flex justify-between items-center px-4 md:px-8 py-3 border-b border-slate-200 dark:border-white/5 max-w-full transition-colors duration-200">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
             {activeSidebar === 'Dashboard' ? (
              ['Overview', 'Capital Flow', 'Risk Assessment'].map(tab => (
                 <a key={tab} href="#" onClick={(e) => { e.preventDefault(); setActiveTab(tab); }} className={`text-xs tracking-tight px-3 py-1.5 rounded-md transition-colors font-medium whitespace-nowrap block ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-200 dark:bg-[#111113] dark:text-white dark:border-white/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                   {tab}
                 </a>
              ))
             ) : (
                <h2 className="text-sm font-bold text-slate-900 dark:text-white px-2 tracking-tight">{activeSidebar}</h2>
             )}
          </div>
          <div className="flex items-center gap-3 shrink-0 px-2 pl-4 border-l border-slate-200 dark:border-white/5 relative">
             <LiveClock />
             
             {/* Notification Bell */}
             <div className="relative">
                 <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-300 dark:hover:bg-white/20 transition-colors ml-2" onClick={() => setShowNotifications(!showNotifications)}>
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-sm">notifications</span>
                    {notifications.some(n => n.unread) && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#F7F7F9] dark:border-[#0A0A0C]"></span>
                    )}
                 </div>
                 
                 {/* Notification Dropdown */}
                 {showNotifications && (
                     <React.Fragment>
                         <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                         <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/5 rounded-lg shadow-xl z-50 overflow-hidden">
                            <div className="p-3 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Activity</h4>
                                <button className="text-[10px] text-indigo-500 font-semibold hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); setNotifications(notifications.map(n => ({...n, unread: false}))); }}>Mark all read</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`p-3 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-default ${notif.unread ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}`}>
                                            <p className={`text-xs ${notif.unread ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{notif.text}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                         </div>
                     </React.Fragment>
                 )}
             </div>

             <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-300 dark:hover:bg-white/20 transition-colors" onClick={() => setModalState('LOGOUT')}>
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-sm">logout</span>
             </div>
          </div>
        </header>

        <div className="px-4 md:px-8 py-6 w-full flex-1 max-w-[1200px]">
           {activeSidebar === 'Dashboard' && (
             <>
               {activeTab === 'Overview' && renderOverview()}
               {activeTab === 'Capital Flow' && renderFlowAnalytics()}
               {activeTab === 'Risk Assessment' && (
                 <div className="w-full max-w-2xl mt-10">
                   {riskAcknowledged ? (
                     <div className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/30 flex items-start gap-6">
                        <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                        <div>
                            <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Systems Secured</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Hard lock is in effect. All ledgers are operating normally under restricted execution access protocols.</p>
                            <button onClick={() => setRiskAcknowledged(false)} className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Revert to Open Mode</button>
                        </div>
                     </div>
                   ) : (
                     <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-lg border border-red-200 dark:border-red-900/30 flex items-start gap-6">
                        <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
                        <div>
                            <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Risk Profile Elevated</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">High arbitrage volatility detected. System strongly recommends placing accounts in hard lock.</p>
                            <button onClick={() => setRiskAcknowledged(true)} className="bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded shadow-sm hover:bg-red-600 transition-colors">
                               Acknowledge & Lock
                            </button>
                        </div>
                     </div>
                   )}
                 </div>
               )}
             </>
           )}

           {activeSidebar === 'Transactions' && (
               <div className="mt-4">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Transaction History</h2>
                  {renderLedgerTable()}
               </div>
           )}

           {activeSidebar === 'Insights' && (
               <div className="mt-4">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Advanced Insights</h2>
                  {renderFlowAnalytics()}
               </div>
           )}
        </div>
      </main>

      {/* Flat Desktop Modals */}
      {modalState && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all" onClick={() => setModalState(null)}>
          <div className="bg-white dark:bg-[#111113] p-6 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 max-w-sm w-full transition-all" onClick={e => e.stopPropagation()}>
             
             {modalState === 'LOGOUT' && (
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-rose-500 text-xl">logout</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Sign out</h3>
                <p className="text-xs text-slate-500 mb-6">Are you sure you want to end your session?</p>
                <div className="flex gap-3">
                  <button onClick={() => setModalState(null)} className="flex-1 py-2 bg-white dark:bg-transparent rounded-md text-sm font-semibold border border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={() => { setModalState(null); setTimeout(() => onLogout(), 200); }} className="flex-1 py-2 bg-rose-500 text-white rounded-md text-sm font-semibold hover:bg-rose-600 transition-colors">Sign out</button>
                </div>
              </div>
            )}
             
             {modalState === 'SETTINGS' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Settings</h3>
                <div className="space-y-3">
                    <div onClick={toggleTheme} className="p-3 bg-slate-50 dark:bg-white/5 rounded-md flex justify-between items-center cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Theme Mode</p>
                        <p className="text-[10px] text-slate-500 tracking-wide uppercase">{theme}</p>
                      </div>
                      <span className="material-symbols-outlined text-lg">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </div>
                </div>
              </div>
            )}

            {modalState === 'TRANSACTION' && (
                <div>
                   <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">New Transaction</h3>
                   <p className="text-xs text-slate-500 mb-5">Manually post a transaction to the live ledger. Use negatives for outflow.</p>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="text-xs font-semibold mb-1 block text-slate-600 dark:text-slate-400">Amount (USD)</label>
                         <input 
                            type="text" 
                            autoFocus
                            value={txAmount}
                            onChange={(e) => setTxAmount(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTransaction()}
                            placeholder="e.g. 5000 or -1500" 
                            className="w-full bg-transparent border border-slate-300 dark:border-white/20 p-2 rounded-md text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-white" 
                         />
                      </div>
                      <div className="flex gap-2 mt-4">
                         <button onClick={() => setModalState(null)} className="flex-1 py-2 bg-slate-100 dark:bg-white/5 rounded-md text-sm font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
                         <button onClick={handleAddTransaction} className="flex-1 bg-slate-900 text-white dark:bg-white dark:text-black py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors">Submit Entry</button>
                      </div>
                   </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
