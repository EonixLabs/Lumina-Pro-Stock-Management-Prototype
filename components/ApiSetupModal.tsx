import React, { useState } from 'react';

interface ApiSetupModalProps {
  onSave: (apiKey: string) => void;
}

const ApiSetupModal: React.FC<ApiSetupModalProps> = ({ onSave }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-8 md:p-12 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight mb-2">Connect AI Engine</h2>
        <p className="text-sm font-medium text-slate-500 text-center mb-8">
          To use the Voice Assistant and AI Analyst features, please provide your Gemini API key. Your key is stored securely in your browser's session and never leaves your device.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-sm transition-all text-slate-900"
              placeholder="AIzaSy..."
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-indigo-600 text-white px-8 py-4 rounded-xl md:rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 disabled:opacity-40 disabled:hover:shadow-none transition-all duration-300"
          >
            Authenticate Session
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">
            Get a free API Key &#8594;
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiSetupModal;
