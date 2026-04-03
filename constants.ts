
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'MacBook Pro M3', category: 'Laptops', stockLevel: 15, minThreshold: 5, unitPrice: 1999.99, totalSales: 45, lastUpdated: '2024-05-10' },
  { id: '2', name: 'iPhone 15 Pro', category: 'Phones', stockLevel: 32, minThreshold: 10, unitPrice: 1099.99, totalSales: 120, lastUpdated: '2024-05-12' },
  { id: '3', name: 'Sony WH-1000XM5', category: 'Audio', stockLevel: 8, minThreshold: 5, unitPrice: 349.99, totalSales: 88, lastUpdated: '2024-05-11' },
  { id: '4', name: 'iPad Air', category: 'Tablets', stockLevel: 3, minThreshold: 10, unitPrice: 599.99, totalSales: 35, lastUpdated: '2024-05-09' },
  { id: '5', name: 'Samsung S24 Ultra', category: 'Phones', stockLevel: 18, minThreshold: 5, unitPrice: 1299.99, totalSales: 52, lastUpdated: '2024-05-13' },
  { id: '6', name: 'Dell XPS 15', category: 'Laptops', stockLevel: 7, minThreshold: 5, unitPrice: 1499.99, totalSales: 28, lastUpdated: '2024-05-08' },
  { id: '7', name: 'AirPods Pro 2', category: 'Audio', stockLevel: 50, minThreshold: 15, unitPrice: 249.99, totalSales: 150, lastUpdated: '2024-05-14' },
  { id: '8', name: 'Logitech MX Master 3S', category: 'Accessories', stockLevel: 4, minThreshold: 10, unitPrice: 99.99, totalSales: 210, lastUpdated: '2024-05-13' },
];

export const CATEGORIES = ['Laptops', 'Phones', 'Audio', 'Tablets', 'Accessories'];
