import { useState, useEffect } from 'react';
import { inventarioPrueba } from '../data/inventarioInicial';
import type { ItemCarrito } from '../types/ItemCarrito';
import type { Producto } from '../types/Producto';

export function usePOS() {
  const [tasaActual, setTasaActual] = useState<number>(() => {
    const tasaGuardada = localStorage.getItem('pos_tasa');
    return tasaGuardada ? parseFloat(tasaGuardada) : 39.59;
  });
  
  const [inventario, setInventario] = useState<Producto[]>(() => {
    const invGuardado = localStorage.getItem('pos_inventario');
    return invGuardado ? JSON.parse(invGuardado) : inventarioPrueba;
  });

  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const [historialVentas, setHistorialVentas] = useState<any[]>(() => {
    const ventasGuardadas = localStorage.getItem('pos_ventas');
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
  });

  // --- VIGÍAS DE PERSISTENCIA ---
  useEffect(() => localStorage.setItem('pos_tasa', tasaActual.toString()), [tasaActual]);
  useEffect(() => localStorage.setItem('pos_inventario', JSON.stringify(inventario)), [inventario]);
  useEffect(() => localStorage.setItem('pos_ventas', JSON.stringify(historialVentas)), [historialVentas]);

  // --- LÓGICA DEL CARRITO ---
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find((item) => item.producto.id === producto.id);
      const productoEnAlmacen = inventario.find((p) => p.id === producto.id);
      const stockDisponible = productoEnAlmacen ? productoEnAlmacen.stock : 0;

      if (existe) {
        if (existe.cantidad < stockDisponible) {
          return carritoActual.map((item) =>
            item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
          );
        }
        alert('⚠️ ¡No puedes añadir más unidades! Supera el stock disponible en almacén.');
        return carritoActual;
      }
      if (stockDisponible > 0) return [...carritoActual, { producto, cantidad: 1 }];
      alert('⚠️ Producto agotado.'); return carritoActual;
    });
  };

  const restarDelCarrito = (idProducto: string) => {
    setCarrito((c) => c.map(item => item.producto.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item).filter(item => item.cantidad > 0));
  };

  const eliminarDelCarrito = (idProducto: string) => {
    setCarrito((c) => c.filter(item => item.producto.id !== idProducto));
  };

  const cobrarVenta = () => {
    if (carrito.length === 0) return;
    const totalUSD = carrito.reduce((acc, item) => acc + (item.producto.precioUSD * item.cantidad), 0);
    const totalBs = totalUSD * tasaActual;

    const nuevoRecibo = {
      id: new Date().getTime().toString(),
      fecha: new Date().toLocaleString(),
      totalUSD, totalBs, items: carrito
    };

    setInventario((inv) => inv.map(prod => {
      const itemEnFactura = carrito.find(item => item.producto.id === prod.id);
      if (itemEnFactura) return { ...prod, stock: prod.stock - itemEnFactura.cantidad };
      return prod;
    }));

    setHistorialVentas((v) => [...v, nuevoRecibo]);
    alert('💸 ¡Venta registrada!');
    setCarrito([]); 
  };

  // ==========================================
  // NUEVOS SUPERPODERES (CRUD Y BACKUP)
  // ==========================================

  // 1. CRUD de Productos
  const crearProducto = (nuevo: Producto) => setInventario(prev => [nuevo, ...prev]);
  
  const actualizarProducto = (productoEditado: Producto) => {
    setInventario(prev => prev.map(p => p.id === productoEditado.id ? productoEditado : p));
  };
  
  const eliminarProducto = (id: string) => {
    setInventario(prev => prev.filter(p => p.id !== id));
    // Si borras un producto del inventario, también deberíamos quitarlo del carrito por seguridad
    setCarrito(prev => prev.filter(item => item.producto.id !== id));
  };

  // 2. Modificar Historial
  const borrarLogVenta = (idVenta: string) => {
    setHistorialVentas(prev => prev.filter(v => v.id !== idVenta));
  };

  const vaciarHistorial = () => {
    setHistorialVentas([]);
  };

  // 3. Sistema de Respaldo JSON
  const exportarRespaldo = () => {
    const data = { inventario, historialVentas };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `ms_pos_backup_${new Date().getTime()}.json`; 
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarRespaldo = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.inventario) setInventario(data.inventario);
      if (data.historialVentas) setHistorialVentas(data.historialVentas);
      alert('✅ Respaldo cargado con éxito. El sistema ha sido restaurado.');
    } catch (error) {
      alert('❌ Error al leer el archivo. Asegúrate de que sea un respaldo válido de MS POS.');
    }
  };

  return {
    tasaActual, setTasaActual, inventario, carrito, historialVentas,
    agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, cobrarVenta,
    crearProducto, actualizarProducto, eliminarProducto, borrarLogVenta, // Exportamos CRUD
    exportarRespaldo, importarRespaldo // Exportamos Respaldo
  };
}