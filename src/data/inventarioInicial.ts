import type { Producto } from '../types/Producto';

// Creamos un arreglo (lista) de productos de prueba
export const inventarioPrueba: Producto[] = [
  { 
    id: 'PROD-001', 
    nombre: 'Harina Pan Blanca 1kg', 
    precioUSD: 1.20, 
    stock: 50, 
    categoria: 'Víveres' 
  },
  { 
    id: 'PROD-002', 
    nombre: 'Mantequilla Mavesa 500g', 
    precioUSD: 2.50, 
    stock: 15, 
    categoria: 'Víveres' 
  },
  { 
    id: 'PROD-003', 
    nombre: 'Coca-Cola 2L', 
    precioUSD: 2.00, 
    stock: 24, 
    categoria: 'Bebidas' 
  },
  { 
    id: 'PROD-004', 
    nombre: 'Piruetas (Paquete 3 palitos)', 
    precioUSD: 0.80, 
    stock: 30, 
    categoria: 'Snacks' 
  }
];