import React, { useState } from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  // State to manage mobile sidebar visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleViewChange = (view: View) => {
    onViewChange(view);
    // Close sidebar automatically on mobile when an item is clicked
    setIsMobileOpen(false);
  };

  const menuItems = [
    { 
      id: 'dashboard' as View, 
      label: 'Dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      ) 
    },
    { 
      id: 'inventory' as View, 
      label: 'Inventory', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      ) 
    },
    { 
      id: 'sales' as View, 
      label: 'POS Terminal', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      ) 
    },
    { 
      id: 'ai-assistant' as View, 
      label: 'AI Insights', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
      ) 
    },
  ];

  return (
    <>
      {/* --- Mobile Toggle Button --- */}
      {/* Visible only on mobile (< md). */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600"
        aria-label="Toggle Menu"
      >
        {isMobileOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        )}
      </button>

      {/* --- Mobile Backdrop --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside 
        className={`
          bg-white border-r border-slate-200 flex flex-col h-screen 
          shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          
          /* 1. Mobile (default): Fixed, Full Width (64), Slide-in logic */
          fixed top-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}

          /* 2. Tablet (md): Sticky, Collapsed Width (20 = 5rem) */
          md:translate-x-0 md:static md:sticky md:top-0 md:w-20
          
          /* 3. Desktop (lg): Full Width (64 = 16rem) */
          lg:w-64
        `}
      >
        <div className="p-4 lg:p-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10 pl-2 md:pl-0 md:justify-center lg:justify-start"> 
            <div className="w-10 h-10 min-w-[2.5rem] bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            {/* Logic: Hidden on Tablet (md), Visible on Desktop (lg) */}
            <span className="font-bold text-lg text-slate-800 tracking-tight md:hidden lg:block">Lumina Pro</span>
          </div>
          
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group
                  
                  /* Tablet: Center icons, remove padding */
                  md:justify-center md:px-0 
                  
                  /* Desktop: Align start, restore padding */
                  lg:justify-start lg:px-4

                  ${currentView === item.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
                title={item.label} // Tooltip for tablet users
              >
                <span className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </span>
                
                {/* Logic: Hidden on Tablet (md), Visible on Desktop (lg) */}
                <span className="text-[14px] md:hidden lg:block">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 lg:p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-slate-200 md:justify-center md:bg-transparent md:border-0 lg:justify-start lg:bg-slate-50 lg:border">
            <img src="https://picsum.photos/80/80?random=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" alt="Profile" />
            
            {/* Logic: Hidden on Tablet (md), Visible on Desktop (lg) */}
            <div className="flex-1 min-w-0 md:hidden lg:block">
              <p className="text-[13px] font-bold text-slate-800 truncate leading-none mb-1">Alex Manager</p>
              <p className="text-[11px] text-slate-500 truncate font-medium uppercase tracking-wider">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;