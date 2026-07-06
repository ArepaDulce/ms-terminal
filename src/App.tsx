import { useState, useMemo, useRef } from 'react';
import './App.css';
import { TasaBCV } from './components/TasaBCV';
import { ProductoCard } from './components/ProductoCard';
import { Carrito } from './components/Carrito';
import { Filtros } from './components/Filtros';
import { HistorialModal } from './components/HistorialModal';
import { AdminModal } from './components/AdminModal'; // Importamos el Panel CRUD
import { usePOS } from './hooks/usePOS';

function App() {
  const { 
    tasaActual, setTasaActual, 
    inventario, 
    carrito, 
    historialVentas, 
    agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, cobrarVenta,
    exportarRespaldo, importarRespaldo,
    crearProducto, actualizarProducto, eliminarProducto, borrarLogVenta,
    vaciarHistorial
  } = usePOS();

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [carritoExpandido, setCarritoExpandido] = useState(false);
  
  // NUEVO ESTADO: Controla si el panel de Admin está abierto
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoriasUnicas = useMemo(() => {
    const categorias = inventario.map(p => p.categoria);
    return Array.from(new Set(categorias));
  }, [inventario]);

  const inventarioFiltrado = useMemo(() => {
    return inventario.filter(prod => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaFiltro === '' || prod.categoria === categoriaFiltro;
      return coincideBusqueda && coincideCategoria;
    });
  }, [inventario, busqueda, categoriaFiltro]);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalUSD = carrito.reduce((acc, item) => acc + (item.producto.precioUSD * item.cantidad), 0);

  const manejarSubida = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        importarRespaldo(result);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <div className="app-layout">
        
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h1 style={{ color: 'var(--texto-principal)', margin: 0, fontSize: '24px' }}>
              Modern Store POS 🛒
            </h1>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* NUEVO BOTÓN: Abre el panel de inventario */}
              <button onClick={() => setMostrarAdmin(true)} style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--texto-principal)', border: '1px dashed var(--acento-primario)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⚙️ Inventario
              </button>

              <button onClick={exportarRespaldo} style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--texto-principal)', border: '1px solid var(--borde-suave)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⬇️ Guardar Info
              </button>
              <button onClick={() => fileInputRef.current?.click()} style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--texto-principal)', border: '1px solid var(--borde-suave)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⬆️ Subir Info
              </button>
              <input type="file" accept=".json" ref={fileInputRef} onChange={manejarSubida} style={{ display: 'none' }} />

              <button onClick={() => setMostrarHistorial(true)} style={{ backgroundColor: 'var(--acento-primario)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                📊 Cierre de Caja
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
              <TasaBCV tasa={tasaActual} setTasa={setTasaActual} />
            </div>
            <div style={{ flex: '2 1 300px' }}>
              <Filtros busqueda={busqueda} setBusqueda={setBusqueda} categoriaFiltro={categoriaFiltro} setCategoriaFiltro={setCategoriaFiltro} categorias={categoriasUnicas} />
            </div>
          </div>

          <h2 style={{ color: 'var(--texto-secundario)', fontSize: '18px', marginTop: 0 }}>
            Catálogo de Productos {inventarioFiltrado.length === 0 && '(No hay resultados)'}
          </h2>
          <div className="vitrina-grid">
            {inventarioFiltrado.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} tasaBCV={tasaActual} onAgregarAlCarrito={agregarAlCarrito} />
            ))}
          </div>
        </div>

        <div className={`cart-bar ${carritoExpandido ? 'expanded' : ''}`}>
          <div className="cart-summary" onClick={() => setCarritoExpandido(!carritoExpandido)}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--texto-principal)' }}>
                ${totalUSD.toFixed(2)}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--texto-secundario)', fontWeight: 'bold' }}>
                Bs {(totalUSD * tasaActual).toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: 'var(--texto-secundario)' }}>{carritoExpandido ? '🔽 Cerrar' : '🔼 Ver Pedido'}</span>
              <div style={{ backgroundColor: 'var(--alerta)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                {totalItems}
              </div>
            </div>
          </div>

          <div className="cart-details">
            <Carrito 
              items={carrito} 
              tasaBCV={tasaActual} 
              onSumar={agregarAlCarrito}
              onRestar={restarDelCarrito}
              onEliminar={eliminarDelCarrito}
              onCobrar={() => {
                cobrarVenta();
                setCarritoExpandido(false);
              }}
            />
          </div>
        </div>

      </div>

      {mostrarHistorial && (
        <HistorialModal 
          ventas={historialVentas} 
          onCerrar={() => setMostrarHistorial(false)} 
          onDeleteLog={borrarLogVenta} 
          onClearHistory={vaciarHistorial}
        />
      )}

      {/* RENDERIZADO DEL PANEL CRUD */}
      {mostrarAdmin && (
        <AdminModal 
          inventario={inventario}
          onClose={() => setMostrarAdmin(false)}
          onCreate={crearProducto}
          onUpdate={actualizarProducto}
          onDelete={eliminarProducto}
        />
      )}
      
    </div>
  );
}

export default App;