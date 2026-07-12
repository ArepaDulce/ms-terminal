export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  precioUSD: number;
  categoria: string;
  stock: number;
  minStock: number;
}