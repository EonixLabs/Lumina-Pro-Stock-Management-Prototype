import React, { useMemo } from 'react';
import { Product } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';

interface DashboardProps {
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  const stats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.stockLevel * p.unitPrice), 0);
    const lowStockCount = products.filter(p => p.stockLevel <= p.minThreshold).length;
    const sortedBySales = [...products].sort((a, b) => b.totalSales - a.totalSales);
    const topSeller = sortedBySales[0]?.name || 'N/A';

    const stockHistory = products.map(p => ({ 
      name: p.name, 
      stock: p.stockLevel, 
      threshold: p.minThreshold 
    }));

    const categoryDataMap = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.stockLevel;
      return acc;
    }, {} as Record<string, number>);
    const categoryDistribution = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

    const revenueDataMap = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + (p.totalSales * p.unitPrice);
      return acc;
    }, {} as Record<string, number>);
    const revenueDistribution = Object.entries(revenueDataMap).map(([name, value]) => ({ name, value }));

    const topPerformers = sortedBySales.slice(0, 5).map(p => ({
      name: p.name,
      sales: p.totalSales
    }));

    const priceVolumeData = products.map(p => ({
      x: p.unitPrice,
      y: p.totalSales,
      name: p.name,
      z: p.stockLevel
    }));

    return { 
      totalValue, 
      lowStockCount, 
      topSeller, 
      categoryDistribution, 
      stockHistory, 
      revenueDistribution,
      topPerformers,
      priceVolumeData
    };
  }, [products]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      {/* --- Header --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">Business intelligence for Lumina Gadgets inventory.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] md:text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 uppercase tracking-wider">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            System Live
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] md:text-[11px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200 uppercase tracking-wider">
            v2.4 Final
          </div>
        </div>
      </header>

      {/* --- Metric Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Inventory Value" 
          value={`$${stats.totalValue.toLocaleString()}`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} 
          color="indigo" 
        />
        <StatCard 
          title="Stock Alerts" 
          value={stats.lowStockCount.toString()} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>} 
          color="rose" 
          isWarning={stats.lowStockCount > 0} 
        />
        <StatCard 
          title="Total SKUs" 
          value={products.length.toString()} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>} 
          color="amber" 
        />
        <StatCard 
          title="Top Performer" 
          value={stats.topSeller} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>} 
          color="emerald" 
          isTextSmall 
        />
      </div>

      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* Full Width on XL screens */}
        <ChartContainer title="Inventory Health Distribution" className="xl:col-span-2">
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.stockHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="stock" fill="#6366f1" radius={[4, 4, 0, 0]} name="Current Stock" />
                <Bar dataKey="threshold" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Safe Min" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Revenue by Category">
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.revenueDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.revenueDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Sales Momentum">
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats.topPerformers} margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={90} fontSize={10} tick={{ fill: '#64748b', fontWeight: '600' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Market Performance Matrix" className="xl:col-span-2">
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Price" unit="$" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" name="Sales" fontSize={10} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="z" range={[50, 250]} name="Stock" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                          <p className="font-bold text-slate-900 mb-1 text-xs">{data.name}</p>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-500 font-medium">Price: <span className="text-slate-900">${data.x}</span></p>
                            <p className="text-[10px] text-slate-500 font-medium">Sales: <span className="text-slate-900">{data.y} units</span></p>
                            <p className="text-[10px] text-indigo-600 font-bold">Stock: {data.z}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Products" data={stats.priceVolumeData} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Asset Composition">
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}`}
                  labelLine={false}
                >
                  {stats.categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

// --- Helper Components ---

const ChartContainer = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-5 md:p-6 rounded-2xl md:rounded-[24px] shadow-sm border border-slate-100 transition-hover hover:shadow-md ${className}`}>
    <h3 className="text-[10px] md:text-[11px] font-bold text-slate-400 mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-[0.1em]">
      <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color, isWarning = false, isTextSmall = false }: { title: string, value: string, icon: React.ReactNode, color: string, isWarning?: boolean, isTextSmall?: boolean }) => (
  <div className={`bg-white p-5 md:p-6 rounded-2xl md:rounded-[28px] shadow-sm border transition-all hover:-translate-y-1 duration-300 ${isWarning ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100'}`}>
    <div className="flex justify-between items-start mb-4 md:mb-6">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${
        color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
        color === 'rose' ? 'bg-rose-50 text-rose-600' :
        color === 'amber' ? 'bg-amber-50 text-amber-600' :
        'bg-emerald-50 text-emerald-600'
      }`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 md:w-6 md:h-6" })}
      </div>
      {isWarning && (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
      )}
    </div>
    <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{title}</p>
    <p className={`font-black text-slate-900 truncate ${isTextSmall ? 'text-base md:text-lg' : 'text-xl md:text-2xl'}`}>{value}</p>
  </div>
);

export default Dashboard;