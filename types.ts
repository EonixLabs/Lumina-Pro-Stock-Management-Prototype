
export interface Product {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  minThreshold: number;
  unitPrice: number;
  totalSales: number;
  lastUpdated: string;
}

export type View = 'dashboard' | 'inventory' | 'sales' | 'ai-assistant';

export interface InventoryStats {
  totalValue: number;
  lowStockItems: number;
  topSeller: string;
  categoryDistribution: { name: string; value: number }[];
  stockHistory: { name: string; stock: number }[];
}

// Added ChatMessage interface to fix import error in AIChatbot.tsx
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}