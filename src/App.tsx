import { useState } from 'react';
import './App.css';
import { TasaBCV } from './components/TasaBCV';
import { ProductoCard } from './components/ProductoCard';
import { Carrito } from './components/Carrito';
import { inventarioPrueba } from './data/inventarioInicial';
import type { ItemCarrito } from './types/ItemCarrito';
import type { Producto } from './types/Producto';

function App() {
  const [tasaActual, setTasaActual] = useState<number>(39.59);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  // 1. Función para agregar o sumar productos
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find((item) => item.producto.id === producto.id);
      
      if (existe) {
        if (existe.cantidad < producto.stock) {
          return carritoActual.map((item) =>
            item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
          );
        }
        alert('⚠️ ¡No hay suficiente mercancía en almacén!');
        return carritoActual;
      }
      
      return [...carritoActual, { producto, cantidad: 1 }];
    });
  };

  // 2. Función para quitar 1 unidad
  const restarDelCarrito = (idProducto: string) => {
    setCarrito((carritoActual) => {
      return carritoActual.map((item) => {
        if (item.producto.id === idProducto) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      }).filter((item) => item.cantidad > 0);
    });
  };

  // 3. Función para sacar el producto por completo
  const eliminarDelCarrito = (idProducto: string) => {
    setCarrito((carritoActual) => carritoActual.filter((item) => item.producto.id !== idProducto));
  };

  // 4. Función para la caja (simular el cobro)
  const cobrarVenta = () => {
    alert('¡Venta procesada con éxito! 💸 Imprimiendo factura...');
    setCarrito([]); // Vaciamos la lista para el siguiente cliente
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        Modern Store POS 🛒
      </h1>
      
      {/* Tres columnas ultra-responsivas */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* COLUMNA 1: Tasa (Panel Izquierdo) */}
        <div style={{ flex: '1 1 200px', maxWidth: '260px' }}>
          <TasaBCV tasa={tasaActual} setTasa={setTasaActual} />
        </div>

        {/* COLUMNA 2: Catálogo (Centro) */}
        <div style={{ flex: '2 1 400px' }}>
          <h2 style={{ color: '#7f8c8d', fontSize: '18px', marginTop: 0, marginBottom: '15px' }}>
            Vitrina de Productos
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {inventarioPrueba.map((producto) => (
              <ProductoCard 
                key={producto.id} 
                producto={producto} 
                tasaBCV={tasaActual} 
                onAgregarAlCarrito={agregarAlCarrito} 
              />
            ))}
          </div>
        </div>

        {/* COLUMNA 3: Factura (Panel Derecho) */}
        <div style={{ flex: '1 1 280px', maxWidth: '350px' }}>
          <Carrito 
            items={carrito} 
            tasaBCV={tasaActual} 
            onSumar={agregarAlCarrito}
            onRestar={restarDelCarrito}
            onEliminar={eliminarDelCarrito}
            onCobrar={cobrarVenta}
          />
        </div>
        
      </div>
    </div>
  );
}

export default App;