import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryListProps {
  products: Product[];
  onUpdateStock: (id: string, newLevel: number) => void;
  onBulkUpdateStock: (updates: { id: string, newLevel: number }[]) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'totalSales' | 'lastUpdated'>) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ products, onUpdateStock, onBulkUpdateStock, onAddProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkValue, setBulkValue] = useState<number>(0);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Laptops',
    stockLevel: 0,
    minThreshold: 5,
    unitPrice: 0
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkAction = (action: 'add' | 'subtract' | 'set') => {
    const updates = products
      .filter(p => selectedIds.has(p.id))
      .map(p => {
        let newLevel = p.stockLevel;
        if (action === 'add') newLevel += bulkValue;
        else if (action === 'subtract') newLevel = Math.max(0, p.stockLevel - bulkValue);
        else if (action === 'set') newLevel = bulkValue;
        return { id: p.id, newLevel };
      });
    
    onBulkUpdateStock(updates);
    setSelectedIds(new Set());
    setBulkValue(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setIsModalOpen(false);
    setNewProduct({ name: '', category: 'Laptops', stockLevel: 0, minThreshold: 5, unitPrice: 0 });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Real-time stock control and catalog maintenance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          New Entry
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        {/* --- Search Bar --- */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search by SKU, name, or category..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedIds.size > 0 && (
            <div className="px-4 py-2 bg-indigo-50 rounded-xl text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2 animate-in fade-in slide-in-from-right-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              {selectedIds.size} Selected
            </div>
          )}
        </div>

        {/* --- VIEW 1: Desktop Table (Hidden on Mobile) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                    checked={selectedIds.size > 0 && selectedIds.size === filteredProducts.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Product Specs</th>
                <th className="px-6 py-4">Tag</th>
                <th className="px-6 py-4 text-center">In Stock</th>
                <th className="px-6 py-4">Threshold</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className={`transition-all group ${selectedIds.has(product.id) ? 'bg-indigo-50/40' : 'hover:bg-slate-50/30'}`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-800 text-[14px] leading-tight mb-0.5">{product.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SKU-{product.id.padStart(4, '0')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`flex items-center justify-center gap-2 text-sm font-bold ${product.stockLevel <= product.minThreshold ? 'text-rose-600' : 'text-slate-700'}`}>
                      {product.stockLevel}
                      {product.stockLevel <= product.minThreshold && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 animate-pulse"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-bold text-xs">{product.minThreshold}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">${product.unitPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => onUpdateStock(product.id, product.stockLevel + 1)}
                        className="p-2 hover:bg-white bg-slate-50 text-indigo-600 rounded-xl transition-all border border-slate-100 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                      </button>
                      <button 
                        onClick={() => onUpdateStock(product.id, Math.max(0, product.stockLevel - 1))}
                        className="p-2 hover:bg-white bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-slate-100 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- VIEW 2: Mobile Card List (Visible on Mobile) --- */}
        <div className="md:hidden bg-slate-50/30 p-4 space-y-4">
           {filteredProducts.map((product) => (
             <div 
               key={product.id}
               className={`bg-white p-5 rounded-2xl border transition-all ${
                 selectedIds.has(product.id) 
                   ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20' 
                   : 'border-slate-100 shadow-sm'
               }`}
             >
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-start gap-3">
                   <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{product.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">SKU-{product.id.padStart(4, '0')}</p>
                    </div>
                 </div>
                 <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold uppercase">
                    {product.category}
                  </span>
               </div>

               <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50 my-3">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Stock</p>
                    <p className={`text-sm font-black ${product.stockLevel <= product.minThreshold ? 'text-rose-600' : 'text-slate-800'}`}>
                      {product.stockLevel}
                    </p>
                  </div>
                  <div className="text-center border-l border-r border-slate-50">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Price</p>
                    <p className="text-sm font-black text-slate-800">${product.unitPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Safe Min</p>
                    <p className="text-sm font-black text-slate-400">{product.minThreshold}</p>
                  </div>
               </div>

               <div className="flex gap-2">
                 <button 
                    onClick={() => onUpdateStock(product.id, Math.max(0, product.stockLevel - 1))}
                    className="flex-1 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs border border-slate-100 active:bg-slate-100"
                 >
                   - Stock
                 </button>
                 <button 
                    onClick={() => onUpdateStock(product.id, product.stockLevel + 1)}
                    className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs border border-indigo-100 active:bg-indigo-100"
                 >
                   + Stock
                 </button>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* --- Bulk Action Toolbar --- */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-full max-w-xl z-40 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white p-3 md:p-4 rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 ring-1 ring-white/5">
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3 pl-1">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-xs shadow-inner">
                  {selectedIds.size}
                </span>
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-white/90 leading-none mb-1">Active</p>
                  <p className="text-[9px] md:text-[10px] text-white/50 font-medium">Batch Mode</p>
                </div>
              </div>
              
              {/* Close Button on Mobile (aligned right) */}
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="sm:hidden text-white/30 hover:text-white p-1"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="number"
                placeholder="Qty"
                className="w-full sm:w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                value={bulkValue || ''}
                onChange={(e) => setBulkValue(parseInt(e.target.value) || 0)}
              />
              <div className="flex gap-1 flex-1 sm:flex-none">
                <button 
                  onClick={() => handleBulkAction('add')}
                  className="flex-1 sm:flex-none px-3 py-2.5 bg-white/5 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest"
                >
                  ADD
                </button>
                <button 
                  onClick={() => handleBulkAction('set')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black transition-all shadow-lg shadow-indigo-900/40 uppercase tracking-widest"
                >
                  SET
                </button>
              </div>
            </div>

            {/* Close Button Desktop */}
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="hidden sm:block pr-2 text-white/30 hover:text-white transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* --- Add Product Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl md:rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200 m-2">
            <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">New Inventory</h3>
                <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Catalog your new products here.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-5">
              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Product Name</label>
                <input
                  required
                  placeholder="e.g. Wireless Precision Mouse"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all font-medium text-sm"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none appearance-none font-medium text-sm"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option>Laptops</option>
                    <option>Phones</option>
                    <option>Audio</option>
                    <option>Accessories</option>
                    <option>Tablets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Unit Value ($)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none font-medium text-sm"
                    value={newProduct.unitPrice}
                    onChange={e => setNewProduct({...newProduct, unitPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Opening Stock</label>
                  <input
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none font-medium text-sm"
                    value={newProduct.stockLevel}
                    onChange={e => setNewProduct({...newProduct, stockLevel: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Threshold</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none font-medium text-sm"
                    value={newProduct.minThreshold}
                    onChange={e => setNewProduct({...newProduct, minThreshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4 md:pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 uppercase tracking-widest text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs transition-all"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;