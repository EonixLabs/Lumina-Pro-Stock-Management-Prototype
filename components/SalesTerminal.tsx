import React, { useState, useMemo } from 'react';
import { Product } from '../types';

interface SalesTerminalProps {
  products: Product[];
  onSellProduct: (id: string, quantity: number) => void;
}

const SalesTerminal: React.FC<SalesTerminalProps> = ({ products, onSellProduct }) => {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stockLevel > 0
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity < product.stockLevel) {
        setCart(cart.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.product.id !== id));
    if (cart.length <= 1) setIsMobileCartOpen(false);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, Math.min(item.quantity + delta, item.product.stockLevel));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.product.unitPrice * item.quantity), 0), 
  [cart]);

  const totalItems = useMemo(() => 
    cart.reduce((acc, item) => acc + item.quantity, 0), 
  [cart]);

  const handleCheckout = () => {
    cart.forEach(item => {
      onSellProduct(item.product.id, item.quantity);
    });
    setCart([]);
    setIsMobileCartOpen(false);
    alert("Transaction completed successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24 lg:pb-12 relative">
      
      {/* --- Left Column: Product Browser --- */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Point of Sale</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Efficient order processing terminal.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            placeholder="Search items to sell..."
            className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/40 transition-all cursor-pointer group flex flex-col h-full active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div>
                  <span className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                </div>
              </div>
              <div className="mt-auto pt-3 md:pt-4 flex justify-between items-end border-t border-slate-50">
                <p className="text-lg md:text-xl font-black text-slate-900 tracking-tight">${product.unitPrice.toLocaleString()}</p>
                <div className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md ${product.stockLevel < 5 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                  STOCK: {product.stockLevel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Right Column: Cart Section (Responsive) --- */}
      {/* 1. On Desktop (lg): It's a sticky column.
          2. On Mobile/Tablet: It's a full-screen modal controlled by isMobileCartOpen.
      */}
      <div className={`
        fixed inset-0 z-50 bg-white/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none lg:static lg:inset-auto lg:z-auto lg:col-span-1
        flex flex-col transition-all duration-300
        ${isMobileCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'}
      `}>
        <div className="w-full h-full lg:h-[calc(100vh-10rem)] lg:sticky lg:top-8 bg-white lg:rounded-[32px] lg:shadow-2xl lg:shadow-slate-200/50 lg:border lg:border-slate-100 flex flex-col overflow-hidden">
          
          {/* Cart Header */}
          <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              Active Order
            </h2>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                  {totalItems} Units
                </span>
              )}
              {/* Close Button (Mobile Only) */}
              <button 
                onClick={() => setIsMobileCartOpen(false)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-100 rounded-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cart is Empty</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Add items from the grid to begin.</p>
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center group bg-slate-50/50 p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-tight mb-1 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      ${item.product.unitPrice.toLocaleString()} / unit
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg h-8">
                       <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="px-2.5 h-full text-slate-400 hover:text-indigo-600 transition-colors"
                       >-</button>
                       <span className="text-xs font-bold text-slate-900 px-1 min-w-[1.5rem] text-center">{item.quantity}</span>
                       <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="px-2.5 h-full text-slate-400 hover:text-indigo-600 transition-colors"
                       >+</button>
                    </div>

                    <div className="text-right min-w-[3rem]">
                       <span className="font-black text-slate-900 text-sm tracking-tight block">
                         ${(item.quantity * item.product.unitPrice).toLocaleString()}
                       </span>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout */}
          <div className="p-6 md:p-8 bg-slate-900 text-white space-y-5 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
                <span className="font-bold text-sm tracking-tight">${totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tax (0%)</span>
                <span className="font-bold text-sm tracking-tight">$0.00</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Payable</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">${totalAmount.toLocaleString()}</p>
              </div>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl ${
                cart.length === 0 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40 active:scale-[0.98]'
              }`}
            >
              Confirm Transaction
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Floating Bottom Bar --- */}
      {/* Visible only on mobile (< lg) and when cart has items */}
      <div className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 lg:hidden
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${cart.length > 0 && !isMobileCartOpen ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0 pointer-events-none'}
      `}>
        <div className="bg-slate-900 text-white p-2 pl-4 pr-2 rounded-[24px] shadow-2xl flex items-center justify-between border border-white/10 ring-1 ring-white/5">
          <div>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Total</p>
            <p className="text-lg font-black tracking-tight leading-none">${totalAmount.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setIsMobileCartOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-900/40 active:scale-95 transition-transform"
          >
            <span>View Order</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{totalItems}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SalesTerminal;