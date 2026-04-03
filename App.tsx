import React, { useState, useCallback } from 'react';
import { View, Product } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import SalesTerminal from './components/SalesTerminal';
import AIChatbot from './components/AIChatbot';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const handleUpdateStock = useCallback((id: string, newLevel: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stockLevel: newLevel, lastUpdated: new Date().toISOString().split('T')[0] } : p
    ));
  }, []);

  const handleBulkUpdateStock = useCallback((updates: { id: string; newLevel: number }[]) => {
    const updateMap = new Map(updates.map(u => [u.id, u.newLevel]));
    setProducts(prev => prev.map(p => {
      if (updateMap.has(p.id)) {
        return { 
          ...p, 
          stockLevel: updateMap.get(p.id)!, 
          lastUpdated: new Date().toISOString().split('T')[0] 
        };
      }
      return p;
    }));
  }, []);

  const handleSellProduct = useCallback((id: string, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        stockLevel: Math.max(0, p.stockLevel - quantity),
        totalSales: p.totalSales + quantity,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : p
    ));
  }, []);

  const handleAddProduct = useCallback((newProd: Omit<Product, 'id' | 'totalSales' | 'lastUpdated'>) => {
    const id = (products.length + 1).toString();
    const fullProduct: Product = {
      ...newProd,
      id,
      totalSales: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [...prev, fullProduct]);
    return fullProduct;
  }, [products.length]);

  const handleDeleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard products={products} />;
      case 'inventory':
        return (
          <InventoryList 
            products={products} 
            onUpdateStock={handleUpdateStock} 
            onBulkUpdateStock={handleBulkUpdateStock}
            onAddProduct={handleAddProduct} 
          />
        );
      case 'sales':
        return <SalesTerminal products={products} onSellProduct={handleSellProduct} />;
      case 'ai-assistant':
        return <AIChatbot products={products} />;
      default:
        return <Dashboard products={products} />;
    }
  };

  return (
    // 1. Layout: Changed min-h-screen to h-screen + overflow-hidden to prevent body scroll
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      
      {/* Sidebar handles its own fixed/sticky positioning internally */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative w-full">
        {/* Responsive Container:
           - px-4: Standard padding for mobile
           - pt-20: Extra top padding on mobile to clear the 'Hamburger' menu button
           - md:p-8: Larger padding on Tablet/PC
           - md:pt-8: Reset top padding on Desktop (since sidebar is on the left)
        */}
        <div className="max-w-7xl mx-auto px-4 py-6 pt-20 md:p-8 md:pt-8 transition-all duration-300">
          {renderView()}
        </div>
      </main>

      {/* Global Voice Assistant */}
      {/* Ensure z-index is high enough to float above everything else */}
      <div className="fixed bottom-4 right-4 z-50">
        <VoiceAssistant 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateStock={handleUpdateStock}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default App;