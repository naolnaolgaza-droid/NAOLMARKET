/*
TradingSite_Naol.jsx
Single-file React + Tailwind landing/dashboard for a Trading/Finance website.

How to use
1. Drop this file into a Create React App / Vite React project.
2. Make sure Tailwind CSS is configured in the project.
3. Install dependencies (if you want charts and icons):
   npm install recharts lucide-react
4. Replace placeholder data and API hooks with your live data providers (e.g., Finnhub, Alpaca, Polygon, Binance).

Design notes
- Theme uses the user's preferred colors: golden (#D4AF37) and black.
- Clean responsive layout, hero + live tickers + portfolio/trades + chart + footer.

This is a single-file example meant to be a starting point. Tell me if you want:
- Real-time websockets integration for live price streaming.
- Authentication (email/Google) and user accounts.
- Deployment-ready repo structure.
*/

import React, {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid} from 'recharts';
import {Home, BarChart2, Activity, Clock, ChevronDown} from 'lucide-react';

// Sample fake data for the equity curve and tickers
const sampleEquity = Array.from({length: 20}).map((_, i) => ({
  time: `T${i+1}`,
  value: Math.round(10000 + Math.sin(i/3)*800 + i*50)
}));

const sampleTickers = [
  {symbol: 'US100', price: 17123.4, chg: +0.6},
  {symbol: 'USDJPY', price: 155.12, chg: -0.4},
  {symbol: 'AAPL', price: 176.23, chg: +1.8},
  {symbol: 'BTCUSD', price: 65432, chg: -0.9},
];

const sampleTrades = [
  {id: 1, pair: 'US100', type: 'Long', size: '$1,200', pnl: '+$420', time: '2025-11-12 14:23'},
  {id: 2, pair: 'USDJPY', type: 'Short', size: '$800', pnl: '-$55', time: '2025-11-12 11:02'},
  {id: 3, pair: 'AAPL', type: 'Long', size: '$500', pnl: '+$30', time: '2025-11-11 09:15'},
];

export default function TradingDashboard() {
  const [tickers, setTickers] = useState(sampleTickers);
  const [equity, setEquity] = useState(sampleEquity);

  // Theme colors (Naol prefers golden & black)
  const GOLD = '#D4AF37';
  const BLACK = '#0b0b0b';

  // Example: periodically 'simulate' price changes (replace with real API/websocket)
  useEffect(()=>{
    const id = setInterval(()=>{
      setTickers(prev => prev.map(t => ({
        ...t,
        price: +(t.price * (1 + (Math.random()-0.5)/500)).toFixed(2),
        chg: +((Math.random()-0.5)*1.2).toFixed(2)
      })));
      setEquity(prev => [...prev.slice(1), {time: `T${prev.length+1}`, value: Math.round(prev[prev.length-1].value*(1 + (Math.random()-0.5)/200))}]);
    }, 3500);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900" style={{fontFamily: 'Inter, system-ui'}}>
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full" style={{background: GOLD, boxShadow: '0 6px 20px rgba(212,175,55,0.15)'}}></div>
          <div>
            <h1 className="text-xl font-semibold">Naol Trading</h1>
            <p className="text-xs text-gray-500">Trading & analytics dashboard</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-md text-sm border border-gray-200">Dashboard</button>
          <button className="px-4 py-2 rounded-md text-sm">Markets</button>
          <button className="px-4 py-2 rounded-md text-sm">Strategies</button>
          <button className="px-4 py-2 rounded-md text-sm bg-black text-white" style={{background: BLACK}}>Connect Broker</button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: hero + tickers */}
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Live Market Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time snapshot of your key instruments</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Account Balance</p>
              <p className="text-lg font-medium">$10,450</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {tickers.map(t => (
              <div key={t.symbol} className="p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">{t.symbol}</div>
                    <div className="text-lg font-semibold">{t.price.toLocaleString()}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-sm font-medium`} style={{background: t.chg >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.08)'}}>
                    {t.chg >= 0 ? `+${t.chg}%` : `${t.chg}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equity} margin={{top:8,right:0,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.35}/>
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{fontSize:11}}/>
                <YAxis tickFormatter={(v)=>`$${(v/1000).toFixed(1)}k`} tick={{fontSize:11}}/>
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke={GOLD} fill="url(#goldGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </section>

        {/* Right column: portfolio & trades */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Portfolio Value</p>
                <p className="text-lg font-semibold">$10,450</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">+2.4%</p>
                <p className="text-xs text-gray-400">Today</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 rounded-md border border-gray-200 text-sm">Deposit</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium">Recent Trades</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {sampleTrades.map(tr=> (
                <li key={tr.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{tr.pair} <span className="text-xs text-gray-400">· {tr.type}</span></div>
                    <div className="text-xs text-gray-400">{tr.time}</div>
                  </div>
                  <div className={`text-sm font-semibold ${tr.pnl.startsWith('+')? 'text-green-600' : 'text-red-600'}`}>{tr.pnl}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium">Quick Watch</h3>
            <div className="mt-3 flex flex-col gap-2">
              <select className="rounded-md border border-gray-200 p-2 text-sm">
                <option>US100</option>
                <option>USDJPY</option>
                <option>AAPL</option>
                <option>BTCUSD</option>
              </select>
              <button className="py-2 rounded-md bg-black text-white text-sm" style={{background: BLACK}}>Place Market Order</button>
            </div>
          </div>
        </aside>

        {/* Full width section: Trade history table */}
        <section className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trade History</h3>
            <div className="text-sm text-gray-500">Showing recent 10 trades</div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-2">#</th>
                  <th className="py-2">Pair</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Size</th>
                  <th className="py-2">P/L</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {sampleTrades.map(t => (
                  <tr key={t.id} className="border-t border-gray-100">
                    <td className="py-3">{t.id}</td>
                    <td className="py-3 font-medium">{t.pair}</td>
                    <td className="py-3">{t.type}</td>
                    <td className="py-3">{t.size}</td>
                    <td className={`py-3 ${t.pnl.startsWith('+')? 'text-green-600':'text-red-600'}`}>{t.pnl}</td>
                    <td className="py-3 text-xs text-gray-400">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} Naol Trading — built with ❤️</div>
          <div className="flex items-center gap-4">
            <div className="text-xs">Theme:</div>
            <div className="w-4 h-4 rounded-full" style={{background: GOLD}}></div>
            <div className="w-4 h-4 rounded-full" style={{background: BLACK}}></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
