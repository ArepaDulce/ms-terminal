import { useState, useMemo } from 'react';
import './App.css';
import { TasaBCV } from './components/TasaBCV';
import { ProductoCard } from './components/ProductoCard';
import { Carrito } from './components/Carrito';
import { Filtros } from './components/Filtros';
import { VistaHistorial } from './components/VistaHistorial';
import { VistaInventario } from './components/VistaInventario';
import { VistaConfiguracion } from './components/VistaConfiguracion';
import { Sidebar } from './components/Sidebar';
import { usePOS } from './hooks/usePOS';
import { CheckoutModal } from './components/CheckoutModal';
import { LoginScreen } from './components/LoginScreen';

function App() {
    const {
        tasaActual, setTasaActual, inventario, carrito, historialVentas,
        agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, cobrarVenta,
        exportarRespaldo, importarRespaldo, crearProducto, actualizarProducto,
        eliminarProducto, borrarLogVenta, vaciarHistorial, temaActual, setTemaActual,
        configuracion, setConfiguracion, sesion, setSesion
    } = usePOS();

    const [vistaActual, setVistaActual] = useState('pos');
    const [busqueda, setBusqueda] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [carritoExpandido, setCarritoExpandido] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [mostrarCheckout, setMostrarCheckout] = useState(false);

    // ⚠️ REGLA DE ORO: TODOS LOS HOOKS ARRIBA ⚠️
    const categoriasUnicas = useMemo(() => Array.from(new Set(inventario.map(p => p.categoria))), [inventario]);

    const inventarioFiltrado = useMemo(() => {
        return inventario.filter(prod => {
            const termino = busqueda.toLowerCase();
            const coincideBusqueda = prod.nombre.toLowerCase().includes(termino) || (prod.sku && prod.sku.toLowerCase().includes(termino));
            const coincideCategoria = categoriaFiltro === '' || prod.categoria === categoriaFiltro;
            return coincideBusqueda && coincideCategoria;
        });
    }, [inventario, busqueda, categoriaFiltro]);

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const totalUSD = carrito.reduce((acc, item) => acc + (item.producto.precioUSD * item.cantidad), 0);

    const manejarEscaneo = () => {
      if (!busqueda.trim()) return;
      const codigoEscaneado = busqueda.trim().toUpperCase();
      const prod = inventario.find(p => (p.sku || '').toUpperCase() === codigoEscaneado);
      if (prod) {
        agregarAlCarrito(prod);
        setBusqueda('');
      } else {
        alert(`Código SKU: ${codigoEscaneado} no encontrado en el inventario.`);
        setBusqueda(''); 
      }
    };

    // ⛔ INTERCEPTOR DE SEGURIDAD (Siempre DEBAJO de los Hooks) ⛔
    if (!sesion) {
        return <LoginScreen configuracion={configuracion} onLogin={setSesion} />;
    }

    return (
      <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
        {/* Overlay para móviles */}
        {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)}></div>}

        <div className={`sidebar-container ${menuAbierto ? 'open' : ''}`}>
          <Sidebar vistaActual={vistaActual} cambiarVista={(v) => { setVistaActual(v); setMenuAbierto(false); }} sesion={sesion} />
        </div>

        <div className="app-layout">
          <div className="main-content">
            
            {/* ENCABEZADO Y PERFIL DE USUARIO */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button className="menu-btn" onClick={() => setMenuAbierto(true)}>☰</button>
                <h1 style={{ color: 'var(--texto-principal)', margin: 0, fontSize: '24px' }}>
                  {configuracion.nombreNegocio || 'MS POS'} 🛒
                </h1>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--texto-principal)' }}>{sesion.nombre}</span>
                  <span style={{ fontSize: '11px', color: 'var(--acento-primario)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{sesion.rol}</span>
                </div>
                {configuracion.modoPOS === 'cajeros' && (
                  <button 
                    onClick={() => { setSesion(null); setVistaActual('pos'); }} 
                    style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--alerta)', color: 'var(--alerta)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Salir
                  </button>
                )}
              </div>
            </div>
            
            {/* RENDERIZADO DE VISTAS */}
            {vistaActual === 'pos' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
                    <TasaBCV tasa={tasaActual} setTasa={setTasaActual} />
                  </div>
                  <div style={{ flex: '2 1 300px' }}>
                    <Filtros 
                      busqueda={busqueda} 
                      setBusqueda={setBusqueda} 
                      categoriaFiltro={categoriaFiltro} 
                      setCategoriaFiltro={setCategoriaFiltro} 
                      categorias={categoriasUnicas} 
                      onEnter={manejarEscaneo} 
                    />
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
            )}

            {vistaActual === 'inventario' && <VistaInventario inventario={inventario} onCreate={crearProducto} onUpdate={actualizarProducto} onDelete={eliminarProducto} />}
            {vistaActual === 'historial' && <VistaHistorial ventas={historialVentas} onDeleteLog={borrarLogVenta} onClearHistory={vaciarHistorial} />}
            {vistaActual === 'configuracion' && <VistaConfiguracion configuracion={configuracion} setConfiguracion={setConfiguracion} temaActual={temaActual} cambiarTema={setTemaActual} onExportar={exportarRespaldo} onImportar={importarRespaldo} />}
            
          </div>

          {/* EL CARRITO */}
          {vistaActual === 'pos' && (
            <div className={`cart-bar ${carritoExpandido ? 'expanded' : ''}`}>
              <div className="cart-summary" onClick={() => setCarritoExpandido(!carritoExpandido)}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--texto-principal)' }}>${totalUSD.toFixed(2)}</span>
                  <span style={{ fontSize: '14px', color: 'var(--texto-secundario)', fontWeight: 'bold' }}>Bs {(totalUSD * tasaActual).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--texto-secundario)' }}>{carritoExpandido ? '🔽 Cerrar' : '🔼 Ver Pedido'}</span>
                  <div style={{ backgroundColor: 'var(--alerta)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>{totalItems}</div>
                </div>
              </div>
              <div className="cart-details">
                <Carrito 
                  items={carrito} 
                  tasaBCV={tasaActual} 
                  onSumar={agregarAlCarrito} 
                  onRestar={restarDelCarrito} 
                  onEliminar={eliminarDelCarrito} 
                  onCobrar={() => { setMostrarCheckout(true); setCarritoExpandido(false); }} 
                />
              </div>
            </div>
          )}

          {/* EL MODAL DE COBRO Y FACTURA */}
          {mostrarCheckout && (
            <CheckoutModal 
              carrito={carrito} 
              tasaBCV={tasaActual} 
              configuracion={configuracion}
              onCobrar={cobrarVenta} 
              onClose={() => setMostrarCheckout(false)} 
            />
          )}

        </div>
      </div>
    );
}

export default App;