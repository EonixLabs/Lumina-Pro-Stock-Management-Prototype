import React, { useState, useRef, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { askInventoryAssistant } from '../services/geminiService';

interface AIChatbotProps {
  products: Product[];
}

const AIChatbot: React.FC<AIChatbotProps> = ({ products }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "System initialized. I am your Lumina Intelligence Assistant. I have live access to your inventory, pricing models, and sales history. How can I assist with your stock analysis today?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { 
      role: 'user', 
      content: input, 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await askInventoryAssistant(input, products);
    
    const assistantMessage: ChatMessage = { 
      role: 'assistant', 
      content: response, 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[75vh] md:h-[calc(100vh-10rem)] flex flex-col bg-white rounded-2xl md:rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300">
      
      {/* --- Header --- */}
      <div className="px-4 py-4 md:px-8 md:py-6 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight truncate">AI Analyst</h2>
            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 truncate">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              Live Sync Active
            </p>
          </div>
        </div>
        
        {/* Badge hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:flex gap-2">
          <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Gemini 3 Flash
          </div>
        </div>
      </div>

      {/* --- Chat Messages Area --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50/30 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`
              max-w-[85%] md:max-w-[75%] px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-[24px] 
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-100' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
              }
            `}>
              <p className="text-[13px] md:text-[14px] font-medium whitespace-pre-wrap leading-relaxed tracking-tight break-words">
                {msg.content}
              </p>
              <p className={`text-[9px] md:text-[10px] mt-2 md:mt-3 font-bold uppercase tracking-widest opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white border border-slate-100 px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-[24px] rounded-tl-none flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* --- Input Form --- */}
      <form onSubmit={handleSend} className="p-4 md:p-8 border-t border-slate-100 bg-white shrink-0">
        <div className="flex gap-2 md:gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full pl-4 pr-3 py-3 md:pl-6 md:pr-4 md:py-5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-medium text-sm transition-all"
              placeholder="Query stock trends..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
          </div>
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="
              bg-indigo-600 text-white 
              px-4 py-3 md:px-8 md:py-5 
              rounded-xl md:rounded-2xl 
              font-black text-xs uppercase tracking-[0.2em] 
              hover:bg-indigo-700 disabled:opacity-40 
              shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] 
              flex items-center justify-center gap-3 shrink-0
            "
          >
            {/* Text hidden on mobile, visible on desktop */}
            <span className="hidden md:inline">Execute</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        
        {/* Footer Text */}
        <div className="flex items-center justify-center gap-2 mt-3 md:mt-6">
           <p className="text-[8px] md:text-[9px] text-slate-300 text-center uppercase tracking-[0.3em] font-black">
            Secured Intelligence Pipeline
          </p>
        </div>
      </form>
    </div>
  );
};

export default AIChatbot;