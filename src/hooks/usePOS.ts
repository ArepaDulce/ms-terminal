import { useState, useEffect } from 'react';
import type { ItemCarrito } from '../types/ItemCarrito';
import type { Producto } from '../types/Producto';

export function usePOS() {
  const [temaActual, setTemaActual] = useState<string>(() => localStorage.getItem('pos_tema') || 'oscuro');
  const [tasaActual, setTasaActual] = useState<number>(() => parseFloat(localStorage.getItem('pos_tasa') || '39.59'));
  const [inventario, setInventario] = useState<Producto[]>(() => JSON.parse(localStorage.getItem('pos_inventario') || '[]'));
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [historialVentas, setHistorialVentas] = useState<any[]>(() => JSON.parse(localStorage.getItem('pos_ventas') || '[]'));
  const [configuracion, setConfiguracion] = useState(() => {
    const confGuardada = localStorage.getItem('pos_configuracion');
    const defaultConf = {
      nombreNegocio: '', rif: '', direccion: '', telefono: '',
      usarSKU: true, imprimirFactura: true, cobroRapido: false,
      modoPOS: 'unico', // NUEVO: 'unico' o 'cajeros'
      pinAdmin: '0000', // NUEVO: PIN maestro del Administrador
      cajeros: []       // NUEVO: Array de empleados
    };
    return confGuardada ? { ...defaultConf, ...JSON.parse(confGuardada) } : defaultConf;
  });

  // NUEVO: Estado de la sesión actual
  const [sesion, setSesion] = useState<any>(() => {
    const confGuardada = localStorage.getItem('pos_configuracion');
    const conf = confGuardada ? JSON.parse(confGuardada) : {};
    // Si es modo único (o no hay configuración), entra directo como Admin.
    return (!conf.modoPOS || conf.modoPOS === 'unico') ? { rol: 'admin', nombre: 'Administrador' } : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaActual);
    localStorage.setItem('pos_tema', temaActual);
  }, [temaActual]);

  useEffect(() => localStorage.setItem('pos_tasa', tasaActual.toString()), [tasaActual]);
  useEffect(() => localStorage.setItem('pos_inventario', JSON.stringify(inventario)), [inventario]);
  useEffect(() => localStorage.setItem('pos_ventas', JSON.stringify(historialVentas)), [historialVentas]);
  useEffect(() => localStorage.setItem('pos_configuracion', JSON.stringify(configuracion)), [configuracion]);

  useEffect(() => {
    const obtenerTasaBCV = async () => {
      try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (res.ok) {
          const data = await res.json();
          const valorReal = Number(Number(data.promedio || data.venta).toFixed(2));
          setTasaActual(valorReal);
        }
      } catch (e) { console.warn("No se pudo conectar a la API del BCV."); }
    };
    obtenerTasaBCV();
  }, []);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((c) => {
      const existe = c.find((i) => i.producto.id === producto.id);
      if (existe) {
        if (existe.cantidad < producto.stock) return c.map((i) => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
        return c;
      }
      return [...c, { producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id: string) => setCarrito((c) => c.map(i => i.producto.id === id ? { ...i, cantidad: i.cantidad - 1 } : i).filter(i => i.cantidad > 0));
  const eliminarDelCarrito = (id: string) => setCarrito((c) => c.filter(i => i.producto.id !== id));

  const cobrarVenta = (pagadoUSD: number) => {
    if (carrito.length === 0) return null;
    
    const totalUSD = carrito.reduce((acc, item) => acc + (item.producto.precioUSD * item.cantidad), 0);
    const totalBs = totalUSD * tasaActual;
    const vueltoUSD = Math.max(0, pagadoUSD - totalUSD);
    
    // Generar correlativo de factura tipo #000001
    const numeroFactura = (historialVentas.length + 1).toString().padStart(6, '0');

    const nuevoRecibo = {
      id: new Date().getTime().toString(),
      numero: numeroFactura,
      fecha: new Date().toLocaleString('es-VE'),
      totalUSD, totalBs, pagadoUSD, vueltoUSD,
      items: carrito
    };

    setInventario((inv) => inv.map(prod => {
      const itemEnFactura = carrito.find(item => item.producto.id === prod.id);
      if (itemEnFactura) return { ...prod, stock: prod.stock - itemEnFactura.cantidad };
      return prod;
    }));

    setHistorialVentas((v) => [...v, nuevoRecibo]);
    setCarrito([]); 
    
    return nuevoRecibo; // Devolvemos el recibo para mostrarlo en pantalla
  };

  const crearProducto = (p: Producto) => setInventario(prev => [p, ...prev]);
  const actualizarProducto = (p: Producto) => setInventario(prev => prev.map(old => old.id === p.id ? p : old));
  const eliminarProducto = (id: string) => setInventario(prev => prev.filter(p => p.id !== id));
  const borrarLogVenta = (id: string) => setHistorialVentas(prev => prev.filter(v => v.id !== id));
  const vaciarHistorial = () => setHistorialVentas([]);

  const exportarRespaldo = () => {
    const data = { inventario, historialVentas };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `backup_${new Date().getTime()}.json`; a.click();
  };

  const importarRespaldo = (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.inventario) setInventario(data.inventario);
      if (data.historialVentas) setHistorialVentas(data.historialVentas);
    } catch(e) { alert("Error al importar"); }
  };

  return {
    tasaActual, setTasaActual, inventario, carrito, historialVentas,
    agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, cobrarVenta,
    crearProducto, actualizarProducto, eliminarProducto, borrarLogVenta, vaciarHistorial,
    exportarRespaldo, importarRespaldo, temaActual, setTemaActual, configuracion, setConfiguracion,
    sesion, setSesion
  };
}