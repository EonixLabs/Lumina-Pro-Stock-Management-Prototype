import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, Type, LiveServerMessage } from '@google/genai';
import { Product } from '../types';

interface VoiceAssistantProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id' | 'totalSales' | 'lastUpdated'>) => void;
  onUpdateStock: (id: string, level: number) => void;
  onDeleteProduct: (id: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ products, onAddProduct, onUpdateStock, onDeleteProduct }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'processing'>('idle');
  
  // Refs for Audio Handling
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // --- Helper Functions ---

  const findProductByName = (name: string) => {
    return products.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encodeAudio = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // --- Core Logic ---

  const stopAssistant = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('idle');
  };

  const startAssistant = async () => {
    try {
      setStatus('connecting');
      setIsActive(true);

      const ai = new GoogleGenAI({ apiKey: "AIzaSyA0ekLVgTC1rlsMMjq-sxnHNOSWWyjNQbw" });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are the voice interface for "Lumina Pro" stock management. 
          The user is a store manager. You can add, update, and delete products. 
          When a user gives a command, execute the relevant tool. 
          Confirm your actions clearly and concisely. 
          If you need clarification (e.g. which product to delete), ask the user.
          Current inventory count: ${products.length}.`,
          tools: [{
            functionDeclarations: [
              {
                name: 'add_product',
                description: 'Add a new product to inventory',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    stock: { type: Type.NUMBER }
                  },
                  required: ['name', 'category', 'price', 'stock']
                }
              },
              {
                name: 'update_stock',
                description: 'Update stock level of an existing product',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: 'Product name' },
                    new_level: { type: Type.NUMBER }
                  },
                  required: ['name', 'new_level']
                }
              },
              {
                name: 'delete_product',
                description: 'Delete a product from inventory',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING }
                  },
                  required: ['name']
                }
              }
            ]
          }]
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64 = encodeAudio(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Playback
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Handle Tool Calls
            if (message.toolCall) {
              setStatus('processing');
              for (const fc of message.toolCall.functionCalls) {
                let result = "Action failed";
                
                if (fc.name === 'add_product') {
                  const args = fc.args as any;
                  onAddProduct({
                    name: args.name,
                    category: args.category,
                    unitPrice: args.price,
                    stockLevel: args.stock,
                    minThreshold: 5
                  });
                  result = `Successfully added ${args.name} to the catalog.`;
                } else if (fc.name === 'update_stock') {
                  const args = fc.args as any;
                  const p = findProductByName(args.name);
                  if (p) {
                    onUpdateStock(p.id, args.new_level);
                    result = `Updated ${p.name} stock to ${args.new_level}.`;
                  } else {
                    result = `Could not find a product named ${args.name}.`;
                  }
                } else if (fc.name === 'delete_product') {
                  const args = fc.args as any;
                  const p = findProductByName(args.name);
                  if (p) {
                    onDeleteProduct(p.id);
                    result = `Deleted ${p.name} from the inventory.`;
                  } else {
                    result = `Could not find product ${args.name} to delete.`;
                  }
                }

                sessionPromise.then(session => {
                  session.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result } }
                  });
                });
                setStatus('listening');
              }
            }
          },
          onclose: () => stopAssistant(),
          onerror: () => stopAssistant()
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error(error);
      stopAssistant();
    }
  };

  return (
    // Responsive Positioning:
    // Mobile: bottom-24 (to clear Floating Action Bars)
    // Desktop: bottom-8
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[60] flex flex-col items-end">
      
      {/* Status Bubble */}
      <div className={`
        mb-4 mr-2 bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/10 flex items-center gap-2
        transition-all duration-300 origin-bottom-right
        ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}
      `}>
        <span className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`}></span>
        {status === 'connecting' ? 'Initializing AI...' : status === 'listening' ? 'Listening...' : 'Thinking...'}
      </div>

      {/* Main Mic Button */}
      <button
        onClick={isActive ? stopAssistant : startAssistant}
        className={`
          w-14 h-14 md:w-16 md:h-16 
          rounded-full flex items-center justify-center 
          transition-all duration-300 shadow-2xl 
          hover:scale-105 active:scale-95 border-4 relative
          ${isActive 
            ? 'bg-rose-600 border-rose-500 shadow-rose-200' 
            : 'bg-indigo-600 border-indigo-500 shadow-indigo-200'
          }
        `}
      >
        {isActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8"><rect width="12" height="12" x="6" y="6" rx="2"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        )}
        
        {/* Pulse Ring Animation */}
        {isActive && status === 'listening' && (
          <span className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></span>
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;